# InvenTree SL Guard

**Community-developed InvenTree plugin — v0.3.0 beta, verified on InvenTree 1.6.1.**

InvenTree treats racks, shelves and boxes as stock locations. This plugin lets an administrator mark selected **stock location types** as protected, so ordinary staff cannot accidentally relocate a rack or shelf — including indirectly by moving a containing location.

### Features

- Choose protected `StockLocationType` records by **database ID**, not by name.
- Let normal users **assign** a protected type when they have regular InvenTree stock-location edit permissions.
- Block changing the parent or removing/replacing an *existing* protected type, except for superusers and groups explicitly allowed by the plugin, subject to normal InvenTree permissions and ownership checks.
- Prevent indirect relocation of protected descendants when moving an unprotected ancestor.
- Bulk-assign types from an embedded panel: full hierarchical paths, selectable search fields (name, path, current type, ID), optional JavaScript regex, checkboxes, preview/dry-run, transactional server-side commit.
- Retain ordinary editing of names/descriptions, normal stock-item moves, and moves of locations without protected descendants.
- Optional **SL Guard** navigation shortcut and **SL Guard** dashboard widget (shield icon). Both are independently configurable by the superuser; hiding either does not disable protection or remove the management route.

> **Compatibility caution:** This beta is tested on **InvenTree 1.6.1**, not on every InvenTree release. It wraps an internal `LocationSerializer.validate` method at runtime to pass the authenticated request user to the model validation hook. This is a monkey patch, not a stable public plugin API. Review and test before upgrading InvenTree.

## Quick start

If you have an earlier Fixed Location Guard build installed, follow the [migration guide](docs/migrate-from-old-plugin.md) instead of installing a second plugin next to it.

1. Back up your InvenTree database and test in a non-production instance.
2. Install the package into the **same Python environment** as the running InvenTree service:

   ```bash
   python -m pip install --no-deps ./inventree_sl_guard-0.3.0-py3-none-any.whl
   ```

3. Enable external plugins (`plugins_enabled: true`) and restart the web process **and worker** (if applicable).
4. Activate **SL Guard** (internal plugin name: `SLGuard`) in the InvenTree admin plugin page. Enable plugin UI/URLs if your deployment requires them.
5. After installation or an update, run `python manage.py collectplugins` in the configured InvenTree environment. Refresh the browser.
6. Open the **SL Guard** navigation item (`/web/plugin/sl-guard/manage`), assign the desired type to existing locations, then select which types are protected and which groups are allowed.

The UI displays **SL Guard** in every language. Panel text supports English/Russian localization. **This is a new plugin identity**, not an in-place upgrade from Fixed Location Guard. The distribution name is `inventree-sl-guard`, the plugin name is `SLGuard` and its slug is `sl-guard`. Existing StockLocation type assignments stay in the database, but old plugin settings are not automatically transferred. Follow the [migration guide](docs/migrate-from-old-plugin.md) before installing it alongside an older build. The recommended GitHub repository is **`inventree-sl-guard`**.

To configure shortcuts, open **SL Guard → Protection settings → Quick access**, then toggle **Show SL Guard in navigation** and **Show SL Guard dashboard widget**. The dashboard widget must be added to the user's dashboard through the normal InvenTree dashboard customization controls.

See [Russian instructions](README_RU.md), [localization notes](docs/localization.md), and [deployment notes](docs/deployment.md).

## Permissions

| Operation | User with normal location-edit permission | Superuser / configured group (plus normal permissions) |
| --- | --- | --- |
| Assign a protected type to an unprotected location | Allowed | Allowed |
| Change an already-protected type | Blocked | Allowed |
| Move a protected location | Blocked | Allowed |
| Move an unprotected location containing protected descendants | Blocked | Allowed |
| Edit location name / description | Allowed | Allowed |

The settings (`PROTECTED_TYPE_IDS`, `ALLOWED_GROUP_IDS`) are administered by a superuser; a group ID alone does not replace InvenTree's own role and ownership checks.

## Search and bulk assignment

The page shows each location's **full path** and unique ID. Search checks **name only by default**, so a query for `Rack` will not match boxes merely because their ancestor is a rack. Enable path/type/ID matching separately. Regex examples: `Rack|Shelf` (OR), `^(Rack|Shelf)` (start of name), `\d+` (digits). Selection is always by primary key, not the displayed path. Preview before applying a batch.

For large batches the UI has a separate 120-second HTTP timeout. A browser timeout does **not** prove rollback: reload the list and check current types before retrying.

## Testing and packaging

```bash
python -m pip install -e . --no-deps
python -m pip install pytest build twine
python -m pytest -q tests
node --test tests/js/*.test.mjs
python -m build
python -m twine check dist/*
```

These tests cover policy, UI filtering and regression checks; they **do not** replace InvenTree/DB/API integration tests. [Required pre-release scenarios](docs/test-matrix.md).

## Security and limitations

- Model `save()` validation cannot catch all direct SQL, `QuerySet.update()`, tree-bulk operations, or deletion of protected types/locations. Do not advertise this plugin as a comprehensive database-level access-control solution.
- The authenticated-user integration is tied to InvenTree 1.6.1 internals. Verify the bridge on every supported version.
- The default InvenTree barcode-scanning UI may hide the error reason and show a generic message. An **optional** developer-only script is in `tools/patch_scan_error_ui.py`; it **modifies InvenTree frontend source** and is **not part of the wheel**. Do not apply it automatically.
- The embedded admin UI supports **English (default) and Russian** based on the InvenTree frontend locale. Server-side API errors use the active Django language. Plugin metadata and static settings labels use English.

For responsible disclosure see [SECURITY.md](SECURITY.md). Licensed under [MIT](LICENSE). This is an independent community project, not an official InvenTree component.
