# Changelog

## 0.3.0 — beta (breaking identity change)

- Renamed **all plugin identifiers** to SL Guard: Python distribution `inventree-sl-guard`, module `sl_guard`, entrypoint/class `SLGuard`, InvenTree slug `sl-guard`, static assets, API paths and dashboard routes.
- Rebranded navigation item, panel and dashboard item to **SL Guard** in every locale.
- Added independent `SHOW_NAVIGATION` and `SHOW_DASHBOARD_WIDGET` settings, editable through the embedded **Protection settings → Quick access** form.
- Added an optional InvenTree 1.6.1 dashboard card showing counts of protected locations/types and linking to the management panel.
- The new plugin requires fresh protected-type / authorized-group configuration after migration; existing StockLocation type values are unaffected. See migration guide.
- Added dashboard and compatibility tests. Stock protection and bulk-update logic remain unchanged.

## 0.2.6 — beta

- Added English and Russian translations for the embedded React panel based on InvenTree `context.locale`; English is the default.
- Localized server-side validation and permission errors using Django active language.
- Switched plugin metadata and static setting labels to English for community distribution.
- Added locale regression tests.

## 0.2.5 — beta

- Enabled privileged users to use the normal InvenTree stock-location serializer path through a narrowly scoped authenticated-user bridge; regular users remain denied.
- Added clear permission errors from plugin validation; InvenTree 1.6.1 barcode UI can still mask the server's message.
- Prior 0.2.x changes: InvenTree UI route, multi-field/regex search, selection of stock locations using full paths and IDs, batch type assignment with transaction and preview, permission-controlled navigation, PostgreSQL row-lock fix, per-request 120s timeout and regex help.

## Notes

The first source snapshot was prepared at 0.2.5. Version 0.3.0 includes UI/branding changes and local tests, but still requires integration verification on a running InvenTree instance before public release.
