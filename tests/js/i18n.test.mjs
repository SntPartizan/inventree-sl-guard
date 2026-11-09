import {test} from 'node:test';
import assert from 'node:assert/strict';
import {selectLocale, tr} from '../../sl_guard/static/sl_guard_i18n.js';

test('English is the fallback for unsupported locales', () => {
  selectLocale('en-US');
  assert.equal(tr('search_locations'), 'Search locations');
  assert.equal(tr('dashboard_protected_types'), 'Protected types');
  selectLocale('de-DE');
  assert.equal(tr('search_locations'), 'Search locations');
});

test('Russian UI follows InvenTree locale aliases', () => {
  selectLocale('ru_RU');
  assert.equal(tr('search_locations'), 'Поиск локаций');
  assert.equal(tr('dashboard_protected_types'), 'Защищённых типов');
  selectLocale('ru-RU');
  assert.equal(tr('bulk_assignment'), 'Массовое назначение');
  selectLocale('en');
});

test('named parameters work in both languages without changing location names', () => {
  for (const language of ['en', 'ru']) {
    selectLocale(language);
    const text = tr('select_path_id', {path:'Склад / Стеллаж №3', id:42});
    assert.match(text, /Склад \/ Стеллаж №3/);
    assert.match(text, /42/);
    assert.equal(tr('type_number', {id:21}).includes('21'), true);
  }
  selectLocale('en');
});

test('missing Russian translations fall back to English rather than raw source text', () => {
  selectLocale('de');
  assert.equal(tr('error_protected_relocation').startsWith('Relocation denied:'), true);
  selectLocale('en');
});
