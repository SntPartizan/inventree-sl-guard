# Changelog

## 0.3.2 — beta (theme-aware interface and dashboard refinement)

- Replace emoji-style shield branding with a consistent **Tabler-style outline shield** in the SL Guard page header, protected-location count, and dashboard widget.
- Keep the standard InvenTree navigation tab clean: **SL Guard**, without an emoji or DOM monkey patch.
- Make **Protected / Locked** table badges follow the active InvenTree (Mantine) theme instead of using hardcoded orange colors.
- Improve the dashboard card: larger title and shield, centered values and captions, and a minimum width of one grid column (the dashboard retains users' existing saved layouts).
- Keep the protected-location summary cards neutral; emphasize the count with an outline icon instead of filling the card.
- Refresh the English/Russian README and PyPI package description; maintain the current shared translation catalogs.
- Expand automated regression tests for branding, SVG shape, theme variables, dashboard layout and packaging.
- **No permission or stock-location protection behavior changes.** Still verified on InvenTree 1.6.1; compatibility with other versions requires testing.

## 0.3.1 — beta (UI polish)

- Display the plugin as **SL Guard** in the InvenTree plugin list (unchanged slug `sl-guard`).
- Set author to **SntPartizan** in plugin metadata and package metadata.
- Show the same shield character in the plugin navigation tab and dashboard card without patching InvenTree core.
- Increase the dashboard widget's minimum height from 2 to 3 grid rows and reduce card spacing so the management link is visible.
- Update English/Russian documentation and regression tests. Protection rules remain unchanged.

## 0.3.0 — beta (breaking identity change)

- Renamed **all plugin identifiers** to SL Guard: Python distribution `inventree-sl-guard`, module `sl_guard`, entrypoint/class `SLGuard`, InvenTree slug `sl-guard`, static assets, API paths and dashboard routes.
- Rebranded navigation item, panel and dashboard item to **SL Guard** in every locale.
- Added independent `SHOW_NAVIGATION` and `SHOW_DASHBOARD_WIDGET` settings, editable through the embedded **Protection settings → Quick access** form.
- Added an optional InvenTree 1.6.1 dashboard card showing counts of protected locations/types and linking to the management panel.
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
