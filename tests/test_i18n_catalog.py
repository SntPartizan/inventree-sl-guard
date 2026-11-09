"""Catalog parity, source-key coverage and reproducible browser bundle."""
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ROOT / "sl_guard" / "locales"
SOURCES = [
    ROOT / "sl_guard" / "plugin.py",
    ROOT / "sl_guard" / "views.py",
    ROOT / "sl_guard" / "static" / "sl_guard_panel.js",
    ROOT / "sl_guard" / "static" / "sl_guard_dashboard.js",
]
CALL = re.compile(r"\btr\(\s*['\"]([a-z][a-z0-9_]*)['\"]")
PARAMETER = re.compile(r"\{([a-z_]+)\}", re.I)


def get_catalogs():
    return {
        locale: json.loads((LOCALES / f"{locale}.json").read_text(encoding="utf-8"))
        for locale in ("en", "ru")
    }


def test_translation_keys_and_placeholders_match():
    catalogs = get_catalogs()
    assert catalogs["en"]
    assert set(catalogs["en"]) == set(catalogs["ru"])
    for key in catalogs["en"]:
        assert re.fullmatch(r"[a-z][a-z0-9_]*", key), key
        english, russian = catalogs["en"][key], catalogs["ru"][key]
        assert english and russian, key
        assert set(PARAMETER.findall(english)) == set(PARAMETER.findall(russian)), key


def test_every_source_translation_key_is_in_shared_catalog():
    en_keys = set(get_catalogs()["en"])
    for source in SOURCES:
        content = source.read_text(encoding="utf-8")
        keys = set(CALL.findall(content))
        assert keys, source
        assert keys <= en_keys, (source, sorted(keys - en_keys))


def test_generated_browser_catalog_is_reproducible():
    proc = subprocess.run(
        [sys.executable, str(ROOT / "tools" / "build_i18n.py"), "--check"],
        capture_output=True, text=True, cwd=ROOT, check=False,
    )
    assert proc.returncode == 0, proc.stdout + proc.stderr
