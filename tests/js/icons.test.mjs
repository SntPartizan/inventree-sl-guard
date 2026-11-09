import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createShieldSvg, ensureNavbarShield, SHIELD_LOCK_PATHS} from '../../sl_guard/static/sl_guard_icons.js';

class Element {
  constructor(tag) { this.tag=tag; this.style={}; this.attrs={}; this.children=[]; this.textContent=''; this.classNames=new Set(); this.classList={add:(...names)=>names.forEach(name=>this.classNames.add(name))}; }
  setAttribute(k,v) { this.attrs[k]=v; }
  appendChild(x) { this.children.push(x); }
  insertBefore(x,anchor) { this.children.unshift(x); }
  get firstChild() { return this.children[0] || null; }
  querySelector(q) { if(q==='.slg-nav-shield')return this.children.find(c=>c.classNames?.has('slg-nav-shield'))||null; return null; }
}

test('outline shield has the exact Tabler SVG paths and dynamic Mantine theme color',()=>{
  const doc={createElementNS:(_,tag)=>new Element(tag)};
  const svg=createShieldSvg(doc,24);
  assert.equal(svg.tag,'svg');
  assert.equal(svg.attrs.fill,'none');
  assert.equal(svg.attrs['stroke-width'],'2');
  assert.equal(svg.style.color,'var(--mantine-primary-color-light-color)');
  assert.deepEqual(svg.children.map(el=>el.attrs.d),[...SHIELD_LOCK_PATHS]);
});

test('navigation shield is inserted only once and only for SL Guard',()=>{
  const tab=new Element('button'); tab.textContent='SL Guard';
  const doc={querySelectorAll:()=>[tab],createElementNS:(_,tag)=>new Element(tag)};
  assert.equal(ensureNavbarShield(doc),true);
  assert.equal(ensureNavbarShield(doc),true);
  assert.equal(tab.children.length,1);
  assert.equal(tab.children[0].tag,'svg');
  assert.equal(tab.style.alignItems,'center');
  tab.textContent='Other';
  assert.equal(ensureNavbarShield(doc),false);
});
