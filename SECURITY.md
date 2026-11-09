# Security policy

## Supported versions

Until wider testing is complete, **0.3.0 is a beta validated only against InvenTree 1.6.1**. There is no guarantee of compatibility with newer upstream internals.

## Reporting a vulnerability

Please **do not** post tokens, passwords, API headers, internal IPs, customer records, database dumps, or reproducible exploits against a production system in a public issue.

Until the maintainer configures a private security contact on GitHub, use GitHub's private vulnerability reporting feature (once enabled) or wait for a maintainer-approved private contact. Do not assume an email address from this repository.

## Security boundary

The plugin relies on normal InvenTree authentication plus a model `save()` plugin hook. It **does not** protect against direct DB writes, bulk model updates bypassing `save()`, all tree mutation operations, or deletion of protected types. Administrators must independently restrict SQL and privileged service access.
