"""Small testable policy, independent of InvenTree and Django imports."""

from contextvars import ContextVar
from contextlib import contextmanager

# An exception exists only during one server-side request verified against roles.
# Never expose any API that accepts or changes this context token directly.
_allowed_change = ContextVar("sl_guard_allowed_change", default=None)


def parse_ids(value):
    """Parse comma separated primary keys from plugin settings; reject malformed config."""
    if value is None or value == "":
        return frozenset()
    if not isinstance(value, str):
        raise ValueError("Expected comma-separated integer IDs")
    tokens = value.split(",")
    output = set()
    for token in tokens:
        token = token.strip()
        if not token.isascii() or not token.isdecimal() or int(token) <= 0:
            raise ValueError("Settings must contain positive IDs separated by commas")
        output.add(int(token))
    return frozenset(output)


def serialize_ids(ids):
    return ",".join(str(item) for item in sorted(ids))


def needs_authorization(old_type_id, old_parent_id, new_type_id, new_parent_id,
                        protected_types, has_protected_descendant=False):
    """Check changes to existing nodes. Assignment of protection is NOT restricted."""
    moved = old_parent_id != new_parent_id
    changed_type = old_type_id != new_type_id
    was_protected = old_type_id in protected_types
    if was_protected and (moved or changed_type):
        return True
    if moved and has_protected_descendant:
        return True
    return False


def authorized_exception_for(pk, new_parent_id, new_type_id):
    return _allowed_change.get() == (pk, new_parent_id, new_type_id)


@contextmanager
def allow_exact_change(pk, new_parent_id, new_type_id):
    """Narrow one-operation exception. Safe for threads / async contexts."""
    token = _allowed_change.set((pk, new_parent_id, new_type_id))
    try:
        yield
    finally:
        _allowed_change.reset(token)


def build_full_paths(rows):
    """Build full hierarchical StockLocation names, even with duplicate leaf names.

    Input rows contain pk, name, parent_id. Caller controls visibility and ID
    formatting; a path is for display/search, never a unique identifier.
    """
    by_id = {row["pk"]: row for row in rows}
    paths = {}

    def resolve(pk, visiting):
        if pk in paths:
            return paths[pk]
        if pk in visiting:
            raise ValueError(f"Cycle in StockLocation ancestry at {pk}")
        row = by_id[pk]
        parent = row["parent_id"]
        if parent is None:
            full_path = row["name"]
        else:
            if parent not in by_id:
                raise ValueError(f"Missing parent {parent} for StockLocation {pk}")
            full_path = f"{resolve(parent, visiting | {pk})} / {row['name']}"
        paths[pk] = full_path
        return full_path

    for location_id in by_id:
        resolve(location_id, set())
    return paths
