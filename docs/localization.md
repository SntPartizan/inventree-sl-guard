# Localization / Локализация

The embedded admin page follows InvenTree's `context.locale` from the `UserInterfaceMixin` React route.
The plugin ships with a small self-contained English / Russian string catalog; it does **not** modify InvenTree's global Lingui catalogs or require extra frontend dependencies.

- `en`, `en-US`, and every locale other than `ru*`: English.
- `ru`, `ru-RU`, `ru_RU`: Russian.
- The names, full paths, and type names supplied by the InvenTree API remain unchanged, regardless of UI language.
- Django-side validation and API errors follow Django's active locale (normally set by request language middleware), which could differ from the SPA setting.
- The plugin name and static settings metadata are currently English only.

To add another language, update the in-file `EN` text catalog in `sl_guard_panel.js` or move to structured locale files, and extend `selectLocale` / `tr` accordingly. Do not translate user-entered location names or IDs.

Панель управления выбирает русский или английский по языку интерфейса InvenTree. Данные локаций не переводятся. Ошибки сервера используют язык Django и могут отличаться от языка браузерной панели.
