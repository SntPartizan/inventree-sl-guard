import {test} from 'node:test';
import assert from 'node:assert/strict';
import {renderDashboardItem} from '../../sl_guard/static/sl_guard_dashboard.js';

class FakeElement {
  constructor(tag) {this.tag=tag;this.style={};this.attrs={};this.children=[];this.textContent='';this.href='';}
  setAttribute(key,value){this.attrs[key]=value;}
  append(...nodes){this.children.push(...nodes);}
  appendChild(node){this.children.push(node);}
  replaceChildren(...nodes){this.children=[...nodes];}
}
function getText(node){return typeof node==='string'?node:(node.textContent || '')+' '+(node.children||[]).map(getText).join(' ');}
const priorDocument=globalThis.document;
globalThis.document={
  documentElement:{lang:'en'},
  createElement:tag=>new FakeElement(tag),
  createElementNS:(ns,tag)=>new FakeElement(tag),
  createTextNode:val=>String(val),
};

test('SL Guard dashboard card links to existing route and displays protected counts',()=>{
  const target=new FakeElement('target');
  renderDashboardItem(target,{context:{protected_count:74,protected_type_count:2,locale:'en'}});
  assert.match(getText(target),/SL Guard/);
  const shield=target.children[0].children[0].children[0];
  assert.equal(shield.tag,'svg');
  assert.equal(shield.attrs.viewBox,'0 0 24 24');
  assert.equal(shield.children.length,3);
  assert.equal(shield.attrs.width,'32');
  assert.match(target.children[0].children[0].style.cssText,/font-size:25px/);
  assert.match(target.children[0].style.cssText,/height:100%/);
  assert.match(getText(target),/Protected locations/);
  assert.match(getText(target),/74/);
  const link=target.children[0].children.at(-1);
  assert.equal(link.href,'/web/plugin/sl-guard/manage');
});

test('SL Guard brand remains English even when UI is Russian',()=>{
  const target=new FakeElement('target');
  renderDashboardItem(target,{context:{protected_count:3,protected_type_count:1,locale:'ru'}});
  assert.match(getText(target),/SL Guard/);
  assert.match(getText(target),/Защищённых локаций/);
  assert.match(getText(target),/Управление локациями/);
});

test('missing target fails closed and does not throw',()=>{
  assert.doesNotThrow(()=>renderDashboardItem(null,{}));
});
