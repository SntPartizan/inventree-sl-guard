"""Minimal integration with the InvenTree 1.6.1 built-in StockLocation serializer.

The plugin model validation API does not receive the request/user. Rather than
using process globals or reading request credentials ourselves, we attach the
DRF-authenticated request.user to the in-memory location instance during
serializer validation, before its standard update method calls instance.save().

This monkey-patch is intentionally limited to `LocationSerializer.validate`.
When the plugin is disabled, the bridge is harmless (it only sets a private
attribute; no permission logic is changed outside the plugin).
"""

import logging

logger = logging.getLogger('inventree.sl_guard')


def install_serializer_bridge():
    from stock.serializers import LocationSerializer

    current = LocationSerializer.validate
    if getattr(current, '_slg_serializer_bridge', False):
        return

    def validate_with_request(self, attrs):
        result = current(self, attrs)
        instance = getattr(self, 'instance', None)
        if instance is not None:
            request = getattr(self, 'context', {}).get('request')
            user = getattr(request, 'user', None)
            # Never trust client POST/PATCH data as the source of identity.
            # DRF resolves request.user from its configured authentication.
            if user is not None and user.is_authenticated:
                instance._slg_validated_request_user = user
        return result

    validate_with_request._slg_serializer_bridge = True
    validate_with_request.__wrapped__ = current
    LocationSerializer.validate = validate_with_request
    logger.info('SLGuard serializer request bridge active')
