/* SL Guard dashboard card. InvenTree 1.6.1 UserInterfaceMixin dashboard contract. */
import {selectLocale, tr} from './sl_guard_i18n.js';
import {createShieldSvg, installNavbarShield} from './sl_guard_icons.js';
function detectLocale(data) {
  const proposed = data?.context?.locale || data?.locale ||
    (typeof document !== 'undefined' ? document.documentElement?.lang : '') || 'en';
  return String(proposed).toLowerCase().split(/[-_]/)[0] === 'ru' ? 'ru' : 'en';
}

/** Resolve links relative to the active frontend mount point (normally /web). */
export function frontendUrl(route, pathname = (typeof window !== 'undefined' ? window.location.pathname : '/web/')) {
  const path = String(pathname || '/web/');
  const pluginStart = path.indexOf('/plugin/');
  const fromPlugin = pluginStart >= 0 ? path.slice(0, pluginStart) : '';
  const fromCore = path.match(/^(.+?)\/(?:home|stock|part|settings|manufacturing|purchasing|sales|company|core|scan|notifications)(?:\/|$)/)?.[1] || '';
  const root = fromPlugin || fromCore || path.match(/^\/[^/]+/)?.[0] || '/web';
  return `${root.replace(/\/+$/, '')}/${String(route).replace(/^\/+/, '')}`;
}

export function renderDashboardItem(target, data) {
  if (!target || typeof document === 'undefined') return;
  const context = data?.context || {};
  selectLocale(detectLocale(data));
  installNavbarShield();
  const protectedCount = Number(context.protected_count) || 0;
  const typeCount = Number(context.protected_type_count) || 0;
  const root = document.createElement('div');
  root.style.cssText = 'display:flex;flex-direction:column;justify-content:space-between;gap:8px;height:100%;box-sizing:border-box;padding:2px 0;color:var(--mantine-color-text,inherit)';
  const title = document.createElement('div');
  title.style.cssText = 'display:flex;align-items:center;gap:9px;font-size:17px;font-weight:700';
  // Same outline shield as the navigation and protected-location counter.
  const shield = createShieldSvg(document, 23);
  title.append(shield, document.createTextNode('SL Guard'));

  const stats = document.createElement('div');
  stats.style.cssText = 'display:flex;gap:18px;row-gap:6px;flex-wrap:wrap';
  for (const [value, label] of [
    [protectedCount, tr('dashboard_protected_locations')],
    [typeCount, tr('dashboard_protected_types')],
  ]) {
    const group = document.createElement('div');
    const count = document.createElement('strong');
    count.style.cssText = 'font-size:22px;font-variant-numeric:tabular-nums;display:block';
    count.textContent = String(value);
    const caption = document.createElement('div');
    caption.style.cssText = 'font-size:12px;color:var(--mantine-color-dimmed,#758091)';
    caption.textContent = label;
    group.append(count, caption);
    stats.appendChild(group);
  }
  const link = document.createElement('a');
  link.href = frontendUrl('plugin/sl-guard/manage');
  link.textContent = tr('dashboard_manage_locations');
  link.style.cssText = 'font-size:13px;font-weight:600;line-height:1.3;color:var(--mantine-primary-color-filled,#2378bd);align-self:flex-start;white-space:normal';
  root.append(title, stats, link);
  target.replaceChildren(root);
}
