#!/usr/bin/env python3
"""Source-only opt-in patch for InvenTree 1.6.1 stock location barcode UI.

Does NOT touch compiled frontend bundles. Rebuild/deploy frontend separately.
Creates an adjacent backup before editing.
"""
from pathlib import Path
import argparse
import shutil

BLOCK = '''        .catch((error) => {
          console.error('Error scanning stock location:', error);
          return {
            error: t`Error scanning stock location`
          };
        });'''
REPLACEMENT = '''        .catch((error) => {
          console.error('Error scanning stock location:', error);
          // The StockLocation API can return a validation reason in `parent`.
          // Preserve its message instead of showing only a generic scan error.
          const data = error?.response?.data;
          const detail = data?.parent ?? data?.detail ?? data?.non_field_errors;
          const reason = Array.isArray(detail)
            ? detail.join('; ')
            : typeof detail === 'string'
              ? detail
              : undefined;
          return {
            error: reason || t`Error scanning stock location`
          };
        });'''


def patch(path: Path, apply: bool) -> str:
    original = path.read_text(encoding='utf-8')
    if original.count(REPLACEMENT) == 1:
        return 'Already patched'
    if original.count(BLOCK) != 1:
        raise RuntimeError('Expected 1.6.1 source block not found exactly once. File unchanged.')
    if not apply:
        return 'Compatible source confirmed. Use --apply to modify.'
    backup = path.with_suffix(path.suffix + '.slg-backup')
    if backup.exists():
        raise RuntimeError(f'Backup already exists: {backup}. No changes made.')
    shutil.copy2(path, backup)
    path.write_text(original.replace(BLOCK, REPLACEMENT), encoding='utf-8')
    return f'Patched: {path}; backup: {backup}'


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('root', type=Path, help='InvenTree project root, e.g. ~/InvenTree-local')
    parser.add_argument('--apply', action='store_true', help='Apply after dry-run')
    args = parser.parse_args()
    target = args.root.expanduser() / 'src/frontend/src/pages/stock/LocationDetail.tsx'
    print(patch(target, args.apply))
