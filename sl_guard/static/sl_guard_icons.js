/* SL Guard outline shield icon and optional navigation enhancement.
 * InvenTree 1.6.1 exposes a navigation icon hint but does not render it.
 * This cosmetic enhancement runs only after the plugin's panel or dashboard JS loads.
 */
const SVG_NS = 'http://www.w3.org/2000/svg';
export const SHIELD_LOCK_PATHS = Object.freeze([
  'M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3',
  'M11 11a1 1 0 1 0 2 0a1 1 0 0 0 -2 0',
  'M12 12l0 2.5',
]);

export function createShieldSvg(doc, size = 24) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  for (const [name, value] of Object.entries({
    xmlns: SVG_NS, viewBox: '0 0 24 24', width: size, height: size,
    fill: 'none', stroke: 'currentColor', 'stroke-width': 2,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'aria-hidden': 'true',
  })) svg.setAttribute(name, String(value));
  svg.classList.add('tabler-icon', 'tabler-icon-shield-lock');
  svg.style.color = 'var(--mantine-primary-color-light-color)';
  svg.style.flexShrink = '0';
  for (const d of SHIELD_LOCK_PATHS) {
    const path = doc.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', d);
    svg.appendChild(path);
  }
  return svg;
}

export function ensureNavbarShield(doc) {
  if (!doc?.querySelectorAll) return false;
  const tab = [...doc.querySelectorAll('[role="tab"]')]
    .find(el => (el.textContent || '').trim() === 'SL Guard');
  if (!tab) return false;
  if (tab.querySelector('.slg-nav-shield')) return true;

  const icon = createShieldSvg(doc);
  icon.classList.add('slg-nav-shield');
  icon.style.marginRight = '7px';
  icon.style.display = 'block';
  tab.style.display = 'inline-flex';
  tab.style.alignItems = 'center';
  tab.insertBefore(icon, tab.firstChild);
  return true;
}

let navbarObserver = null;
export function installNavbarShield(doc = typeof document !== 'undefined' ? document : null) {
  if (!doc?.querySelectorAll) return false;
  ensureNavbarShield(doc);
  if (navbarObserver || typeof MutationObserver === 'undefined') return true;
  const navbar = doc.getElementById?.('tip-ftu-nav3');
  if (!navbar) return true;
  navbarObserver = new MutationObserver(() => ensureNavbarShield(doc));
  navbarObserver.observe(navbar, {childList: true, subtree: true, characterData: true});
  return true;
}
