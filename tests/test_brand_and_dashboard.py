"""Lightweight packaging and integration contract checks (no Django runtime)."""
import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_sl_guard_internal_identity_and_public_title():
    tree = ast.parse((ROOT / 'sl_guard/plugin.py').read_text())
    plugin = next(node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == 'SLGuard')
    attrs = {}
    for stmt in plugin.body:
        if isinstance(stmt, ast.Assign) and len(stmt.targets) == 1 and isinstance(stmt.targets[0], ast.Name):
            try:
                attrs[stmt.targets[0].id] = ast.literal_eval(stmt.value)
            except (ValueError, TypeError):
                pass
    assert attrs['NAME'] == 'SL Guard'  # display name; the slug stays stable
    assert attrs['SLUG'] == 'sl-guard'
    assert attrs['TITLE'] == 'SL Guard'
    assert attrs['VERSION'] == '0.3.1'
    assert attrs['AUTHOR'] == 'SntPartizan'
    source = (ROOT / 'sl_guard/plugin.py').read_text()
    assert '"SHOW_NAVIGATION"' in source and '"SHOW_DASHBOARD_WIDGET"' in source
    assert source.count('"default": True') >= 2


def test_dashboard_has_official_hook_and_hidden_navigation_preserves_route():
    code = (ROOT / 'sl_guard/plugin.py').read_text()
    assert 'def get_ui_dashboard_items(self, request, context' in code
    assert "self.plugin_static_file('sl_guard_dashboard.js:renderDashboardItem')" in code
    assert "'icon': 'ti:shield-lock'" in code
    assert "'title': '🛡️ SL Guard'" in code
    assert "'options': {'width': 3, 'height': 3}" in code
    assert 'if not self._can_use_management_ui(request):' in code
    assert "if not self.get_setting('SHOW_NAVIGATION', cache=False)" in code
    assert "if not self.get_setting('SHOW_DASHBOARD_WIDGET', cache=False)" in code
    assert "'options': {'path': 'manage'}" in code


def test_panel_version_is_provided_by_installed_plugin():
    backend = (ROOT / 'sl_guard/views.py').read_text()
    frontend = (ROOT / 'sl_guard/static/sl_guard_panel.js').read_text()
    assert "'plugin_version': self.plugin.VERSION" in backend
    assert 'panelVersionLabel(data?.plugin_version)' in frontend
    assert 'SL GUARD / 0.3.0' not in frontend


def test_optional_config_flags_and_backward_compatibility():
    code = (ROOT / 'sl_guard/views.py').read_text()
    assert 'show_navigation = serializers.BooleanField(required=False)' in code
    assert 'show_dashboard_widget = serializers.BooleanField(required=False)' in code
    assert "if 'show_navigation' in data:" in code
    assert "if 'show_dashboard_widget' in data:" in code
