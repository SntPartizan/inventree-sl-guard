/* SL Guard dashboard card. InvenTree 1.6.1 UserInterfaceMixin dashboard contract. */
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

const SHIELD_PATH = 'M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z';

export function renderDashboardItem(target, data) {
  if (!target || typeof document === 'undefined') return;
  const context = data?.context || {};
  const ru = detectLocale(data) === 'ru';
  const protectedCount = Number(context.protected_count) || 0;
  const typeCount = Number(context.protected_type_count) || 0;
  const root = document.createElement('div');
  root.style.cssText = 'display:flex;flex-direction:column;gap:12px;min-height:115px;padding:3px 0;color:var(--mantine-color-text,inherit)';
  const title = document.createElement('div');
  title.style.cssText = 'display:flex;align-items:center;gap:9px;font-size:17px;font-weight:700';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '25');
  svg.setAttribute('height', '25');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.8');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const outline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  outline.setAttribute('d', SHIELD_PATH);
  svg.appendChild(outline);
  const lock = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  lock.setAttribute('x', '9'); lock.setAttribute('y', '11');
  lock.setAttribute('width', '6'); lock.setAttribute('height', '5');
  lock.setAttribute('rx', '1');
  svg.appendChild(lock);
  const shackle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  shackle.setAttribute('d', 'M10 11V9a2 2 0 0 1 4 0v2');
  svg.appendChild(shackle);
  title.append(svg, document.createTextNode('SL Guard'));

  const stats = document.createElement('div');
  stats.style.cssText = 'display:flex;gap:18px;flex-wrap:wrap';
  for (const [value, label] of [
    [protectedCount, ru ? 'Защищённых локаций' : 'Protected locations'],
    [typeCount, ru ? 'Защищённых типов' : 'Protected types'],
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
  link.textContent = ru ? 'Управление локациями →' : 'Manage stock locations →';
  link.style.cssText = 'font-size:13px;font-weight:600;color:var(--mantine-primary-color-filled,#2378bd);align-self:flex-start';
  root.append(title, stats, link);
  target.replaceChildren(root);
}
