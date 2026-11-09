# Maintainer release guide

1. Review license ownership/attribution, package name availability on PyPI, public branding and screenshots. Do not publish code copied from a private or third-party project without reviewing license and rights.
2. Run the CI tests and the [manual test matrix](test-matrix.md). No production secrets or backups should be committed.
3. Update version in `pyproject.toml`, `sl_guard/__init__.py`, `plugin.py`, and CHANGELOG.
4. Create GitHub release with signed/tagged version such as `v0.3.0` after the first public push.
5. Create/claim the package name on PyPI and configure a **Trusted Publisher** for a protected GitHub Actions workflow (do not put PyPI API tokens in the repository). Set up publication only after identity and permissions are confirmed.
6. Submit a listing request to the InvenTree project when the release is verified on supported versions.

The supplied CI workflow **does not publish** anything. Keep the first release explicitly manual to avoid accidental uploads.

## Repository branding

The recommended GitHub URL is `https://github.com/SntPartizan/inventree-sl-guard` after renaming the existing empty repository through GitHub **Settings → General → Repository name**. The plugin distribution, entry point, and URL slug have all been changed to the matching **SL Guard** identifiers.
