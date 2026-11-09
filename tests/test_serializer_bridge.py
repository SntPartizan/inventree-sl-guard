"""Test the serializer integration with mock classes, no Django dependency."""
import sys
import types
from sl_guard.serializer_bridge import install_serializer_bridge


def test_bridge_uses_request_identity_only(monkeypatch):
    stock = types.ModuleType('stock')
    serializers = types.ModuleType('stock.serializers')

    class LocationSerializer:
        def __init__(self, request):
            self.instance = types.SimpleNamespace()
            self.context = {'request': request}
        def validate(self, attrs):
            return attrs

    serializers.LocationSerializer = LocationSerializer
    stock.serializers = serializers
    monkeypatch.setitem(sys.modules, 'stock', stock)
    monkeypatch.setitem(sys.modules, 'stock.serializers', serializers)
    install_serializer_bridge()
    install_serializer_bridge()  # idempotent
    user = types.SimpleNamespace(is_authenticated=True, pk=10)
    obj = LocationSerializer(types.SimpleNamespace(user=user))
    obj.validate({'parent': 13, '_slg_validated_request_user': 'attacker'})
    assert obj.instance._slg_validated_request_user is user
    anonymous = LocationSerializer(types.SimpleNamespace(user=types.SimpleNamespace(is_authenticated=False)))
    anonymous.validate({'parent': 5})
    assert not hasattr(anonymous.instance, '_slg_validated_request_user')
