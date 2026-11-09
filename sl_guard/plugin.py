"""Plugin entrypoint for InvenTree 1.6.1."""

from django.core.exceptions import ValidationError
from django.urls import path
from plugin import InvenTreePlugin
from plugin.mixins import SettingsMixin, UrlsMixin, ValidationMixin, UserInterfaceMixin

from .serializer_bridge import install_serializer_bridge
from .i18n import tr

from .policy import (
    authorized_exception_for,
    needs_authorization,
    parse_ids,
)


class SLGuard(SettingsMixin, ValidationMixin, UrlsMixin, UserInterfaceMixin, InvenTreePlugin):
    """Block relocation and removal/replacement of protected StockLocation types."""

    NAME = "SL Guard"
    SLUG = "sl-guard"
    TITLE = "SL Guard"
    DESCRIPTION = "Protect stock locations from unauthorized relocation and type changes"
    AUTHOR = "SntPartizan"
    VERSION = "0.3.1"
    LICENSE = "MIT"

    # IDs, not names. The admin can also configure these through config API.
    SETTINGS = {
        "PROTECTED_TYPE_IDS": {
            "name": "Protected StockLocationType IDs",
            "description": "Comma-separated type IDs, e.g. 2,7. Empty = no protection.",
            "default": "",
        },
        "ALLOWED_GROUP_IDS": {
            "name": "Authorized group IDs",
            "description": "Comma-separated group IDs. Superusers are always authorized.",
            "default": "",
        },
        "SHOW_NAVIGATION": {
            "name": "Show SL Guard in navigation",
            "description": "Show the SL Guard shortcut in the main navigation. Access rights are unchanged.",
            "default": True,
            "validator": bool,
        },
        "SHOW_DASHBOARD_WIDGET": {
            "name": "Show SL Guard dashboard widget",
            "description": "Make the SL Guard quick-access widget available on the dashboard.",
            "default": True,
            "validator": bool,
        },
    }

    def protected_types(self):
        return parse_ids(self.get_setting("PROTECTED_TYPE_IDS", cache=False))

    def allowed_groups(self):
        return parse_ids(self.get_setting("ALLOWED_GROUP_IDS", cache=False))

    def is_authorized(self, user):
        """Special plugin permission; standard InvenTree 'stock.change' remains required."""
        if not user or not user.is_authenticated or not user.is_active:
            return False
        if user.is_superuser:
            return True
        ids = self.allowed_groups()
        return bool(ids) and user.groups.filter(pk__in=ids).exists()

    def validate_model_instance(self, instance, deltas=None):
        # This hook is invoked by StockLocation.save() in InvenTree 1.6.1.
        from stock.models import StockLocation

        if not isinstance(instance, StockLocation) or not instance.pk:
            return None

        old = StockLocation.objects.filter(pk=instance.pk).values(
            "location_type_id", "parent_id"
        ).first()
        if old is None:
            return None  # New SL: protected type can be assigned normally.

        protected = self.protected_types()
        if not protected:
            return None

        old_type = old["location_type_id"]
        old_parent = old["parent_id"]
        new_type = instance.location_type_id
        new_parent = instance.parent_id

        if old_type == new_type and old_parent == new_parent:
            return None  # Non-sensitive fields remain editable.

        # Moving an unprotected ancestor also moves its protected descendants.
        has_protected_descendant = False
        if old_parent != new_parent and old_type not in protected:
            has_protected_descendant = instance.get_descendants().filter(
                location_type_id__in=protected
            ).exists()

        if not needs_authorization(
            old_type, old_parent, new_type, new_parent,
            protected, has_protected_descendant,
        ):
            return None

        if authorized_exception_for(instance.pk, new_parent, new_type):
            return None

        # Standard StockLocation PATCH (including barcode scan-in) uses
        # LocationSerializer; the bridge supplies the authenticated request
        # user on the in-memory instance. No client-controlled attribute is
        # accepted, and ordinary model saves without request remain protected.
        request_user = getattr(instance, '_slg_validated_request_user', None)
        if request_user is not None and self.is_authorized(request_user):
            from users.permissions import check_user_permission

            if (check_user_permission(request_user, StockLocation, 'change')
                    and instance.check_ownership(request_user)):
                return None

        errors = {}
        if old_parent != new_parent:
            errors["parent"] = tr('error_protected_relocation')
        if old_type != new_type and old_type in protected:
            errors["location_type"] = tr('error_change_protected_type')
        raise ValidationError(errors)

    def _can_use_management_ui(self, request):
        from stock.models import StockLocation
        from users.permissions import check_user_permission

        return (
            self.is_authorized(request.user)
            and check_user_permission(request.user, StockLocation, 'change')
        )

    def get_ui_navigation_items(self, request, context, **kwargs):
        if not self.get_setting('SHOW_NAVIGATION', cache=False):
            return []
        if not self._can_use_management_ui(request):
            return []
        return [{
            'key': 'slg-bulk-assign-navigation',
            'title': '🛡️ SL Guard',
            # InvenTree 1.6.1 ignores icons on plugin navigation tabs.
            # Keep the icon hint, while the title uses the same shield as the widget.
            'icon': 'ti:shield-lock',
            'options': {'url': 'plugin/sl-guard/manage'},
        }]

    def get_ui_dashboard_items(self, request, context, **kwargs):
        """An optional native InvenTree dashboard widget (no core patches)."""
        if not self.get_setting('SHOW_DASHBOARD_WIDGET', cache=False):
            return []
        if not self._can_use_management_ui(request):
            return []

        from stock.models import StockLocation

        protected_types = self.protected_types()
        protected_count = (
            StockLocation.objects.filter(location_type_id__in=protected_types).count()
            if protected_types else 0
        )
        return [{
            'key': 'sl-guard-dashboard',
            'title': 'SL Guard',
            'description': tr('protected_stock_locations'),
            'icon': 'ti:shield-lock',
            'source': self.plugin_static_file('sl_guard_dashboard.js:renderDashboardItem'),
            'options': {'width': 3, 'height': 3},
            'context': {
                'protected_count': protected_count,
                'protected_type_count': len(protected_types),
                'locale': (context or {}).get('locale', ''),
                'url': 'plugin/sl-guard/manage',
            },
        }]

    def get_ui_routes(self, request, context, **kwargs):
        # A hidden shortcut does not remove the URL: admins can use the panel
        # through an existing bookmark or the dashboard widget.
        if not self._can_use_management_ui(request):
            return []
        return [{
            'key': 'slg-bulk-assign',
            'title': 'SL Guard',
            'source': self.plugin_static_file('sl_guard_panel.js:renderGuardPage'),
            'options': {'path': 'manage'},
        }]

    def setup_urls(self):
        from .views import (
            ConfigView, ChangeView, PanelRedirectView,
            LocationsView, BulkTypeView,
        )

        return [
            path('config/', ConfigView.as_view(plugin=self), name='config'),
            path('change/', ChangeView.as_view(plugin=self), name='change'),
            path('locations/', LocationsView.as_view(plugin=self), name='locations'),
            path('bulk-type/', BulkTypeView.as_view(plugin=self), name='bulk-type'),
            path('panel/', PanelRedirectView.as_view(plugin=self), name='panel'),
        ]


# No patch to InvenTree files: connect the standard DRF LocationSerializer to
# the existing model-level guard when the plugin module is discovered.
install_serializer_bridge()
