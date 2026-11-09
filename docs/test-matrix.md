# Integration test matrix (required before stable release)

Execute against an isolated InvenTree 1.6.1 instance with a PostgreSQL backup. Do not perform these tests on live racks.

| Scenario | Required result |
| --- | --- |
| New protected type assigned by ordinary user with regular change permission | Allowed |
| Protected type removed/changed by ordinary user | Denied; original type retained |
| Protected type removed/changed by superuser | Allowed |
| Protected type removed/changed by approved group with regular change permission | Allowed |
| Protected location relocated via normal form as ordinary user | Denied; original parent retained |
| Same action via normal form as superuser / approved group | Allowed |
| Protected location relocated via barcode scan | Appropriate permissions enforced; verify database parent |
| Unprotected ancestor relocated with protected descendant | Denied to ordinary user |
| Ordinary box under protected shelf relocated | Allowed when no protected descendants |
| Rename/description change on protected location | Allowed under normal InvenTree rights |
| Batch type preview then commit on 70+ locations | Correct IDs; atomic; no false client timeout |
| Batch with inaccessible or invalid location ID | Whole request denied, no partial changes |
| Two identical leaf names under different parents | Unique IDs and correct full paths displayed |
| Non-admin attempts direct management API calls | 403 |
| Plugin disabled and application restarted | Verify no protection calls and normal InvenTree behavior |
| Upgrade InvenTree | Re-run all tests; validate bridge and UI compatibility |

Also run manual inspection for deletion of protected nodes, location types, and unusual MPTT operations. Mark these unsupported if they cannot be guarded reliably.
