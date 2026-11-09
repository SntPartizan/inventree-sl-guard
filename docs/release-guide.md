# Maintainer release guide

SL Guard is currently at Python package version **0.3.1**. It has been tested on InvenTree 1.6.1. It is not yet published on PyPI.

## Before publishing

1. Review code ownership, licensing, dependencies, packaging metadata, and screenshots. Never include credentials, database exports or private keys.
2. Confirm CI is green. Run the [manual integration test matrix](test-matrix.md) for the InvenTree version you intend to support.
3. Configure [PyPI Trusted Publishing](https://pypi.org/manage/account/publishing/) as a pending publisher (for the first release) or project publisher (for subsequent releases):
   - **PyPI project name:** `inventree-sl-guard`
   - **GitHub owner:** `SntPartizan`
   - **Repository:** `inventree-sl-guard`
   - **Workflow file:** `publish.yml`
   - **GitHub environment:** `pypi`
4. In [GitHub Environments](https://github.com/SntPartizan/inventree-sl-guard/settings/environments), create an environment named **`pypi`**. Protect it with deployment tag restrictions (`v*`) and optional manual approvals where available.

## Publishing a version

1. For future versions, change the version in `pyproject.toml`, `sl_guard/__init__.py`, `sl_guard/plugin.py`, and update `CHANGELOG.md` and README version references. Commit all changes and confirm CI.
2. Open [GitHub Releases](https://github.com/SntPartizan/inventree-sl-guard/releases) and choose **Draft a new release**.
3. Create a Git tag matching the `pyproject.toml` version **exactly**, prefixed by `v` (for the initial release, **`v0.3.1`**). Target the verified commit on `main`.
4. Set a release title such as **`SL Guard v0.3.1 (beta)`**, include release notes and select **Set as a pre-release** while compatibility is still limited. The Git tag is **`v0.3.1`**, even if the GitHub Release is marked as a pre-release.
5. **Publish release**. This triggers `.github/workflows/publish.yml`, which checks the tag against the package version, runs Python/JavaScript tests, builds a wheel and source distribution, checks package metadata, and uses OIDC Trusted Publishing to upload to PyPI.
6. Follow the [GitHub Actions](https://github.com/SntPartizan/inventree-sl-guard/actions) run. If the `pypi` environment requires approval, authorize it through GitHub. Check the published package at https://pypi.org/project/inventree-sl-guard/.

**Important:** PyPI does not permit overwriting distribution files of an already published version. To fix a release, increment the version, commit, and create a new release with the matching tag.

## Deployment

After the PyPI publication succeeds, install by package name `inventree-sl-guard` in the InvenTree plugin installer without a Git URL. Verify it loads and that protected types/groups retain their settings when upgrading the same plugin.

The standard `ci.yml` workflow validates normal commits but **does not publish anything**. Only publication of a GitHub Release triggers the separate `publish.yml` upload workflow.

## Community listing

After verifying the PyPI package, propose adding the plugin to the InvenTree community website using a pull request to https://github.com/inventree/inventree-website. Include a publisher profile and plugin listing following that repository's templates.
