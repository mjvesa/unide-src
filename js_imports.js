let jsImports = {
  "vaadin-notification":
    'import "./node_modules/@vaadin/vaadin-notification/theme/lumo/vaadin-notification.js";',
  "vaadin-checkbox":
    'import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox.js";',
  "vaadin-checkbox-group":
    'import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group.js";',
  "vaadin-button":
    'import "./node_modules/@vaadin/vaadin-button/theme/lumo/vaadin-button.js";',
  "vaadin-overlay":
    'import "./node_modules/@vaadin/vaadin-overlay/theme/lumo/vaadin-overlay";',
  "vaadin-date-picker":
    'import "./node_modules/@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js";',
  "vaadin-date-picker-light":
    'import "./node_modules/@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker-light.js";',
  "vaadin-infinite-scroller":
    'import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-infinite-scroller.js";',
  "vaadin-date-picker-overlay":
    'import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay.js";',
  "vaadin-date-picker-overlay-content":
    'import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay-content.js";',
  "vaadin-month-calendar":
    'import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-month-calendar.js";',
  "vaadin-split-layout":
    'import "./node_modules/@vaadin/vaadin-split-layout/theme/lumo/vaadin-split-layout.js";',
  "observer-component":
    'import "./node_modules/@vaadin/vaadin-split-layout/test/observer-component.js";',
  "vaadin-progress-bar":
    'import "./node_modules/@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar.js";',
  "vaadin-combo-box-item":
    'import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-item.js";',
  "vaadin-combo-box-light":
    'import "./node_modules/@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js";',
  "vaadin-combo-box-dropdown":
    'import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown.js";',
  "vaadin-combo-box-dropdown-wrapper":
    'import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown-wrapper.js";',
  "vaadin-combo-box":
    'import "./node_modules/@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box.js";',
  "vaadin-text-field":
    'import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js";',
  "vaadin-password-field":
    'import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field.js";',
  "vaadin-text-area":
    'import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-text-area.js";',
  "vaadin-context-menu":
    'import "./node_modules/@vaadin/vaadin-context-menu/theme/lumo/vaadin-context-menu.js";',
  "vaadin-device-detector":
    'import "./node_modules/@vaadin/vaadin-context-menu/src/vaadin-device-detector.js";',
  "vaadin-context-menu-overlay":
    'import "./node_modules/@vaadin/vaadin-context-menu/src/vaadin-context-menu-overlay.js";',
  "vaadin-tabs":
    'import "./node_modules/@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs.js";',
  "vaadin-tab.js":
    'import "./node_modules/@vaadin/vaadin-tabs/theme/lumo/vaadin-tab.js";',
  "vaadin-item.js:":
    'import "./node_modules/@vaadin/vaadin-item/theme/lumo/vaadin-item.js";',
  "version.js:":
    'import "./node_modules/@vaadin/vaadin-material-styles/version.js";',
  "vaadin-horizontal-layout.js":
    'import "./node_modules/@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-horizontal-layout.js";',
  "vaadin-vertical-layout.js":
    'import "./node_modules/@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-vertical-layout.js";',
  "vaadin-form-layout.js":
    'import "./node_modules/@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-layout.js";',
  "vaadin-form-item.js":
    'import "./node_modules/@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-item.js";',
  "vaadin-grid-filter":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter.js";',
  "vaadin-grid-sort-column.js":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sort-column.js";',
  "vaadin-grid-selection-column":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-selection-column.js";',
  "vaadin-grid-column":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column.js";',
  "vaadin-grid":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid.js";',
  "vaadin-grid-scroller":
    'import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-scroller.js";',
  "vaadin-grid-templatizer":
    'import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-templatizer.js";',
  "vaadin-grid-tree-column":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-column.js";',
  "vaadin-grid-column-group":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column-group.js";',
  "vaadin-grid-tree-toggle":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-toggle.js";',
  "vaadin-grid-filter-column":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter-column.js";',
  "vaadin-grid-sorter":
    'import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sorter.js";',
  "vaadin-grid-outer-scroller":
    'import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-outer-scroller.js";',
  "vaadin-list-box":
    'import "./node_modules/@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js";',
  "vaadin-dropdown-menu-overlay":
    'import "./node_modules/@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-overlay.js";',
  "vaadin-dropdown-menu":
    'import "./node_modules/@vaadin/vaadin-dropdown-menu/theme/lumo/vaadin-dropdown-menu.js";',
  "vaadin-dropdown-menu-text-field":
    'import "./node_modules/@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-text-field.js";',
  "vaadin-upload-file":
    'import "./node_modules/@vaadin/vaadin-upload/src/vaadin-upload-file.js";',
  "vaadin-upload.js":
    'import "./node_modules/@vaadin/vaadin-upload/theme/lumo/vaadin-upload.js";',
  "vaadin-dialog":
    'import "./node_modules/@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog.js";',
  "vaadin-radio-group":
    'import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group.js";',
  "vaadin-radio-button":
    'import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button.js";'
};

export default jsImports;
