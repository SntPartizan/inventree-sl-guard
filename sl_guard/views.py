"""Permission-checked plugin endpoints for InvenTree 1.6.1.

For SPA authentication, requests arrive through InvenTree's Axios client and may
use its Token header. Never trust client-supplied protected/allowed flags.
"""

import logging

from django.contrib.auth.models import Group
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.http import HttpResponseRedirect
from rest_framework import serializers, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from stock.models import StockLocation, StockLocationType
from users.permissions import check_user_permission

from .policy import allow_exact_change, build_full_paths, needs_authorization, serialize_ids
from .i18n import tr

logger = logging.getLogger('inventree.sl_guard')
MAX_BATCH_SIZE = 500


def require_stock_change(user):
    """InvenTree role permission + authenticated active account."""
    if not user or not user.is_authenticated or not user.is_active:
        raise PermissionDenied(tr('error_user_inactive'))
    if not check_user_permission(user, StockLocation, 'change'):
        raise PermissionDenied(tr('error_stock_change_permission'))


def require_panel_access(plugin, user):
    """Administrative bulk panel: standard stock edit AND plugin authorization.

    Note: ordinary users can still assign a protected type for the first time
    through the normal InvenTree StockLocation editor, if their stock roles
    allow it. This restriction applies only to the bulk-management panel.
    """
    require_stock_change(user)
    if not plugin.is_authorized(user):
        raise PermissionDenied(tr('error_bulk_panel_permission'))


def validate_location_access(user, location):
    """Respect location ownership restrictions in addition to stock roles."""
    if not location.check_ownership(user):
        raise PermissionDenied(tr('error_location_ownership'))


def location_rows(user, protected_ids, allowed):
    """Return tree-ordered locations with full paths; no N+1 parent traversal.

    We load the complete tree to compute paths, but only return locations
    accessible under InvenTree's existing ownership checks.
    """
    rows = list(
        StockLocation.objects.order_by('tree_id', 'lft')
        .values('pk', 'name', 'parent_id', 'location_type_id', 'level')
    )
    # Permission on location ownership may involve model methods, so get objects
    # once for that check (the listing is intentionally limited to 2000).
    if len(rows) > 2000:
        raise ValidationError(tr('error_too_many_locations'))
    objects = {
        item.pk: item for item in
        StockLocation.objects.select_related('owner').filter(pk__in=[row['pk'] for row in rows])
    }
    paths = build_full_paths(rows)
    result = []
    for row in rows:
        pk = row['pk']
        parent = row['parent_id']
        obj = objects[pk]
        if not obj.check_ownership(user):
            continue
        protected = row['location_type_id'] in protected_ids
        result.append({
            'id': pk,
            'name': row['name'],
            'path': paths[pk],
            'parent_id': parent,
            'location_type_id': row['location_type_id'],
            'level': row['level'],
            'protected': protected,
            'editable': allowed or not protected,
        })
    return result


class ConfigSerializer(serializers.Serializer):
    protected_type_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True
    )
    allowed_group_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1), allow_empty=True
    )
    # Optional for backward compatibility with clients prior to v0.3.0.
    show_navigation = serializers.BooleanField(required=False)
    show_dashboard_widget = serializers.BooleanField(required=False)

    def validate(self, attrs):
        types = set(attrs['protected_type_ids'])
        groups = set(attrs['allowed_group_ids'])
        found_types = set(StockLocationType.objects.filter(pk__in=types).values_list('pk', flat=True))
        found_groups = set(Group.objects.filter(pk__in=groups).values_list('pk', flat=True))
        if found_types != types:
            raise ValidationError({'protected_type_ids': tr('error_unknown_location_type')})
        if found_groups != groups:
            raise ValidationError({'allowed_group_ids': tr('error_unknown_group')})
        attrs['protected_type_ids'] = types
        attrs['allowed_group_ids'] = groups
        return attrs


class ConfigView(APIView):
    """GET/PUT protected types and permission groups; superuser only."""

    plugin = None
    permission_classes = [IsAuthenticated]

    def _check_admin(self, request):
        if not request.user.is_active or not request.user.is_superuser:
            raise PermissionDenied(tr('error_settings_superuser_only'))

    def get(self, request):
        self._check_admin(request)
        return Response({
            'protected_type_ids': sorted(self.plugin.protected_types()),
            'allowed_group_ids': sorted(self.plugin.allowed_groups()),
            'show_navigation': bool(self.plugin.get_setting('SHOW_NAVIGATION', cache=False)),
            'show_dashboard_widget': bool(self.plugin.get_setting('SHOW_DASHBOARD_WIDGET', cache=False)),
            'types': list(StockLocationType.objects.order_by('name').values('id', 'name')),
            'groups': list(Group.objects.order_by('name').values('id', 'name')),
        })

    @transaction.atomic
    def put(self, request):
        self._check_admin(request)
        serializer = ConfigSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        self.plugin.set_setting('PROTECTED_TYPE_IDS', serialize_ids(data['protected_type_ids']))
        self.plugin.set_setting('ALLOWED_GROUP_IDS', serialize_ids(data['allowed_group_ids']))
        if 'show_navigation' in data:
            self.plugin.set_setting('SHOW_NAVIGATION', data['show_navigation'])
        if 'show_dashboard_widget' in data:
            self.plugin.set_setting('SHOW_DASHBOARD_WIDGET', data['show_dashboard_widget'])
        logger.info('sl_guard configuration updated by user_id=%s', request.user.pk)
        return self.get(request)


class LocationsView(APIView):
    """Single endpoint supplies all SLs + current StockLocationTypes for the SPA."""

    plugin = None
    permission_classes = [IsAuthenticated]

    def get(self, request):
        require_panel_access(self.plugin, request.user)
        protected = self.plugin.protected_types()
        allowed = self.plugin.is_authorized(request.user)
        return Response({
            'locations': location_rows(request.user, protected, allowed),
            'types': list(StockLocationType.objects.order_by('name').values('id', 'name')),
            'protected_type_ids': sorted(protected),
            'is_admin': bool(request.user.is_superuser),
            'can_manage_protected': allowed,
            'batch_limit': MAX_BATCH_SIZE,
            'plugin_version': self.plugin.VERSION,
        })


class BulkTypeSerializer(serializers.Serializer):
    location_ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        min_length=1, max_length=MAX_BATCH_SIZE,
    )
    location_type_id = serializers.IntegerField(min_value=1)
    dry_run = serializers.BooleanField(default=True)

    def validate_location_ids(self, ids):
        if len(ids) != len(set(ids)):
            raise ValidationError(tr('error_duplicate_location_ids'))
        return ids


def bulk_update_type(plugin, user, location_ids, type_id, dry_run):
    """Atomic all-or-nothing type assignment; only one normal type per SL."""
    with transaction.atomic():
        if not StockLocationType.objects.filter(pk=type_id).exists():
            raise ValidationError({'location_type_id': tr('error_type_does_not_exist')})

        # Row locks protect against races between preview and commit, but final
        # permission checks are always repeated on actual submission.
        locations = list(
            StockLocation.objects.select_related('owner').select_for_update(of=('self',))
            .filter(pk__in=location_ids).order_by('pk')
        )
        if len(locations) != len(location_ids):
            raise ValidationError({'location_ids': tr('error_locations_not_found')})

        authorized = plugin.is_authorized(user)
        protected_ids = plugin.protected_types()
        changed = []
        unchanged = []
        for location in locations:
            validate_location_access(user, location)
            if location.location_type_id == type_id:
                unchanged.append(location.pk)
                continue
            if needs_authorization(
                location.location_type_id,
                location.parent_id,
                type_id,
                location.parent_id,
                protected_ids,
            ) and not authorized:
                raise PermissionDenied(
                    tr('error_protected_type_special_permission')
                    + f'#{location.pk} — {location.name}'
                )
            changed.append(location)

        if not dry_run:
            for location in changed:
                old_type = location.location_type_id
                location.location_type_id = type_id
                # The context only allows exactly this SL/type/unchanged parent.
                # It never bypasses stock role and owner checks above.
                with allow_exact_change(location.pk, location.parent_id, type_id):
                    try:
                        location.full_clean()
                        location.save()
                    except DjangoValidationError as err:
                        if hasattr(err, 'message_dict'):
                            raise ValidationError(err.message_dict) from err
                        raise ValidationError(err.messages) from err
                logger.info(
                    'sl_guard bulk_type_change user_id=%s location_id=%s old_type_id=%s new_type_id=%s',
                    user.pk, location.pk, old_type, type_id,
                )

        return {
            'dry_run': dry_run,
            'selected': len(location_ids),
            'to_change': len(changed),
            'unchanged': len(unchanged),
            'changed_ids': [loc.pk for loc in changed],
            'type_id': type_id,
        }


class BulkTypeView(APIView):
    """Dry-run preview and server-validated commit for selected SLs."""

    plugin = None
    permission_classes = [IsAuthenticated]

    def post(self, request):
        require_panel_access(self.plugin, request.user)
        serializer = BulkTypeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        result = bulk_update_type(
            self.plugin,
            request.user,
            values['location_ids'],
            values['location_type_id'],
            values['dry_run'],
        )
        return Response(result)


class ChangeSerializer(serializers.Serializer):
    location_id = serializers.IntegerField(min_value=1)
    parent_id = serializers.IntegerField(min_value=1, allow_null=True, required=False)
    location_type_id = serializers.IntegerField(min_value=1, allow_null=True, required=False)

    def validate(self, attrs):
        if 'parent_id' not in attrs and 'location_type_id' not in attrs:
            raise ValidationError(tr('error_missing_change_fields'))
        return attrs


class ChangeView(APIView):
    """Compatible privileged endpoint retained from 0.1 for guarded relocation."""

    plugin = None
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        require_stock_change(request.user)
        if not self.plugin.is_authorized(request.user):
            raise PermissionDenied(tr('error_protected_move_permission'))

        serializer = ChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = serializer.validated_data
        location = StockLocation.objects.select_for_update().filter(pk=values['location_id']).first()
        if location is None:
            raise ValidationError({'location_id': tr('error_location_not_found')})
        validate_location_access(request.user, location)

        old_parent_id = location.parent_id
        old_type_id = location.location_type_id
        if 'parent_id' in values:
            new_parent_id = values['parent_id']
            if new_parent_id is not None:
                parent = StockLocation.objects.filter(pk=new_parent_id).first()
                if parent is None:
                    raise ValidationError({'parent_id': tr('error_parent_not_found')})
                if new_parent_id == location.pk or location.get_descendants().filter(pk=new_parent_id).exists():
                    raise ValidationError({'parent_id': tr('error_move_into_descendant')})
            location.parent_id = new_parent_id
        if 'location_type_id' in values:
            new_type_id = values['location_type_id']
            if new_type_id is not None and not StockLocationType.objects.filter(pk=new_type_id).exists():
                raise ValidationError({'location_type_id': tr('error_location_type_not_found')})
            location.location_type_id = new_type_id

        if (old_parent_id, old_type_id) == (location.parent_id, location.location_type_id):
            return Response({'changed': False, 'location_id': location.pk})

        try:
            with allow_exact_change(location.pk, location.parent_id, location.location_type_id):
                location.full_clean()
                location.save()
        except DjangoValidationError as err:
            if hasattr(err, 'message_dict'):
                raise ValidationError(err.message_dict) from err
            raise ValidationError(err.messages) from err
        logger.info(
            'sl_guard privileged_change user_id=%s location_id=%s parent=%s->%s type=%s->%s',
            request.user.pk, location.pk, old_parent_id, location.parent_id, old_type_id, location.location_type_id,
        )
        return Response({'changed': True, 'location_id': location.pk,
                         'parent_id': location.parent_id, 'location_type_id': location.location_type_id},
                        status=status.HTTP_200_OK)


class PanelRedirectView(APIView):
    """Old 0.1 panel URL redirects to the native InvenTree UI page."""
    plugin = None
    permission_classes = []

    def get(self, request):
        return HttpResponseRedirect('/web/plugin/sl-guard/manage')
