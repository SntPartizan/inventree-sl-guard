# Contributing

Thank you for considering a contribution.

1. Open an issue describing the problem, version of InvenTree, and a minimal reproducible example **without private data**.
2. Make a focused change in a branch, add a regression test, and update both READMEs when behavior changes.
3. Run:

   ```bash
   python -m pytest -q tests
   node --test tests/js/search.test.mjs
   ```

4. Open a pull request. Maintainers review API and permission changes particularly carefully.

Please avoid changing the upstream InvenTree source in this repository. The optional frontend patch script is a separate developer utility, not a condition for using the plugin.
