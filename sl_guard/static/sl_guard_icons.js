/* Shared Tabler-style outline shield for SL Guard page and dashboard. */
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

