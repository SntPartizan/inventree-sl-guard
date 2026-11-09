# Migration from Fixed Location Guard to SL Guard 0.3.0

This is a **plugin identity change**, not an ordinary wheel upgrade. Old settings are not automatically migrated. Perform migration in a maintenance window, with InvenTree inaccessible to ordinary users until protection is re-enabled. Test in the WSL/staging instance first.

1. **Back up** the InvenTree database and configuration. Record the currently configured `PROTECTED_TYPE_IDS` and `ALLOWED_GROUP_IDS` from the original plugin and note any navigation/dashboard settings. The database values of each StockLocation's `location_type` remain unchanged.
2. **Disable** the original `FixedLocationGuard` in Settings → Plugins. Stop all InvenTree web and worker processes before changing packages. The old in-memory serializer bridge will disappear on process restart.
3. In the correct Python environment, run:

   ```bash
   python -m pip uninstall inventree-fixed-location-guard
   python -m pip install --no-deps ./inventree_sl_guard-0.3.0-py3-none-any.whl
   ```

4. Restart InvenTree web and workers; in Settings → Plugins, activate **SLGuard**. Run `python manage.py collectplugins` with the same InvenTree config.
5. As a **superuser**, configure the saved protected type IDs, authorized group IDs, and quick-access settings under the new plugin. Do **not** allow ordinary users access to the system until these settings have been restored and enforcement verified.
6. Test denial under an ordinary user and allowed movement / type changes under a superuser. Check the panel at `/web/plugin/sl-guard/manage`, navigation and optional dashboard card. Refresh browser caches (Ctrl+F5).

**Notes:** Old URLs `/web/plugin/fixed-location-guard/manage` and old API paths are no longer valid. The old plugin can remain listed as inactive/uninstalled in the database; do not activate it alongside SLGuard. All protected types must be selected again; otherwise **new SL Guard does not enforce protection**. No existing stock-location records or type assignments are removed by the wheel change.

## Примечание по-русски

Перед заменой выпишите ID защищённых типов и разрешённых групп. Выключите прежний плагин, остановите InvenTree, удалите старый Python-пакет и установите `inventree-sl-guard`. После запуска активируйте **SLGuard** и заново назначьте защищённые типы и группы. До окончания настройки не открывайте рабочую систему кладовщикам: без указанных ID новый плагин ничего не блокирует.
