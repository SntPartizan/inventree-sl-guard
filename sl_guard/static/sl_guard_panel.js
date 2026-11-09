/* SL Guard — native InvenTree React route.
 * Uses shared window.React supplied by InvenTree (no second React instance).
 * All mutations are authorized again on the server; client flags are cosmetic.
 */
const h = (...args) => window.React.createElement(...args);
// English is the default; Russian is selected from InvenTree's UI locale.
export {selectLocale, tr} from './sl_guard_i18n.js';
import {selectLocale, tr} from './sl_guard_i18n.js';
import {SHIELD_LOCK_PATHS, installNavbarShield} from './sl_guard_icons.js';

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
.slg .slg-headline{display:flex;align-items:center;gap:10px}.slg .slg-headline h1{margin:7px 0 8px}.slg .slg-stat b.slg-stat-value{display:flex;align-items:center;gap:9px}
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
    installNavbarShield();
  }, []);
}

function apiError(err) {
  const data = err?.response?.data;
  const value = data?.detail || data?.location_ids || data?.location_type_id || data;
  if (Array.isArray(value)) return value.join(' · ');
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object') return JSON.stringify(value);
  return err?.message || tr('request_error');
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
      if (term.length > 256) throw new Error(tr('max_256_characters'));
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
      type: item.location_type_id == null ? tr('no_type') : (typeNames[item.location_type_id] || ''),
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
    if (!api) { setError(tr('api_context_unavailable')); return; }
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
      setError(tr('api_context_unavailable'));
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
      setNotice(tr('bulk_complete_summary', {seconds,changed:result.to_change,unchanged:result.unchanged}));
      await load();
    } catch (ex) {
      setPreview(null);
      const timedOut = ex?.code === 'ECONNABORTED' || /timeout|timed out/i.test(ex?.message || '');
      setError(timedOut
        ? tr('bulk_timeout_warning')
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
      setNotice(tr('settings_saved'));
      setSelection([]);
      await load();
    } catch (ex) { setError(apiError(ex)); }
    finally { setBusy(false); }
  }

  const button = (label, handler, more = {}) => h('button', { type:'button', onClick:handler, ...more }, label);
  const shield = (size=24) => h('svg', {
    width:size, height:size, viewBox:'0 0 24 24', fill:'none', stroke:'currentColor',
    strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round', 'aria-hidden':true,
    className:'tabler-icon tabler-icon-shield-lock',
    style:{color:'var(--mantine-primary-color-light-color)',flexShrink:0}
  }, ...SHIELD_LOCK_PATHS.map((d,i) => h('path',{key:i,d})));
  const stat = (value, label, protectedStat=false) => h('div', { className:'slg-stat' },
    h('b', {className:protectedStat?'slg-stat-value':undefined},
      ...(protectedStat?[shield(23),value]:[value])),
    h('span', null, label));
  const pill = (text, protectedItem=false) => h('span', { className:`slg-pill ${protectedItem ? 'slg-protected':''}` }, text);
  const typeLabel = id => id == null ? tr('no_type') : typeNames[id] || tr('type_number',{id});
  const pathsById = Object.fromEntries(available.map(row => [row.id, row.path]));
  const searchFieldLabels = [['name',tr('name')],['path',tr('full_path')],['type',tr('current_type')],['id','ID']];

  return h('main', { className:'slg' },
    h('div', { className:'slg-header' },
      h('div', null,
        h('div', { className:'slg-eyebrow' }, panelVersionLabel(data?.plugin_version)),
        h('div', {className:'slg-headline'}, shield(29), h('h1', null, 'SL Guard')),
        h('p', null, tr('bulk_assignment_description'))
      ),
      h('a', { className:'slg-link', href:frontendUrl('stock/location/index/') }, tr('open_location_tree'))
    ),
    h('div', { className:'slg-grid' },
      stat(available.length, tr('available_locations')),
      stat(alreadyProtected, tr('with_protected_type'), true),
      stat(withoutType, tr('no_type'))
    ),
    h('section', { className:'slg-card' },
      data?.is_admin ? h('div', { className:'slg-tabs' },
        button(tr('bulk_assignment'), () => {setTab('bulk'); setError('');}, {className:`slg-tab ${tab==='bulk'?'slg-active':''}`}),
        button(tr('protection_settings'), () => {setTab('settings'); setError('');}, {className:`slg-tab ${tab==='settings'?'slg-active':''}`})
      ) : null,
      error ? h('div', { className:'slg-callout slg-error', role:'alert', style:{marginBottom:14} }, error) : null,
      notice ? h('div', { className:'slg-callout slg-success', role:'status', style:{marginBottom:14} }, notice) : null,
      !data ? h('p', null, error ? tr('data_load_failed') : tr('loading_locations')) :
      tab === 'bulk' ? h('div', { className:'slg-stack' },
        h('div', { className:'slg-section' },
          h('div', null, h('div',{className:'slg-subheading'}, tr('select_locations')),
            h('div',{className:'slg-small'}, tr('name_search_selection_note'))),
          h('div',{className:'slg-counter'}, tr('search_results_summary',{found:rows.length,total:available.length,selected:selection.length}))
        ),
        h('div', { className:'slg-row' },
          h('input', { type:'text', value:search, onChange:e=>setSearch(e.target.value),
            className:'slg-grow', placeholder:tr('search_selected_fields'), 'aria-label':tr('search_locations') }),
          h('select', { value:scope, onChange:e=>setScope(e.target.value), 'aria-label':tr('location_filter') },
            ...[['all',tr('all_locations')],['none',tr('no_type')],['ordinary',tr('unprotected')],['protected',tr('protected_plural')]].map(([value,name]) => h('option', {key:value,value}, name))
          ),
          h('label', { className:'slg-check' }, h('input', {type:'checkbox',checked:regex,onChange:e=>setRegex(e.target.checked)}), 'Regex /i')
        ),
        h('div',{className:'slg-search-fields',role:'group','aria-label':tr('search_fields')},
          h('span',{className:'slg-search-title'},tr('search_in_fields')),
          ...searchFieldLabels.map(([field,label]) => h('label',{key:field,className:'slg-check'},
            h('input',{type:'checkbox',checked:searchFields.includes(field),
              disabled:searchFields.length===1 && searchFields.includes(field),
              onChange:e=>toggleSearchField(field,e.target.checked)}),label
          ))
        ),
        h('details',{className:'slg-regex-help'},
          h('summary',null,tr('regex_help_heading')),
          h('p',null,tr('regex_search_help')),
          h('div',{className:'slg-regex-examples'},
            h('code',null,tr('regex_example_racks_alternation')),h('span',null,tr('regex_alternation_description')),
            h('code',null,tr('regex_example_racks_group')),h('span',null,tr('regex_grouped_alternatives_description')),
            h('code',null,tr('regex_example_numbered_rack')),h('span',null,tr('regex_numbered_rack_description')),
            h('code',null,tr('regex_example_box_numbers')),h('span',null,tr('regex_box_numbers_description')),
            h('code',null,tr('regex_example_shelf_position')),h('span',null,tr('regex_shelf_position_description')),
            h('code',null,String.raw`\d+`),h('span',null,tr('regex_digits_description'))
          ),
          h('p',null,tr('regex_symbols_help')),
          h('p',null,tr('full_path_search_warning'))
        ),
        regexError ? h('div',{className:'slg-callout slg-error',role:'alert'}, tr('regex_error',{message:regexError})) : null,
        hiddenSelected ? h('div',{className:'slg-warning',role:'status'},
          tr('hidden_selection_warning',{count:hiddenSelected}),
          tr('selection_replacement_warning')
        ) : null,
        h('div', { className:'slg-toolbar' },
          button(tr('select_matching_count',{count:editableVisible.length}), selectOnlyVisible, {disabled:!!regexError}),
          button(tr('add_matching'), () => updateSelection(editableVisible,true), {disabled:!editableVisible.length || !!regexError}),
          button(tr('uncheck_matching'), () => updateSelection(editableVisible,false), {disabled:!editableVisible.length}),
          button(tr('clear_selection'), () => setSelection([]), {disabled:!selection.length}),
          h('span', { className:'slg-counter slg-right' }, tr('protected_type_permission_note'))
        ),
        h('div',{className:'slg-tablewrap'},
          h('table',null,
            h('thead',null,h('tr',null,
              h('th',{style:{width:45}},'✓'), h('th',{style:{width:64}},'ID'),
              h('th',{style:{minWidth:125}},tr('name')), h('th',{style:{minWidth:340}},tr('full_path')),
              h('th',null,tr('current_type')), h('th',{style:{width:105}},tr('status'))
            )),
            h('tbody',null,
              ...rows.map(row => h('tr',{key:row.id},
                h('td',null,h('input', {type:'checkbox',disabled:!row.editable,checked:selected.has(row.id),
                  onChange:e=>updateSelection([row.id],e.target.checked),'aria-label':tr('select_path_id',{path:row.path,id:row.id})})),
                h('td',null,h('span',{className:'slg-small'},`#${row.id}`)),
                h('td',null,h('a',{className:'slg-link slg-name',href:frontendUrl(`stock/location/${row.id}/`),title:tr('open_location_inventree')},row.name)),
                h('td',null,h('div',{className:'slg-path',title:row.path},row.path)),
                h('td',null,typeLabel(row.location_type_id)),
                h('td',null,row.protected ? pill(row.editable?tr('protected_status'):tr('locked'),true) : pill(tr('ordinary')))
              )),
              rows.length===0 ? h('tr',null,h('td',{colSpan:6,style:{textAlign:'center',padding:34,color:'var(--muted)'}},
                regexError?tr('fix_regex'):tr('no_matches'))) : null
            )
          )
        ),
        h('div',{className:'slg-foot'},
          h('div',{className:'slg-row'},
            h('label',{style:{fontWeight:650}},tr('assign_type_label')),
            h('select',{value:target,onChange:e=>setTarget(e.target.value),'aria-label':tr('type_to_assign')},
              ...types.map(type => h('option',{key:type.id,value:String(type.id)},type.name))
            )
          ),
          button(busy?tr('checking'):tr('apply_to_count',{count:selection.length}), previewBulk,
            {className:'slg-primary',disabled:busy || !!regexError || !selection.length || !target || selection.length>(data?.batch_limit||500)})
        ),
        h('div',{className:'slg-callout slg-note'},
          tr('create_types_bulk_instructions'),
          tr('bulk_operation_timeout_help')
        )
      ) : h('div',{className:'slg-stack'},
        h('div',null,h('div',{className:'slg-subheading'},tr('protected_types')),
          h('p',null,tr('protected_types_help'))),
        h('div',{className:'slg-check-grid'},
          ...types.map(t => h('label',{key:t.id,className:'slg-check-item'},
            h('input',{type:'checkbox',checked:protectedIds.includes(t.id),onChange:()=>toggleAdminValue(protectedIds,setProtectedIds,t.id)}),
            h('span',null,t.name,' ',h('small',{className:'slg-small'},`#${t.id}`))
          ))
        ),
        h('div',{className:'slg-subcard'},
          h('div',{className:'slg-subheading'},tr('authorized_groups')),
          h('p',null,tr('authorized_groups_help'))
        ),
        h('div',{className:'slg-check-grid'},
          ...(config?.groups||[]).map(g => h('label',{key:g.id,className:'slg-check-item'},
            h('input',{type:'checkbox',checked:allowedGroups.includes(g.id),onChange:()=>toggleAdminValue(allowedGroups,setAllowedGroups,g.id)}),
            h('span',null,g.name,' ',h('small',{className:'slg-small'},`#${g.id}`))
          ))
        ),
        h('div',{className:'slg-subcard'},
          h('div',{className:'slg-subheading'},tr('quick_access')),
          h('div',{className:'slg-check-grid'},
            h('label',{className:'slg-check-item'},
              h('input',{type:'checkbox',checked:showNavigation,onChange:e=>setShowNavigation(e.target.checked)}),
              tr('show_navigation')),
            h('label',{className:'slg-check-item'},
              h('input',{type:'checkbox',checked:showDashboardWidget,onChange:e=>setShowDashboardWidget(e.target.checked)}),
              tr('show_dashboard_widget'))),
          h('p',null,tr('shortcut_visibility_note'))
        ),
        h('div',{className:'slg-foot'},
          h('div',{className:'slg-small'},tr('first_assignment_permissions')),
          button(busy?tr('saving'):tr('save_settings'),saveConfig,{className:'slg-primary',disabled:busy})
        )
      )
    ),
    preview ? h('div',{className:'slg-backdrop',role:'presentation'},
      h('section',{className:'slg-dialog',role:'dialog','aria-modal':'true','aria-label':tr('bulk_assignment_confirmation')},
        h('div',{className:'slg-eyebrow'},tr('confirmation')),
        h('h2',null,tr('bulk_assign_question')),
        h('p',null,tr('assignment_preview_description',{type:typeLabel(preview.selected_type_id)})),
        h('div',{className:'slg-grid',style:{gridTemplateColumns:'repeat(2,minmax(0,1fr))',marginTop:17}},
          stat(preview.to_change,tr('to_be_changed')),stat(preview.unchanged,tr('already_has_type'))
        ),
        h('div',{className:'slg-small',style:{marginTop:12}},tr('selected_locations_details')),
        h('div',{className:'slg-preview-locations'},
          ...preview.selected_ids.slice(0,12).map(id => h('div',{key:id,className:'slg-preview-item'},
            `#${id} · ${pathsById[id] || tr('path_unavailable')}`)),
          preview.selected_ids.length>12 ? h('div',{className:'slg-preview-item'},
            tr('additional_selected_count',{remaining:preview.selected_ids.length-12,total:preview.selected_ids.length})) : null
        ),
        h('div',{className:'slg-callout slg-note'},
          tr('bulk_protection_note')),
        h('div',{className:'slg-row'},
          button(tr('cancel'),()=>setPreview(null),{disabled:busy}),
          button(busy?tr('applying'):tr('confirm_assignment'),commitBulk,{className:'slg-primary',disabled:busy})
        )
      )
    ) : null
  );
}

/** Called by InvenTree UserInterfaceMixin's React route loader. */
export function renderGuardPage(context) {
  selectLocale(context?.locale || context?.context?.locale || (typeof document !== 'undefined' ? document.documentElement.lang : 'en'));
  if (!window.React) return tr('react_unavailable');
  return h(GuardApp, { context });
}
