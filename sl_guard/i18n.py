"""Shared EN/RU localization for Django errors and plugin metadata.

The exact same JSON catalogs are compiled into static/sl_guard_i18n.js for the
browser by tools/build_i18n.py. UI locale and Django request locale may differ.
"""
import json
import re
from importlib import resources

from django.utils.translation import get_language


def _load_locale(language: str) -> dict[str, str]:
    path = resources.files("sl_guard").joinpath("locales", f"{language}.json")
    return json.loads(path.read_text(encoding="utf-8"))


_CATALOGS = {language: _load_locale(language) for language in ("en", "ru")}
_PARAMETERS = re.compile(r"\{([a-z_]+)\}", re.IGNORECASE)


def tr(key: str, **parameters: object) -> str:
    """Translate a semantic key using Django's active locale (EN fallback)."""
    language = (get_language() or "en").lower().split("-")[0].split("_")[0]
    catalog = _CATALOGS.get(language, _CATALOGS["en"])
    value = catalog.get(key, _CATALOGS["en"].get(key, key))
    return _PARAMETERS.sub(
        lambda match: str(parameters.get(match.group(1), match.group(0))),
        value,
    )
