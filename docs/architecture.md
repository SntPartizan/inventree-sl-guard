# Architecture

The plugin exposes `SettingsMixin`, `ValidationMixin`, `UserInterfaceMixin` and `UrlsMixin`.

1. `plugin.py` defines protected type/group settings and checks the old/current StockLocation fields.
2. The model validation hook prevents changing a protected node's parent or type, including moving an unprotected node with protected descendants.
3. `serializer_bridge.py` wraps `stock.serializers.LocationSerializer.validate()` **in process**. It obtains the already-authenticated DRF `request.user` and assigns a temporary attribute to the in-memory instance; the validation hook verifies group, regular StockLocation change permission, and ownership.
4. `views.py` offers group-authorized bulk type assignment with `transaction.atomic` and `select_for_update(of=('self',))` to avoid locking a nullable owner join. An exact-change ContextVar exception is used only within authenticated plugin endpoints.
5. `sl_guard_panel.js` registers an InvenTree UI route with selectable search fields and bulk workflow; the server always revalidates IDs and permissions.

## Compatibility risks

- Internal serializer methods are not a stable InvenTree plugin API. A change in imports, queryset behavior or serializer method order can break the request bridge.
- `save()` hooks cannot guarantee protection against all model updates, deletes, database writes, or tree library operations.
- The frontend JS expects InvenTree React/Axios services; test each supported upstream version.

See `docs/test-matrix.md` before publishing a stable release.
