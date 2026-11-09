# SL Guard v0.3.2 (beta)

A polish release for the InvenTree stock-location protection plugin, tested on **InvenTree 1.6.1**.

### What's new
- Consistent Tabler-style **outline shield** on the SL Guard page title, protected-location count and dashboard widget
- The standard navigation tab now reads simply **SL Guard**, with no emoji or menu DOM injection
- **Protected / Locked** status badges follow the active InvenTree theme
- Dashboard widget: larger title and shield, centered counters/captions, compact one-column minimum width, unchanged minimum height
- Updated English and Russian README documentation and expanded Python/JavaScript tests

### Compatibility / security
- Existing protected type IDs and authorized group settings remain unchanged on upgrade
- No changes to StockLocation permission or protection behavior
- InvenTree 1.6.1 tested; newer versions should be tested separately
- The plugin still uses a narrow internal `LocationSerializer.validate()` bridge to obtain the authenticated user; direct database updates and some bulk operations are outside the model validation guard

### Install / upgrade
In the InvenTree plugin installer, use package name **`inventree-sl-guard`**, leaving Source URL and Version blank after PyPI publication. Restart web/worker processes and refresh browser assets if needed.

Source: https://github.com/SntPartizan/inventree-sl-guard
