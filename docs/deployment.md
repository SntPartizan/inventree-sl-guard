# Deployment notes

- Prefer a staging or development InvenTree instance for the first installation.
- Always back up InvenTree database and relevant config first.
- Install in the *same* Python virtualenv / container layer as the active InvenTree instance; do not use system Python by accident.
- Enable `plugins_enabled` and activate the plugin in the admin UI.
- Restart each web and background worker process that imports plugin code.
- Run `python manage.py collectplugins` in the configured InvenTree environment and hard-refresh the frontend when updating the JavaScript panel.
- Verify installed version with `python -m pip show inventree-sl-guard`.
- Test one ordinary user and one administrator on non-production stock locations.

The built-in barcode UI of InvenTree 1.6.1 may display a generic message for failed operations. The server still returns a field-specific message; a separate optional source-level UI patch is not required for protection itself.
