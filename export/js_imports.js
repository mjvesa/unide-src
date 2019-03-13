let jsImports = {
  "vaadin-notification":
    'import "@vaadin/vaadin-notification/theme/lumo/vaadin-notification.js";',
  "vaadin-checkbox":
    'import "@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox.js";',
  "vaadin-checkbox-group":
    'import "@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group.js";',
  "vaadin-button":
    'import "@vaadin/vaadin-button/theme/lumo/vaadin-button.js";',
  "vaadin-overlay":
    'import "@vaadin/vaadin-overlay/theme/lumo/vaadin-overlay";',
  "vaadin-date-picker":
    'import "@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js";',
  "vaadin-date-picker-light":
    'import "@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker-light.js";',
  "vaadin-infinite-scroller":
    'import "@vaadin/vaadin-date-picker/src/vaadin-infinite-scroller.js";',
  "vaadin-date-picker-overlay":
    'import "@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay.js";',
  "vaadin-date-picker-overlay-content":
    'import "@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay-content.js";',
  "vaadin-month-calendar":
    'import "@vaadin/vaadin-date-picker/src/vaadin-month-calendar.js";',
  "vaadin-split-layout":
    'import "@vaadin/vaadin-split-layout/theme/lumo/vaadin-split-layout.js";',
  "observer-component":
    'import "@vaadin/vaadin-split-layout/test/observer-component.js";',
  "vaadin-progress-bar":
    'import "@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar.js";',
  "vaadin-combo-box-item":
    'import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-item.js";',
  "vaadin-combo-box-light":
    'import "@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js";',
  "vaadin-combo-box-dropdown":
    'import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown.js";',
  "vaadin-combo-box-dropdown-wrapper":
    'import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown-wrapper.js";',
  "vaadin-combo-box":
    'import "@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box.js";',
  "vaadin-text-field":
    'import "@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js";',
  "vaadin-password-field":
    'import "@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field.js";',
  "vaadin-text-area":
    'import "@vaadin/vaadin-text-field/theme/lumo/vaadin-text-area.js";',
  "vaadin-context-menu":
    'import "@vaadin/vaadin-context-menu/theme/lumo/vaadin-context-menu.js";',
  "vaadin-device-detector":
    'import "@vaadin/vaadin-context-menu/src/vaadin-device-detector.js";',
  "vaadin-context-menu-overlay":
    'import "@vaadin/vaadin-context-menu/src/vaadin-context-menu-overlay.js";',
  "vaadin-tabs": 'import "@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs.js";',
  "vaadin-tab.js": 'import "@vaadin/vaadin-tabs/theme/lumo/vaadin-tab.js";',
  "vaadin-item.js:": 'import "@vaadin/vaadin-item/theme/lumo/vaadin-item.js";',
  "version.js:": 'import "@vaadin/vaadin-material-styles/version.js";',
  "vaadin-horizontal-layout.js":
    'import "@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-horizontal-layout.js";',
  "vaadin-vertical-layout.js":
    'import "@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-vertical-layout.js";',
  "vaadin-form-layout.js":
    'import "@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-layout.js";',
  "vaadin-form-item.js":
    'import "@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-item.js";',
  "vaadin-grid-filter":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter.js";',
  "vaadin-grid-sort-column.js":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sort-column.js";',
  "vaadin-grid-selection-column":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-selection-column.js";',
  "vaadin-grid-column":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column.js";',
  "vaadin-grid": 'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid.js";',
  "vaadin-grid-scroller":
    'import "@vaadin/vaadin-grid/src/vaadin-grid-scroller.js";',
  "vaadin-grid-templatizer":
    'import "@vaadin/vaadin-grid/src/vaadin-grid-templatizer.js";',
  "vaadin-grid-tree-column":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-column.js";',
  "vaadin-grid-column-group":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column-group.js";',
  "vaadin-grid-tree-toggle":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-toggle.js";',
  "vaadin-grid-filter-column":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter-column.js";',
  "vaadin-grid-sorter":
    'import "@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sorter.js";',
  "vaadin-grid-outer-scroller":
    'import "@vaadin/vaadin-grid/src/vaadin-grid-outer-scroller.js";',
  "vaadin-list-box":
    'import "@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js";',
  "vaadin-dropdown-menu-overlay":
    'import "@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-overlay.js";',
  "vaadin-select":
    'import "@vaadin/vaadin-select/theme/lumo/vaadin-select.js";',
  "vaadin-dropdown-menu-text-field":
    'import "@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-text-field.js";',
  "vaadin-upload-file":
    'import "@vaadin/vaadin-upload/src/vaadin-upload-file.js";',
  "vaadin-upload.js":
    'import "@vaadin/vaadin-upload/theme/lumo/vaadin-upload.js";',
  "vaadin-dialog":
    'import "@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog.js";',
  "vaadin-radio-group":
    'import "@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group.js";',
  "vaadin-radio-button":
    'import "@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button.js";'
};

export default jsImports;
