"""Structural regression for Postgres nullable-join lock bug.

The local package test environment doesn't include a live InvenTree / PostgreSQL
instance. This asserts the ORM lock scope without pretending to be a DB test.
"""
import ast
from pathlib import Path


def test_bulk_lock_only_stocklocation():
    source = (Path(__file__).resolve().parents[1] / 'sl_guard' / 'views.py').read_text()
    tree = ast.parse(source)
    bulk = next(node for node in tree.body if isinstance(node, ast.FunctionDef) and node.name == 'bulk_update_type')
    calls = [node for node in ast.walk(bulk) if isinstance(node, ast.Call)
             and isinstance(node.func, ast.Attribute) and node.func.attr == 'select_for_update']
    assert len(calls) == 1
    assert not calls[0].args
    assert len(calls[0].keywords) == 1
    key = calls[0].keywords[0]
    assert key.arg == 'of' and isinstance(key.value, ast.Tuple)
    assert len(key.value.elts) == 1 and isinstance(key.value.elts[0], ast.Constant)
    assert key.value.elts[0].value == 'self'
    assert isinstance(calls[0].func.value, ast.Call)
    assert calls[0].func.value.func.attr == 'select_related'
