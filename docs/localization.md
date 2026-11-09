# Localization / Локализация

The plugin uses **one shared localization catalog**: `sl_guard/locales/en.json` and
`sl_guard/locales/ru.json`. All strings have stable semantic keys such as
`protected_types`, `search_locations`, and `error_protected_relocation`.
Do not use Russian or English sentence text as a translation key.

- `sl_guard/i18n.py` reads those JSON files as packaged resources for Django-side
  validation errors and plugin metadata.
- `sl_guard/static/sl_guard_i18n.js` is **generated** from those same JSON
  files for the panel and dashboard. Never edit that JS file by hand.
- Both UI components use `tr('translation_key', {parameters})`.
- Python uses `tr('translation_key', parameter=value)`.
- `en`, `en-US`, and all locales other than `ru*`: English (fallback).
- `ru`, `ru-RU`, and `ru_RU`: Russian.
- The React panel reads `context.locale` from InvenTree; the dashboard reads
  the dashboard context. Django API errors follow Django's active request
  language, which can differ from the SPA preference.
- Location names, paths, ID values, and type names supplied by InvenTree
  remain unchanged, regardless of UI locale.
- The plugin name and static settings metadata are intentionally English.

## Editing translations / Изменение переводов

1. Add or update the **same key** in both `en.json` and `ru.json`.
2. Preserve named placeholders (e.g. `{count}`, `{type}`) in both languages.
3. Generate browser JavaScript: `python tools/build_i18n.py`.
4. Run `python tools/build_i18n.py --check` and the Python/JS test suites.
5. Commit JSON changes **and** the generated JavaScript.

The CI validates identical key sets, matching placeholders, the generated
module and all translation lookups. It also checks that JSON catalogs are
included in the wheel. Additional languages require extending the language
selectors in the Python and JavaScript locale helpers.

**Русский:** переводы панели, виджета и Python API теперь используют единые
JSON-словари. JS-модуль генерируется автоматически. В текстах используются
стабильные ключи, а пользовательские данные склада не переводятся.
