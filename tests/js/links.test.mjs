import {test} from 'node:test';
import assert from 'node:assert/strict';
import {frontendUrl as panelUrl} from '../../sl_guard/static/sl_guard_panel.js';
import {frontendUrl as dashboardUrl} from '../../sl_guard/static/sl_guard_dashboard.js';

test('stock locations use real InvenTree 1.6.1 React route', () => {
  assert.equal(panelUrl('stock/location/index/', '/web/plugin/sl-guard/manage'), '/web/stock/location/index/');
  assert.equal(panelUrl('stock/location/5/', '/web/plugin/sl-guard/manage'), '/web/stock/location/5/');
  assert.notEqual(panelUrl('stock/location/index/', '/web/plugin/sl-guard/manage'), '/web/stock/locations/');
});

test('route links preserve a nondefault frontend base path', () => {
  assert.equal(panelUrl('stock/location/index/', '/custom/app/plugin/sl-guard/manage'), '/custom/app/stock/location/index/');
  assert.equal(dashboardUrl('plugin/sl-guard/manage', '/custom/app/home/'), '/custom/app/plugin/sl-guard/manage');
});

test('dashboard and panel paths agree for standard mount', () => {
  assert.equal(dashboardUrl('plugin/sl-guard/manage', '/web/home/'), '/web/plugin/sl-guard/manage');
  assert.equal(panelUrl('stock/location/index/', '/web/stock/location/5/'), '/web/stock/location/index/');
});
