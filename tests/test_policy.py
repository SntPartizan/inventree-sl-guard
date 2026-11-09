import pytest
from sl_guard.policy import (
    allow_exact_change,
    build_full_paths,
    authorized_exception_for,
    needs_authorization,
    parse_ids,
    serialize_ids,
)


@pytest.mark.parametrize("raw,expected", [
    ("", frozenset()),
    ("2,7, 2", frozenset({2, 7})),
    (None, frozenset()),
])
def test_parse_ids(raw, expected):
    assert parse_ids(raw) == expected


@pytest.mark.parametrize("raw", ["0", "-1", "2,", "abc", "1.2", "1;2", "  "])
def test_invalid_ids(raw):
    with pytest.raises(ValueError):
        parse_ids(raw)


def test_serialize_ids():
    assert serialize_ids({12, 2}) == "2,12"


@pytest.mark.parametrize("old_type,old_parent,new_type,new_parent,descendant,expected", [
    (5, 1, 5, 2, False, True),        # protected move
    (5, 1, 5, None, False, True),     # protected to root
    (5, 1, 9, 1, False, True),        # remove protected type
    (5, 1, 6, 1, False, True),        # protected -> protected
    (9, 1, 5, 1, False, False),       # ordinary -> protected (allowed)
    (9, 1, 5, 2, False, False),       # ordinary -> protected + move (allowed)
    (9, 1, 9, 2, False, False),       # ordinary move (allowed)
    (9, 1, 9, 2, True, True),         # moving ordinary parent of protected SL
    (5, 1, 5, 1, False, False),       # ordinary name / description change
])
def test_authorization(old_type, old_parent, new_type, new_parent, descendant, expected):
    assert needs_authorization(old_type, old_parent, new_type, new_parent,
                               {5, 6}, descendant) is expected


def test_exact_exception_does_not_leak():
    assert not authorized_exception_for(1, 3, 5)
    with allow_exact_change(1, 3, 5):
        assert authorized_exception_for(1, 3, 5)
        assert not authorized_exception_for(1, 4, 5)
        assert not authorized_exception_for(2, 3, 5)
    assert not authorized_exception_for(1, 3, 5)


def test_exception_reset_on_error():
    with pytest.raises(RuntimeError):
        with allow_exact_change(1, None, 5):
            raise RuntimeError("error")
    assert not authorized_exception_for(1, None, 5)


def test_full_paths_distinguish_identical_shelf_names():
    rows = [
        {"pk": 5, "name": "Полка 1", "parent_id": 4},
        {"pk": 1, "name": "Склад", "parent_id": None},
        {"pk": 2, "name": "Зал А", "parent_id": 1},
        {"pk": 3, "name": "Зал Б", "parent_id": 1},
        {"pk": 4, "name": "Стеллаж 4", "parent_id": 2},
        {"pk": 6, "name": "Стеллаж 4", "parent_id": 3},
        {"pk": 7, "name": "Полка 1", "parent_id": 6},
    ]
    paths = build_full_paths(rows)
    assert paths[5] == "Склад / Зал А / Стеллаж 4 / Полка 1"
    assert paths[7] == "Склад / Зал Б / Стеллаж 4 / Полка 1"
    assert paths[5] != paths[7]
    assert paths[1] == "Склад"


def test_full_paths_reject_broken_tree():
    with pytest.raises(ValueError, match="Missing parent"):
        build_full_paths([{"pk": 7, "name": "Полка 1", "parent_id": 99}])
    with pytest.raises(ValueError, match="Cycle"):
        build_full_paths([
            {"pk": 5, "name": "А", "parent_id": 6},
            {"pk": 6, "name": "Б", "parent_id": 5},
        ])
