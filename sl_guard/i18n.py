"""Small self-contained EN/RU translations for the Django plugin layer.

The UI uses InvenTree's plugin context.locale. Django API error messages use
Django's active request language, which can differ from the SPA preference.
"""
from django.utils.translation import get_language


def tr(english: str, russian: str) -> str:
    """Use English by default and Russian when Django activates ru locale."""
    language = (get_language() or 'en').lower().split('-')[0].split('_')[0]
    return russian if language == 'ru' else english
