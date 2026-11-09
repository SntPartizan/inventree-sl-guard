from pathlib import Path
import importlib.util


def test_ui_patch_dry_run_and_apply(tmp_path):
    source = (Path(__file__).parents[1] / 'tools' / 'patch_scan_error_ui.py')
    spec = importlib.util.spec_from_file_location('ui_patch', source)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    target = tmp_path / 'LocationDetail.tsx'
    target.write_text(module.BLOCK)
    assert 'Compatible' in module.patch(target, False)
    assert 'Patched:' in module.patch(target, True)
    assert 'data?.parent' in target.read_text()
    assert module.patch(target, True) == 'Already patched'
    assert target.with_suffix('.tsx.slg-backup').exists()
