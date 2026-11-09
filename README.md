# InvenTree SL Guard

**Community-developed InvenTree plugin — v0.3.1 beta, verified on InvenTree 1.6.1.**

**A warehouse is a physical system, not an arbitrary tree of editable database records.** Rooms, aisles, racks and fixed shelves occupy real places. When their digital hierarchy changes without a matching change on the warehouse floor, the location map stops reflecting reality.

**A warehouse is not a nesting doll.** You cannot put the warehouse itself inside a cardboard box. A room does not belong in a bag; nor should a rack or fixed shelf suddenly become the child of a movable container in the digital location tree. **If the database says a shelf is inside a bag while the shelf is bolted to the wall, the database is wrong — not the physical world.**

SL Guard helps prevent such unauthorized structural rearrangements for **locations whose types an administrator has marked as protected**. It enforces those movement restrictions; it is not a general-purpose dimensional or physical-fit validator.

**SL Guard gives InvenTree's stock-location hierarchy a protected structural backbone.** Administrators designate types that represent fixed infrastructure. Unauthorized users cannot relocate those locations, change an existing protected type, or indirectly move protected descendants by moving an ancestor. Authorized staff can deliberately revise the layout, while everyday stock movements remain governed by normal InvenTree permissions.

**Keep the digital warehouse true to the physical one. Let inventory move — not the infrastructure around it.**

[![Support on Ko-fi](https://img.shields.io/badge/Support%20on-Ko--fi-FF5E5B?logo=kofi&logoColor=white)](https://ko-fi.com/sntpartizan)

SL Guard is free and open source. If you find it useful, you can [support continued development on Ko-fi](https://ko-fi.com/sntpartizan). Donations are entirely optional.

### Features

- Choose protected `StockLocationType` records by **database ID**, not by name.
- Let normal users **assign** a protected type when they have regular InvenTree stock-location edit permissions.
- Block changing the parent or removing/replacing an *existing* protected type, except for superusers and groups explicitly allowed by the plugin, subject to normal InvenTree permissions and ownership checks.
- Prevent indirect relocation of protected descendants when moving an unprotected ancestor.
- Bulk-assign types from an embedded panel: full hierarchical paths, selectable search fields (name, path, current type, ID), optional JavaScript regex, checkboxes, preview/dry-run, transactional server-side commit.
- Retain ordinary editing of names/descriptions, normal stock-item moves, and moves of locations without protected descendants.
- Optional **SL Guard** navigation shortcut and **SL Guard** dashboard widget (matching shield symbol). Both are independently configurable by the superuser; hiding either does not disable protection or remove the management route.

> **Compatibility caution:** This beta is tested on **InvenTree 1.6.1**, not on every InvenTree release. It wraps an internal `LocationSerializer.validate` method at runtime to pass the authenticated request user to the model validation hook. This is a monkey patch, not a stable public plugin API. Review and test before upgrading InvenTree.

## Installation from InvenTree (recommended)

**SL Guard 0.3.1 is published on [PyPI](https://pypi.org/project/inventree-sl-guard/).** Install it by package name using InvenTree's built-in plugin installer (verified on InvenTree 1.6.1).

1. Back up your database and configuration; test on a non-production instance first. Ensure external plugins are enabled (`plugins_enabled: true`).
2. Sign in as an **InvenTree superuser**, then open **Settings → Admin → Plugins → Install Plugin**.
3. Fill out the installer form:

   | Field | Value |
   | --- | --- |
   | Package Name | `inventree-sl-guard` |
   | Source URL | **Leave blank** (install from PyPI) |
   | Version | Leave blank |
   | Confirm plugin installation | Enabled |

4. Click **Install**. InvenTree runs pip in its own Python environment, discovers the plugin and collects its static files.
5. In the plugin list, **activate SL Guard** (listed as `SL Guard`). Restart the InvenTree web process and background workers if needed so all processes load the new code. If the UI still shows old JavaScript, hard-refresh the browser; run `manage.py collectplugins` with the correct InvenTree configuration only if static-file collection needs troubleshooting.
6. Configure **Protected StockLocationType IDs** and, optionally, **Authorized group IDs** in SL Guard settings. The management page is at `/web/plugin/sl-guard/manage` (relative to your InvenTree server).
7. Test that an ordinary user cannot relocate a protected stock location and that an authorized administrator can.

**Dashboard widget:** SL Guard makes the widget *available*, but does not add it automatically. Add it through the normal **Dashboard → Add Widgets** interface. The navigation item and dashboard widget can be enabled or disabled independently in SL Guard settings; disabling these shortcuts does not disable protection.

### Updating and GitHub alternative

For a PyPI installation, use **Update** in **Settings → Admin → Plugins** with package name `inventree-sl-guard`, a blank **Source URL**, and blank **Version** for the latest release. Review the displayed version and verify that protection still works after upgrading. Settings are preserved when upgrading the same `sl-guard` plugin, but should still be checked.

To install from the source repository instead of PyPI, supply **Source URL** `git+https://github.com/SntPartizan/inventree-sl-guard.git` in the installer; leave **Version** blank. If updating an existing GitHub installation, enter the same Git URL again, as InvenTree 1.6.1 may not remember it. For a reproducible source installation, pin the released tag: `git+https://github.com/SntPartizan/inventree-sl-guard.git@v0.3.1`.

### Alternative: manual wheel installation

For offline development or deployments where the GUI installer is unavailable, install a downloaded release wheel in the **same Python environment** as InvenTree:

```bash
python -m pip install --no-deps --upgrade ./inventree_sl_guard-0.3.1-py3-none-any.whl
```

Restart web and worker processes, activate the plugin and collect static files if needed. Do not run the command against an unrelated system Python environment.

The UI brand is **SL Guard** in every language. English and Russian panel translations are provided. The distribution is `inventree-sl-guard`, the plugin's display name is `SL Guard`, and its slug is `sl-guard`. 

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
