import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterLocationRows, panelVersionLabel} from '../../sl_guard/static/sl_guard_panel.js';

const items = [
  {id:1,name:'Склад',path:'Склад',location_type_id:1,protected:true,editable:true},
  {id:2,name:'Стеллаж 1',path:'Склад / Стеллаж 1',location_type_id:2,protected:true,editable:true},
  {id:3,name:'Коробка A',path:'Склад / Стеллаж 1 / Коробка A',location_type_id:3,protected:false,editable:true},
  {id:4,name:'Коробка B',path:'Склад / Стеллаж 1 / Коробка B',location_type_id:3,protected:false,editable:true},
  {id:5,name:'Стеллаж 2',path:'Склад / Стеллаж 2',location_type_id:2,protected:true,editable:true},
];
const typeNames = {1:'Помещение',2:'Стационарный',3:'Контейнер'};
const ids = opts => filterLocationRows(items,typeNames,{search:'Стеллаж',...opts}).rows.map(item=>item.id);

test('default name-only search does not select boxes under racks', () => {
  assert.deepEqual(ids({}),[2,5]);
});
test('explicit full-path mode includes child boxes', () => {
  assert.deepEqual(ids({fields:['path']}),[2,3,4,5]);
});
test('combined name and path mode is OR across selected fields', () => {
  assert.deepEqual(ids({fields:['name','path']}),[2,3,4,5]);
});
test('search current type independently', () => {
  assert.deepEqual(filterLocationRows(items,typeNames,{search:'Контейнер',fields:['type']}).rows.map(r=>r.id),[3,4]);
});
test('search numeric ID independently', () => {
  assert.deepEqual(filterLocationRows(items,typeNames,{search:'#4',fields:['id']}).rows.map(r=>r.id),[4]);
  assert.deepEqual(filterLocationRows(items,typeNames,{search:'4',fields:['id']}).rows.map(r=>r.id),[4]);
});
test('regex searches only explicit fields', () => {
  assert.deepEqual(ids({regex:true,fields:['name']}),[2,5]);
  assert.deepEqual(filterLocationRows(items,typeNames,{search:'^Стеллаж [12]$',regex:true,fields:['name']}).rows.map(r=>r.id),[2,5]);
  assert.deepEqual(filterLocationRows(items,typeNames,{search:'^Стеллаж',regex:true,fields:['path']}).rows.map(r=>r.id),[]);
});
test('invalid regex yields zero rows and explicit error', () => {
  const result=filterLocationRows(items,typeNames,{search:'[',regex:true});
  assert.deepEqual(result.rows,[]);
  assert.ok(result.regexError);
});
test('scope filters applied before field search', () => {
  assert.deepEqual(ids({scope:'ordinary',fields:['name']}),[]);
  assert.deepEqual(ids({scope:'ordinary',fields:['path']}),[3,4]);
});
test('empty query returns all in selected scope, not only search-field values', () => {
  assert.equal(filterLocationRows(items,typeNames,{search:'',scope:'all',fields:['name']}).rows.length,5);
});


test('regex alternation works without grouping', () => {
  const found = filterLocationRows(items,typeNames,{search:'Стеллаж|Коробка A',regex:true,fields:['name']});
  assert.deepEqual(found.rows.map(r=>r.id),[2,3,5]);
});

test('regex grouping and anchors restrict matches to whole name', () => {
  const found = filterLocationRows(items,typeNames,{search:'^(Стеллаж [12]|Коробка A)$',regex:true,fields:['name']});
  assert.deepEqual(found.rows.map(r=>r.id),[2,3,5]);
});

test('panel version comes from server data rather than a stale JS release number', () => {
  assert.equal(panelVersionLabel('0.3.1'), 'SL GUARD / 0.3.1');
  assert.equal(panelVersionLabel('0.4.2'), 'SL GUARD / 0.4.2');
  assert.equal(panelVersionLabel(undefined), 'SL GUARD');
});

test('bulk request timeout is overridden without modifying global API configuration', async () => {
  const { BULK_TIMEOUT_MS } = await import('../../sl_guard/static/sl_guard_panel.js');
  assert.equal(BULK_TIMEOUT_MS,120000);
});

test('English interface is the default and Russian follows InvenTree locale', async () => {
  const { selectLocale, tr } = await import('../../sl_guard/static/sl_guard_panel.js');
  selectLocale('en-US');
  assert.equal(tr('Управление типами мест хранения'), 'Stock Location Type Management');
  assert.equal(tr('Найдено {found} из {total} · Отмечено {selected}', {found:2,total:4,selected:1}), 'Found 2 of 4 · Selected 1');
  selectLocale('ru_RU');
  assert.equal(tr('Управление типами мест хранения'), 'Управление типами мест хранения');
  assert.equal(tr('Найдено {found} из {total} · Отмечено {selected}', {found:2,total:4,selected:1}), 'Найдено 2 из 4 · Отмечено 1');
  selectLocale('en');
});

test('English locale does not alter names or the full paths supplied by InvenTree', async () => {
  const { selectLocale } = await import('../../sl_guard/static/sl_guard_panel.js');
  selectLocale('en');
  assert.deepEqual(ids({fields:['name']}), [2,5]);
  assert.deepEqual(ids({fields:['path']}), [2,3,4,5]);
});
