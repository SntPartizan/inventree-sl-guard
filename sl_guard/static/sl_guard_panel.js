/* SL Guard — native InvenTree React route.
 * Uses shared window.React supplied by InvenTree (no second React instance).
 * All mutations are authorized again on the server; client flags are cosmetic.
 */
const h = (...args) => window.React.createElement(...args);
// English is the default; Russian is selected from InvenTree's UI locale.
const EN = {
  "API-контекст InvenTree недоступен.": "InvenTree API context is unavailable.",
  "Быстрый доступ": "Quick access",
  "Показывать SL Guard в меню навигации": "Show SL Guard in navigation",
  "Показывать виджет SL Guard на дашборде": "Show SL Guard dashboard widget",
  "Скрытие ссылки или виджета не изменяет права и не отключает защиту. Панель остаётся доступной по прямой ссылке.": "Hiding the navigation entry or dashboard widget does not change permissions or disable protection. The panel remains available through its direct URL.",
  "React недоступен в InvenTree": "React is unavailable in InvenTree",
  "^(Стеллаж|Полка)": "^(Rack|Shelf)",
  "^Стеллаж [0-9]+$": "^Rack [0-9]+$",
  "Без типа": "No type",
  "Будут изменены": "To be changed",
  "Важно: при поиске по «Полному пути» совпадение «Стеллаж» найдёт также вложенные в него коробки. Для выбора только стеллажей оставьте поле «Название».": "Important: searching the full path for “Rack” will also find boxes inside racks. To select racks only, search the Name field.",
  "Все локации": "All locations",
  "Всё название: «Стеллаж», пробел и одна или более цифр": "Entire name: “Rack”, space and one or more digits",
  "Выберите типы, для которых запрещено штатное изменение родителя и последующая смена типа без специального права.": "Choose the types whose parent and subsequent type changes require special permission.",
  "Выбранные места хранения (полный путь и ID):": "Selected stock locations (full path and ID):",
  "Выбрать локации": "Select locations",
  "Группы с правом управления": "Authorized groups",
  "Добавить найденные": "Add matching locations",
  "Доступно локаций": "Available locations",
  "Загружаем локации…": "Loading locations…",
  "Замок": "Locked",
  "Защищена": "Protected",
  "Защищены": "Protected",
  "Защищённые типы": "Protected types",
  "Изменение применяется одной транзакцией. После назначения защищённого типа обычные пользователи не смогут снять его или переместить SL.": "Changes are applied in one transaction. After assigning a protected type, ordinary users cannot remove it or move that stock location.",
  "Или стеллаж, или полка — скобки необязательны": "Matches either rack or shelf; parentheses are optional",
  "Искать в полях:": "Search fields:",
  "Исправьте регулярное выражение": "Fix the regular expression",
  "Кнопка «Выбрать только найденные» заменит весь выбор.": "The “Select matching only” button will replace the entire selection.",
  "Коробка (1|2|3)$": "Box (1|2|3)$",
  "Коробка 1, 2 или 3 в конце названия": "Box 1, 2 or 3 at the end of the name",
  "Максимум 256 символов": "Maximum 256 characters",
  "Массово назначить тип?": "Assign this type in bulk?",
  "Массовое назначение": "Bulk assignment",
  "Массовое назначение типа существующим локациям. Защита применяется автоматически по типу.": "Assign types to existing stock locations in bulk. Protection applies automatically by type.",
  "Название": "Name",
  "Название начинается с одного из двух слов; скобки объединяют варианты": "Name begins with either word; parentheses group alternatives",
  "Назначаемый тип": "Type to assign",
  "Назначить тип:": "Assign type:",
  "Настройка защиты": "Protection settings",
  "Настройки защиты сохранены. Все SL выбранных типов защищены.": "Protection settings saved. All locations with the selected types are now protected.",
  "Не защищены": "Unprotected",
  "Не удалось загрузить данные.": "Could not load data.",
  "Обычная": "Ordinary",
  "Обычный поиск ищет текст как написано. Включите «Regex /i» для регулярных выражений (регистр не учитывается). Поиск выполняется только по отмеченным полям; между выбранными полями действует ИЛИ.": "Plain search matches text literally. Enable “Regex /i” for case-insensitive regular expressions. Only checked fields are searched; matching across fields uses OR.",
  "Одна или более цифр (эквивалент [0-9]+)": "One or more digits (equivalent to [0-9]+)",
  "Она не перемещает локации и не изменяет их содержимое. При большом количестве SL операция может идти больше 5 секунд: дождитесь ответа. Не повторяйте отправку при таймауте — сначала проверьте текущие типы.": "This does not move locations or change their contents. Large batches may take more than 5 seconds. If a request times out, check current types before retrying.",
  "Открыть дерево локаций ↗": "Open location tree ↗",
  "Открыть локацию InvenTree": "Open location in InvenTree",
  "Отмена": "Cancel",
  "Ошибка запроса": "Request error",
  "ПОДТВЕРЖДЕНИЕ": "CONFIRMATION",
  "Памятка по поиску и Regex · примеры": "Search and Regex help · examples",
  "Первое назначение защищённого типа регулируется стандартными правами InvenTree.": "Assigning a protected type for the first time is governed by standard InvenTree permissions.",
  "По умолчанию поиск только по названию. Выбор отдельных строк сохраняется при фильтрации.": "By default, search includes names only. Manually checked rows remain selected across filters.",
  "Подтвердить назначение": "Confirm assignment",
  "Подтверждение массового назначения": "Confirm bulk assignment",
  "Поиск локаций": "Search locations",
  "Поиск по выбранным полям": "Search selected fields",
  "Полка, затем любое содержимое, затем «верх» или «низ»": "Shelf, followed by any text, then “top” or “bottom”",
  "Полка.*(верх|низ)": "Shelf.*(top|bottom)",
  "Полный путь": "Full path",
  "Пользователи выбранных групп могут изменять уже защищённые типы через API плагина. Стандартные права на StockLocation обязательны.": "Members of these groups can change already protected locations using standard InvenTree editing, subject to stock permissions and ownership restrictions.",
  "Поля поиска": "Search fields",
  "Превышено время ожидания ответа. Сервер мог завершить операцию! Не повторяйте назначение: обновите список и сначала проверьте фактические типы SL.": "Request timed out. The server might have completed the operation! Do not retry before refreshing the list and checking actual location types.",
  "Применяем…": "Applying…",
  "Проверка…": "Checking…",
  "Путь больше не доступен — обновите данные": "Path no longer available — refresh the data",
  "Редактирование защищённых типов требует специального права": "Changing protected types requires special permission",
  "С защищённым типом": "With protected type",
  "Сбросить весь выбор": "Clear entire selection",
  "Символы: ^ начало, $ конец, | ИЛИ, (...) группа, .* любой текст, [0-9] цифра, + один или более, ? необязательный. Слеши /.../ вводить не нужно.": "Symbols: ^ start, $ end, | OR, (...) group, .* any text, [0-9] digit, + one or more, ? optional. Do not include surrounding /.../ slashes.",
  "Снять отметки с найденных": "Uncheck matching",
  "Совпадений нет": "No matching locations",
  "Сохранить настройки": "Save settings",
  "Сохраняем…": "Saving…",
  "Статус": "Status",
  "Стеллаж|Полка": "Rack|Shelf",
  "Текущий тип": "Current type",
  "Тип создаётся стандартными средствами InvenTree. Сначала выберите SL, затем тип и подтвердите массовую операцию. ": "Create stock location types using InvenTree’s built-in tools. Select locations, choose a type and confirm the bulk operation. ",
  "Уже имеют этот тип": "Already have this type",
  "Управление типами мест хранения": "Stock Location Type Management",
  "Фильтр локаций": "Filter locations",
  "Готово за {seconds} с. Изменено: {changed}. Уже имели этот тип: {unchanged}.": "Completed in {seconds}s. Changed: {changed}. Already had the type: {unchanged}.",
  "Тип #{id}": "Type #{id}",
  "Найдено {found} из {total} · Отмечено {selected}": "Found {found} of {total} · Selected {selected}",
  "Ошибка регулярного выражения: {message}": "Regex error: {message}",
  "Внимание: {count} отмеченных SL не отображаются из-за текущего фильтра, но всё ещё входят в выбранные. ": "Warning: {count} selected locations are hidden by the current filter but remain selected. ",
  "Выбрать только найденные ({count})": "Select matching only ({count})",
  "Выбрать {path}, ID {id}": "Select {path}, ID {id}",
  "Применить к {count} SL": "Apply to {count} locations",
  "Тип «{type}» будет применён к выбранным местам хранения.": "Type “{type}” will be assigned to the selected stock locations.",
  "…и ещё {remaining} мест. Всего выбрано: {total}.": "…and {remaining} more. Total selected: {total}."
};
let activeLocale = 'en';
export function selectLocale(locale) {
  activeLocale = String(locale || 'en').toLowerCase().split(/[-_]/)[0] === 'ru' ? 'ru' : 'en';
  return activeLocale;
}
export function tr(message, parameters = {}) {
  const translated = activeLocale === 'ru' ? message : (EN[message] || message);
  return translated.replace(/\{([a-z_]+)\}/gi, (match, name) =>
    Object.prototype.hasOwnProperty.call(parameters, name) ? String(parameters[name]) : match);
}

/** Build a frontend URL using the active InvenTree UI mount path.
 * InvenTree 1.6.1 routes stock locations under stock/location/:id?/*,
 * with index at stock/location/index/ (NOT stock/locations/).
 */
export function frontendUrl(route, pathname = (typeof window !== 'undefined' ? window.location.pathname : '/web/')) {
  const path = String(pathname || '/web/');
  const pluginStart = path.indexOf('/plugin/');
  const fromPlugin = pluginStart >= 0 ? path.slice(0, pluginStart) : '';
  const fromCore = path.match(/^(.+?)\/(?:home|stock|part|settings|manufacturing|purchasing|sales|company|core|scan|notifications)(?:\/|$)/)?.[1] || '';
  const root = fromPlugin || fromCore || path.match(/^\/[^/]+/)?.[0] || '/web';
  return `${root.replace(/\/+$/, '')}/${String(route).replace(/^\/+/, '')}`;
}

const ENDPOINT = '/plugin/sl-guard/';
// InvenTree's shared Axios client may default to 5000ms. Keep the override
// local to bulk-type operations; never change the global API timeout.
export const BULK_TIMEOUT_MS = 120000;

/** Display the version reported by the installed server plugin, never a JS constant. */
export function panelVersionLabel(version) {
  return version ? `SL GUARD / ${version}` : 'SL GUARD';
}

const STYLE = `
.slg {--fg:var(--mantine-color-text,#263447);--muted:var(--mantine-color-dimmed,#738091);--paper:var(--mantine-color-body,#fff);--line:var(--mantine-color-default-border,#dce3e9);--soft:var(--mantine-color-default-hover,rgba(127,140,160,.075));--blue:var(--mantine-primary-color-filled,#2378bd);color:var(--fg);padding:16px 8px 40px;max-width:1250px;margin:0 auto;font:inherit}
.slg *{box-sizing:border-box}.slg-header{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap;margin:4px 0 20px}.slg-eyebrow{font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:var(--blue);font-weight:800}.slg h1{font-size:clamp(23px,3vw,31px);font-weight:750;line-height:1.25;margin:7px 0 8px}.slg p{margin:0;color:var(--muted);line-height:1.5}.slg .slg-card{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:20px;box-shadow:0 2px 12px rgba(20,36,54,.035)}.slg .slg-row{display:flex;align-items:center;flex-wrap:wrap;gap:12px}.slg .slg-grow{flex:1;min-width:190px}.slg .slg-stack{display:flex;flex-direction:column;gap:14px}.slg .slg-section{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.slg .slg-small{font-size:12px;color:var(--muted)}.slg .slg-subheading{font-weight:700;font-size:17px}.slg .slg-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:17px}.slg .slg-stat{border:1px solid var(--line);border-radius:12px;padding:14px 17px;background:var(--paper)}.slg .slg-stat b{display:block;font-variant-numeric:tabular-nums;font-size:25px}.slg .slg-stat span{color:var(--muted);font-size:12px}.slg input[type='text'],.slg select{height:39px;border:1px solid var(--line);background:var(--paper);color:var(--fg);border-radius:8px;padding:0 12px;font:inherit;min-width:0}.slg input[type='text']:focus,.slg select:focus{outline:2px solid var(--blue);outline-offset:1px}.slg select{min-width:190px}.slg label{cursor:pointer}.slg .slg-check{display:flex;align-items:center;gap:8px;font-size:13px}.slg input[type='checkbox']{accent-color:var(--blue);width:16px;height:16px}.slg button{border-radius:8px;border:1px solid var(--line);padding:9px 13px;background:var(--paper);color:var(--fg);cursor:pointer;font:inherit;font-size:13px;font-weight:600;transition:transform .08s,background .12s}.slg button:hover:not(:disabled){background:var(--soft)}.slg button:active:not(:disabled){transform:scale(.99)}.slg button:disabled{opacity:.45;cursor:not-allowed}.slg button.slg-primary{border-color:var(--blue);background:var(--blue);color:#fff}.slg button.slg-primary:hover:not(:disabled){filter:brightness(1.06);background:var(--blue)}.slg .slg-tabs{display:flex;gap:5px;border-bottom:1px solid var(--line);margin-bottom:16px}.slg .slg-tab{border:0;border-bottom:2px solid transparent;border-radius:0;background:none;padding:11px 15px;margin-bottom:-1px;font-weight:650;color:var(--muted)}.slg .slg-tab.slg-active{border-color:var(--blue);color:var(--blue)}.slg .slg-pill{display:inline-flex;align-items:center;border:1px solid var(--line);background:var(--soft);border-radius:999px;padding:3px 8px;font-size:11px;font-weight:650;white-space:nowrap}.slg .slg-pill.slg-protected{background:rgba(208,126,18,.1);border-color:rgba(208,126,18,.24);color:var(--fg)}.slg .slg-tablewrap{max-height:570px;overflow:auto;border:1px solid var(--line);border-radius:10px;margin-top:12px}.slg table{border-collapse:collapse;width:100%;min-width:950px;font-size:13px}.slg th{position:sticky;top:0;background:var(--paper);z-index:2;text-align:left;color:var(--muted);font-size:12px;font-weight:650;border-bottom:1px solid var(--line);padding:12px}.slg td{border-bottom:1px solid var(--line);padding:10px 12px;vertical-align:middle}.slg tr:last-child td{border-bottom:0}.slg tr:hover td{background:var(--soft)}.slg .slg-path{font-size:13px;font-weight:550;color:var(--fg);line-height:1.5;overflow-wrap:anywhere;white-space:normal;max-width:550px}.slg .slg-name{font-weight:700;white-space:nowrap}.slg .slg-preview-locations{max-height:200px;overflow:auto;margin:12px 0 0;padding:10px 12px;border:1px solid var(--line);border-radius:9px;background:var(--soft)}.slg .slg-preview-item{font-size:12px;line-height:1.45;overflow-wrap:anywhere;padding:4px 0}.slg .slg-preview-item+.slg .slg-preview-item{border-top:1px solid var(--line)}.slg .slg-foot{display:flex;gap:14px;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-top:16px}.slg .slg-callout{padding:13px 15px;border-radius:10px;border:1px solid var(--line);font-size:13px;line-height:1.6}.slg .slg-callout.slg-success{border-color:#2d9a6455;background:#2d9a6414}.slg .slg-callout.slg-error{border-color:#c3424255;background:#c3424214}.slg .slg-callout.slg-note{background:var(--soft)}.slg .slg-check-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px;padding:12px 0}.slg .slg-check-item{display:flex;align-items:center;gap:9px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;cursor:pointer}.slg .slg-check-item:hover{background:var(--soft)}.slg .slg-subcard{padding-top:16px;border-top:1px solid var(--line)}.slg .slg-backdrop{position:fixed;inset:0;z-index:1000;background:rgba(9,25,40,.55);display:flex;align-items:center;justify-content:center;padding:18px}.slg .slg-dialog{width:min(520px,100%);background:var(--paper);border:1px solid var(--line);border-radius:16px;padding:26px;box-shadow:0 25px 70px #0003}.slg .slg-dialog h2{margin:0 0 10px;font-size:21px}.slg .slg-dialog .slg-row{margin-top:23px;justify-content:flex-end}.slg .slg-toolbar{margin-top:16px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.slg .slg-right{margin-left:auto}.slg .slg-counter{font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}.slg .slg-link{color:var(--blue);text-decoration:none;font-size:13px}.slg .slg-link:hover{text-decoration:underline}.slg .slg-search-fields{display:flex;align-items:center;flex-wrap:wrap;gap:9px;padding:10px 13px;border:1px solid var(--line);background:var(--soft);border-radius:9px}.slg .slg-search-fields .slg-check{padding:4px 8px;border-radius:6px;background:var(--paper);border:1px solid var(--line)}.slg .slg-search-fields .slg-search-title{font-size:12px;font-weight:700;color:var(--muted);margin-right:4px}.slg .slg-regex-help{border:1px solid var(--line);border-radius:9px;padding:12px 14px;background:var(--soft);font-size:13px}.slg .slg-regex-help summary{font-weight:650;cursor:pointer;color:var(--fg)}.slg .slg-regex-help p{margin:10px 0}.slg .slg-regex-help code{font-family:ui-monospace,monospace;padding:2px 5px;border-radius:4px;background:var(--paper);overflow-wrap:anywhere}.slg .slg-regex-examples{display:grid;grid-template-columns:minmax(180px,250px) 1fr;gap:8px 16px;margin-top:10px;align-items:center}.slg .slg-regex-examples span{color:var(--muted)}@media(max-width:600px){.slg .slg-regex-examples{grid-template-columns:1fr;gap:4px}.slg .slg-regex-examples span{margin-bottom:7px}}.slg .slg-warning{color:var(--fg);border:1px solid rgba(208,126,18,.36);background:rgba(208,126,18,.09);padding:10px 13px;border-radius:9px;font-size:12px;line-height:1.5}@media(max-width:750px){.slg .slg-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.slg .slg-card{padding:14px}.slg .slg-right{margin-left:0}.slg .slg-stat b{font-size:21px}}
`;

function useStyles() {
  window.React.useEffect(() => {
    let style = document.getElementById('slg-style-0-2');
    if (!style) {
      style = document.createElement('style');
      style.id = 'slg-style-0-2';
      style.textContent = STYLE;
      document.head.appendChild(style);
    }
  }, []);
}

function apiError(err) {
  const data = err?.response?.data;
  const value = data?.detail || data?.location_ids || data?.location_type_id || data;
  if (Array.isArray(value)) return value.join(' · ');
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return err?.message || tr('Ошибка запроса');
}

/** Field-scoped matching: a parent path is NEVER searched unless path is selected. */
export function filterLocationRows(available, typeNames, options = {}) {
  const {search = '', regex = false, scope = 'all', fields = ['name']} = options;
  const term = search.trim();
  const activeFields = new Set(fields);
  let pattern = null;
  let regexError = '';
  if (term && regex) {
    try {
      if (term.length > 256) throw new Error(tr('Максимум 256 символов'));
      pattern = new RegExp(term, 'i');
    } catch (ex) { regexError = ex.message; }
  }
  const rows = regexError ? [] : available.filter(item => {
    if (scope === 'protected' && !item.protected) return false;
    if (scope === 'ordinary' && item.protected) return false;
    if (scope === 'none' && item.location_type_id !== null) return false;
    if (!term) return true;
    if (!activeFields.size) return false;
    const values = {
      name: item.name || '',
      path: item.path || '',
      type: item.location_type_id == null ? tr('Без типа') : (typeNames[item.location_type_id] || ''),
      id: `#${item.id}`,
    };
    return [...activeFields].some(field => {
      const value = String(values[field] ?? '');
      if (regex) return pattern.test(value);
      const needle = term.toLocaleLowerCase();
      return value.toLocaleLowerCase().includes(needle) ||
        (field === 'id' && String(item.id).includes(needle));
    });
  });
  return { rows, regexError };
}

function GuardApp({ context }) {
  const R = window.React;
  selectLocale(context?.locale || context?.context?.locale || (typeof document !== 'undefined' ? document.documentElement.lang : 'en'));
  useStyles();
  const api = context?.api || context?.context?.api;
  const [data, setData] = R.useState(null);
  const [config, setConfig] = R.useState(null);
  const [tab, setTab] = R.useState('bulk');
  const [search, setSearch] = R.useState('');
  const [searchFields, setSearchFields] = R.useState(['name']);
  const [regex, setRegex] = R.useState(false);
  const [scope, setScope] = R.useState('all');
  const [selection, setSelection] = R.useState([]);
  const [target, setTarget] = R.useState('');
  const [protectedIds, setProtectedIds] = R.useState([]);
  const [allowedGroups, setAllowedGroups] = R.useState([]);
  const [showNavigation, setShowNavigation] = R.useState(true);
  const [showDashboardWidget, setShowDashboardWidget] = R.useState(true);
  const [preview, setPreview] = R.useState(null);
  const [busy, setBusy] = R.useState(false);
  const [error, setError] = R.useState('');
  const [notice, setNotice] = R.useState('');

  async function load({ preserveTarget = true } = {}) {
    if (!api) { setError(tr('API-контекст InvenTree недоступен.')); return; }
    const response = await api.get(`${ENDPOINT}locations/`);
    const result = response.data;
    setData(result);
    if (!preserveTarget || !target || !result.types.some(t => String(t.id) === target)) {
      setTarget(result.types.length ? String(result.types[0].id) : '');
    }
    if (result.is_admin) {
      const response2 = await api.get(`${ENDPOINT}config/`);
      setConfig(response2.data);
      setProtectedIds(response2.data.protected_type_ids || []);
      setAllowedGroups(response2.data.allowed_group_ids || []);
      setShowNavigation(response2.data.show_navigation !== false);
      setShowDashboardWidget(response2.data.show_dashboard_widget !== false);
    }
  }
  R.useEffect(() => {
    let mounted = true;
    // Initial load uses a guard for unmount; subsequent loads are action-driven.
    if (api) {
      Promise.all([api.get(`${ENDPOINT}locations/`)]).then(async ([res]) => {
        if (!mounted) return;
        const initial = res.data;
        setData(initial);
        setTarget(initial.types.length ? String(initial.types[0].id) : '');
        if (initial.is_admin) {
          try {
            const cfg = (await api.get(`${ENDPOINT}config/`)).data;
            if (mounted) {
              setConfig(cfg);
              setProtectedIds(cfg.protected_type_ids || []);
              setAllowedGroups(cfg.allowed_group_ids || []);
              setShowNavigation(cfg.show_navigation !== false);
              setShowDashboardWidget(cfg.show_dashboard_widget !== false);
            }
          } catch (ex) { if (mounted) setError(apiError(ex)); }
        }
      }).catch(ex => { if (mounted) setError(apiError(ex)); });
    } else {
      setError(tr('API-контекст InvenTree недоступен.'));
    }
    return () => { mounted = false; };
  }, [api]);

  const types = data?.types || [];
  const typeNames = Object.fromEntries(types.map(t => [t.id, t.name]));
  const available = data?.locations || [];
  const {rows, regexError} = filterLocationRows(available, typeNames, {
    search, regex, scope, fields: searchFields,
  });
  const selected = new Set(selection);
  const editableVisible = rows.filter(row => row.editable).map(row => row.id);
  const visibleIds = new Set(rows.map(row => row.id));
  const hiddenSelected = selection.filter(id => !visibleIds.has(id)).length;
  const alreadyProtected = available.filter(row => row.protected).length;
  const withoutType = available.filter(row => row.location_type_id == null).length;
  function updateSelection(ids, checked) {
    const next = new Set(selection);
    ids.forEach(id => checked ? next.add(id) : next.delete(id));
    setSelection([...next]);
  }
  function toggleSearchField(field, checked) {
    setSearchFields(current => {
      if (checked) return current.includes(field) ? current : [...current, field];
      // At least one search field is always active.
      return current.length === 1 ? current : current.filter(value => value !== field);
    });
  }
  function selectOnlyVisible() {
    setSelection([...editableVisible]);
  }
  function toggleAdminValue(array, setter, id) {
    setter(array.includes(id) ? array.filter(value => value !== id) : [...array, id]);
  }
  async function previewBulk() {
    setError(''); setNotice('');
    if (!selection.length || !target) return;
    setBusy(true);
    try {
      const response = await api.post(`${ENDPOINT}bulk-type/`, {
        location_ids: selection, location_type_id: Number(target), dry_run: true,
      }, {timeout: BULK_TIMEOUT_MS});
      setPreview({...response.data, selected_ids: [...selection], selected_type_id: Number(target)});
    } catch (ex) { setError(apiError(ex)); }
    finally { setBusy(false); }
  }
  async function commitBulk() {
    if (!preview) return;
    setBusy(true); setError('');
    try {
      const startedAt = Date.now();
      const result = (await api.post(`${ENDPOINT}bulk-type/`, {
        location_ids: preview.selected_ids, location_type_id: preview.selected_type_id, dry_run: false,
      }, {timeout: BULK_TIMEOUT_MS})).data;
      const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
      setPreview(null);
      setSelection([]);
      setNotice(tr('Готово за {seconds} с. Изменено: {changed}. Уже имели этот тип: {unchanged}.', {seconds,changed:result.to_change,unchanged:result.unchanged}));
      await load();
    } catch (ex) {
      setPreview(null);
      const timedOut = ex?.code === 'ECONNABORTED' || /timeout|timed out/i.test(ex?.message || '');
      setError(timedOut
        ? tr('Превышено время ожидания ответа. Сервер мог завершить операцию! Не повторяйте назначение: обновите список и сначала проверьте фактические типы SL.')
        : apiError(ex));
    }
    finally { setBusy(false); }
  }
  async function saveConfig() {
    setError(''); setNotice(''); setBusy(true);
    try {
      await api.put(`${ENDPOINT}config/`, {
        protected_type_ids: protectedIds,
        allowed_group_ids: allowedGroups,
        show_navigation: showNavigation,
        show_dashboard_widget: showDashboardWidget,
      });
      setNotice(tr('Настройки защиты сохранены. Все SL выбранных типов защищены.'));
      setSelection([]);
      await load();
    } catch (ex) { setError(apiError(ex)); }
    finally { setBusy(false); }
  }

  const button = (label, handler, more = {}) => h('button', { type:'button', onClick:handler, ...more }, label);
  const stat = (value, label) => h('div', { className:'slg-stat' }, h('b', null, value), h('span', null, label));
  const pill = (text, protectedItem=false) => h('span', { className:`slg-pill ${protectedItem ? 'slg-protected':''}` }, text);
  const typeLabel = id => id == null ? tr('Без типа') : typeNames[id] || tr('Тип #{id}',{id});
  const pathsById = Object.fromEntries(available.map(row => [row.id, row.path]));
  const searchFieldLabels = [['name',tr('Название')],['path',tr('Полный путь')],['type',tr('Текущий тип')],['id','ID']];

  return h('main', { className:'slg' },
    h('div', { className:'slg-header' },
      h('div', null,
        h('div', { className:'slg-eyebrow' }, panelVersionLabel(data?.plugin_version)),
        h('h1', null, 'SL Guard'),
        h('p', null, tr('Массовое назначение типа существующим локациям. Защита применяется автоматически по типу.'))
      ),
      h('a', { className:'slg-link', href:frontendUrl('stock/location/index/') }, tr('Открыть дерево локаций ↗'))
    ),
    h('div', { className:'slg-grid' },
      stat(available.length, tr('Доступно локаций')),
      stat(alreadyProtected, tr('С защищённым типом')),
      stat(withoutType, tr('Без типа'))
    ),
    h('section', { className:'slg-card' },
      data?.is_admin ? h('div', { className:'slg-tabs' },
        button(tr('Массовое назначение'), () => {setTab('bulk'); setError('');}, {className:`slg-tab ${tab==='bulk'?'slg-active':''}`}),
        button(tr('Настройка защиты'), () => {setTab('settings'); setError('');}, {className:`slg-tab ${tab==='settings'?'slg-active':''}`})
      ) : null,
      error ? h('div', { className:'slg-callout slg-error', role:'alert', style:{marginBottom:14} }, error) : null,
      notice ? h('div', { className:'slg-callout slg-success', role:'status', style:{marginBottom:14} }, notice) : null,
      !data ? h('p', null, error ? tr('Не удалось загрузить данные.') : tr('Загружаем локации…')) :
      tab === 'bulk' ? h('div', { className:'slg-stack' },
        h('div', { className:'slg-section' },
          h('div', null, h('div',{className:'slg-subheading'}, tr('Выбрать локации')),
            h('div',{className:'slg-small'}, tr('По умолчанию поиск только по названию. Выбор отдельных строк сохраняется при фильтрации.'))),
          h('div',{className:'slg-counter'}, tr('Найдено {found} из {total} · Отмечено {selected}',{found:rows.length,total:available.length,selected:selection.length}))
        ),
        h('div', { className:'slg-row' },
          h('input', { type:'text', value:search, onChange:e=>setSearch(e.target.value),
            className:'slg-grow', placeholder:tr('Поиск по выбранным полям'), 'aria-label':tr('Поиск локаций') }),
          h('select', { value:scope, onChange:e=>setScope(e.target.value), 'aria-label':tr('Фильтр локаций') },
            ...[['all',tr('Все локации')],['none',tr('Без типа')],['ordinary',tr('Не защищены')],['protected',tr('Защищены')]].map(([value,name]) => h('option', {key:value,value}, name))
          ),
          h('label', { className:'slg-check' }, h('input', {type:'checkbox',checked:regex,onChange:e=>setRegex(e.target.checked)}), 'Regex /i')
        ),
        h('div',{className:'slg-search-fields',role:'group','aria-label':tr('Поля поиска')},
          h('span',{className:'slg-search-title'},tr('Искать в полях:')),
          ...searchFieldLabels.map(([field,label]) => h('label',{key:field,className:'slg-check'},
            h('input',{type:'checkbox',checked:searchFields.includes(field),
              disabled:searchFields.length===1 && searchFields.includes(field),
              onChange:e=>toggleSearchField(field,e.target.checked)}),label
          ))
        ),
        h('details',{className:'slg-regex-help'},
          h('summary',null,tr('Памятка по поиску и Regex · примеры')),
          h('p',null,tr('Обычный поиск ищет текст как написано. Включите «Regex /i» для регулярных выражений (регистр не учитывается). Поиск выполняется только по отмеченным полям; между выбранными полями действует ИЛИ.')),
          h('div',{className:'slg-regex-examples'},
            h('code',null,tr('Стеллаж|Полка')),h('span',null,tr('Или стеллаж, или полка — скобки необязательны')),
            h('code',null,tr('^(Стеллаж|Полка)')),h('span',null,tr('Название начинается с одного из двух слов; скобки объединяют варианты')),
            h('code',null,tr('^Стеллаж [0-9]+$')),h('span',null,tr('Всё название: «Стеллаж», пробел и одна или более цифр')),
            h('code',null,tr('Коробка (1|2|3)$')),h('span',null,tr('Коробка 1, 2 или 3 в конце названия')),
            h('code',null,tr('Полка.*(верх|низ)')),h('span',null,tr('Полка, затем любое содержимое, затем «верх» или «низ»')),
            h('code',null,String.raw`\d+`),h('span',null,tr('Одна или более цифр (эквивалент [0-9]+)'))
          ),
          h('p',null,tr('Символы: ^ начало, $ конец, | ИЛИ, (...) группа, .* любой текст, [0-9] цифра, + один или более, ? необязательный. Слеши /.../ вводить не нужно.')),
          h('p',null,tr('Важно: при поиске по «Полному пути» совпадение «Стеллаж» найдёт также вложенные в него коробки. Для выбора только стеллажей оставьте поле «Название».'))
        ),
        regexError ? h('div',{className:'slg-callout slg-error',role:'alert'}, tr('Ошибка регулярного выражения: {message}',{message:regexError})) : null,
        hiddenSelected ? h('div',{className:'slg-warning',role:'status'},
          tr('Внимание: {count} отмеченных SL не отображаются из-за текущего фильтра, но всё ещё входят в выбранные. ',{count:hiddenSelected}),
          tr('Кнопка «Выбрать только найденные» заменит весь выбор.')
        ) : null,
        h('div', { className:'slg-toolbar' },
          button(tr('Выбрать только найденные ({count})',{count:editableVisible.length}), selectOnlyVisible, {disabled:!!regexError}),
          button(tr('Добавить найденные'), () => updateSelection(editableVisible,true), {disabled:!editableVisible.length || !!regexError}),
          button(tr('Снять отметки с найденных'), () => updateSelection(editableVisible,false), {disabled:!editableVisible.length}),
          button(tr('Сбросить весь выбор'), () => setSelection([]), {disabled:!selection.length}),
          h('span', { className:'slg-counter slg-right' }, tr('Редактирование защищённых типов требует специального права'))
        ),
        h('div',{className:'slg-tablewrap'},
          h('table',null,
            h('thead',null,h('tr',null,
              h('th',{style:{width:45}},'✓'), h('th',{style:{width:64}},'ID'),
              h('th',{style:{minWidth:125}},tr('Название')), h('th',{style:{minWidth:340}},tr('Полный путь')),
              h('th',null,tr('Текущий тип')), h('th',{style:{width:105}},tr('Статус'))
            )),
            h('tbody',null,
              ...rows.map(row => h('tr',{key:row.id},
                h('td',null,h('input', {type:'checkbox',disabled:!row.editable,checked:selected.has(row.id),
                  onChange:e=>updateSelection([row.id],e.target.checked),'aria-label':tr('Выбрать {path}, ID {id}',{path:row.path,id:row.id})})),
                h('td',null,h('span',{className:'slg-small'},`#${row.id}`)),
                h('td',null,h('a',{className:'slg-link slg-name',href:frontendUrl(`stock/location/${row.id}/`),title:tr('Открыть локацию InvenTree')},row.name)),
                h('td',null,h('div',{className:'slg-path',title:row.path},row.path)),
                h('td',null,typeLabel(row.location_type_id)),
                h('td',null,row.protected ? pill(row.editable?tr('Защищена'):tr('Замок'),true) : pill(tr('Обычная')))
              )),
              rows.length===0 ? h('tr',null,h('td',{colSpan:6,style:{textAlign:'center',padding:34,color:'var(--muted)'}},
                regexError?tr('Исправьте регулярное выражение'):tr('Совпадений нет'))) : null
            )
          )
        ),
        h('div',{className:'slg-foot'},
          h('div',{className:'slg-row'},
            h('label',{style:{fontWeight:650}},tr('Назначить тип:')),
            h('select',{value:target,onChange:e=>setTarget(e.target.value),'aria-label':tr('Назначаемый тип')},
              ...types.map(type => h('option',{key:type.id,value:String(type.id)},type.name))
            )
          ),
          button(busy?tr('Проверка…'):tr('Применить к {count} SL',{count:selection.length}), previewBulk,
            {className:'slg-primary',disabled:busy || !!regexError || !selection.length || !target || selection.length>(data?.batch_limit||500)})
        ),
        h('div',{className:'slg-callout slg-note'},
          tr('Тип создаётся стандартными средствами InvenTree. Сначала выберите SL, затем тип и подтвердите массовую операцию. '),
          tr('Она не перемещает локации и не изменяет их содержимое. При большом количестве SL операция может идти больше 5 секунд: дождитесь ответа. Не повторяйте отправку при таймауте — сначала проверьте текущие типы.')
        )
      ) : h('div',{className:'slg-stack'},
        h('div',null,h('div',{className:'slg-subheading'},tr('Защищённые типы')),
          h('p',null,tr('Выберите типы, для которых запрещено штатное изменение родителя и последующая смена типа без специального права.'))),
        h('div',{className:'slg-check-grid'},
          ...types.map(t => h('label',{key:t.id,className:'slg-check-item'},
            h('input',{type:'checkbox',checked:protectedIds.includes(t.id),onChange:()=>toggleAdminValue(protectedIds,setProtectedIds,t.id)}),
            h('span',null,t.name,' ',h('small',{className:'slg-small'},`#${t.id}`))
          ))
        ),
        h('div',{className:'slg-subcard'},
          h('div',{className:'slg-subheading'},tr('Группы с правом управления')),
          h('p',null,tr('Пользователи выбранных групп могут изменять уже защищённые типы через API плагина. Стандартные права на StockLocation обязательны.'))
        ),
        h('div',{className:'slg-check-grid'},
          ...(config?.groups||[]).map(g => h('label',{key:g.id,className:'slg-check-item'},
            h('input',{type:'checkbox',checked:allowedGroups.includes(g.id),onChange:()=>toggleAdminValue(allowedGroups,setAllowedGroups,g.id)}),
            h('span',null,g.name,' ',h('small',{className:'slg-small'},`#${g.id}`))
          ))
        ),
        h('div',{className:'slg-subcard'},
          h('div',{className:'slg-subheading'},tr('Быстрый доступ')),
          h('div',{className:'slg-check-grid'},
            h('label',{className:'slg-check-item'},
              h('input',{type:'checkbox',checked:showNavigation,onChange:e=>setShowNavigation(e.target.checked)}),
              tr('Показывать SL Guard в меню навигации')),
            h('label',{className:'slg-check-item'},
              h('input',{type:'checkbox',checked:showDashboardWidget,onChange:e=>setShowDashboardWidget(e.target.checked)}),
              tr('Показывать виджет SL Guard на дашборде'))),
          h('p',null,tr('Скрытие ссылки или виджета не изменяет права и не отключает защиту. Панель остаётся доступной по прямой ссылке.'))
        ),
        h('div',{className:'slg-foot'},
          h('div',{className:'slg-small'},tr('Первое назначение защищённого типа регулируется стандартными правами InvenTree.')),
          button(busy?tr('Сохраняем…'):tr('Сохранить настройки'),saveConfig,{className:'slg-primary',disabled:busy})
        )
      )
    ),
    preview ? h('div',{className:'slg-backdrop',role:'presentation'},
      h('section',{className:'slg-dialog',role:'dialog','aria-modal':'true','aria-label':tr('Подтверждение массового назначения')},
        h('div',{className:'slg-eyebrow'},tr('ПОДТВЕРЖДЕНИЕ')),
        h('h2',null,tr('Массово назначить тип?')),
        h('p',null,tr('Тип «{type}» будет применён к выбранным местам хранения.',{type:typeLabel(preview.selected_type_id)})),
        h('div',{className:'slg-grid',style:{gridTemplateColumns:'repeat(2,minmax(0,1fr))',marginTop:17}},
          stat(preview.to_change,tr('Будут изменены')),stat(preview.unchanged,tr('Уже имеют этот тип'))
        ),
        h('div',{className:'slg-small',style:{marginTop:12}},tr('Выбранные места хранения (полный путь и ID):')),
        h('div',{className:'slg-preview-locations'},
          ...preview.selected_ids.slice(0,12).map(id => h('div',{key:id,className:'slg-preview-item'},
            `#${id} · ${pathsById[id] || tr('Путь больше не доступен — обновите данные')}`)),
          preview.selected_ids.length>12 ? h('div',{className:'slg-preview-item'},
            tr('…и ещё {remaining} мест. Всего выбрано: {total}.',{remaining:preview.selected_ids.length-12,total:preview.selected_ids.length})) : null
        ),
        h('div',{className:'slg-callout slg-note'},
          tr('Изменение применяется одной транзакцией. После назначения защищённого типа обычные пользователи не смогут снять его или переместить SL.')),
        h('div',{className:'slg-row'},
          button(tr('Отмена'),()=>setPreview(null),{disabled:busy}),
          button(busy?tr('Применяем…'):tr('Подтвердить назначение'),commitBulk,{className:'slg-primary',disabled:busy})
        )
      )
    ) : null
  );
}

/** Called by InvenTree UserInterfaceMixin's React route loader. */
export function renderGuardPage(context) {
  if (!window.React) return tr('React недоступен в InvenTree');
  return h(GuardApp, { context });
}
