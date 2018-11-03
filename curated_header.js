import "./node_modules/@vaadin/vaadin-notification/theme/lumo/vaadin-notification.js";
import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox.js";
import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group.js";
import "./node_modules/@vaadin/vaadin-button/theme/lumo/vaadin-button.js";
import "./node_modules/@vaadin/vaadin-overlay/theme/lumo/vaadin-overlay.js";
import "./node_modules/@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js";
import "./node_modules/@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker-light.js";
import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-infinite-scroller.js";
import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay.js";
import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-date-picker-overlay-content.js";
import "./node_modules/@vaadin/vaadin-date-picker/src/vaadin-month-calendar.js";
import "./node_modules/@vaadin/vaadin-split-layout/theme/lumo/vaadin-split-layout.js";
import "./node_modules/@vaadin/vaadin-split-layout/test/observer-component.js";
import "./node_modules/@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar.js";
import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-item.js";
import "./node_modules/@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js";
import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown.js";
import "./node_modules/@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown-wrapper.js";
import "./node_modules/@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box.js";
import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js";
import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field.js";
import "./node_modules/@vaadin/vaadin-text-field/theme/lumo/vaadin-text-area.js";
import "./node_modules/@vaadin/vaadin-context-menu/theme/lumo/vaadin-context-menu.js";
import "./node_modules/@vaadin/vaadin-context-menu/src/vaadin-device-detector.js";
import "./node_modules/@vaadin/vaadin-context-menu/src/vaadin-context-menu-overlay.js";
import "./node_modules/@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs.js";
import "./node_modules/@vaadin/vaadin-tabs/theme/lumo/vaadin-tab.js";
import "./node_modules/@vaadin/vaadin-item/theme/lumo/vaadin-item.js";
import "./node_modules/@vaadin/vaadin-material-styles/version.js";
import "./node_modules/@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-horizontal-layout.js";
import "./node_modules/@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-vertical-layout.js";
import "./node_modules/@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-layout.js";
import "./node_modules/@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-item.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sort-column.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-selection-column.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid.js";
import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-scroller.js";
import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-templatizer.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-column.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-column-group.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-tree-toggle.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-filter-column.js";
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid-sorter.js";
import "./node_modules/@vaadin/vaadin-grid/src/vaadin-grid-outer-scroller.js";
import "./node_modules/@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js";
import "./node_modules/@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-overlay.js";
import "./node_modules/@vaadin/vaadin-dropdown-menu/theme/lumo/vaadin-dropdown-menu.js";
import "./node_modules/@vaadin/vaadin-dropdown-menu/src/vaadin-dropdown-menu-text-field.js";
import "./node_modules/@vaadin/vaadin-upload/src/vaadin-upload-file.js";
import "./node_modules/@vaadin/vaadin-upload/theme/lumo/vaadin-upload.js";
import "./node_modules/@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog.js";
import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group.js";
import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button.js";
let paletteContent = [
  [
    "<h2>Templates</h2>",
    [
      [
        "login-form",
        [
          "div",
          "  (",
          "style",
          "width: 100%; height: 100%",
          "=",
          "div",
          "(",
          "style",
          "width: 100%; display:grid;grid-template-columns: 10em auto; background-color: #ddf;padding: 1em",
          "=",
          "span",
          "(",
          "textContent",
          " name",
          "=",
          ")",
          "vaadin-text-field",
          "(",
          ")",
          "span",
          "(",
          "textContent",
          " password",
          "=",
          ")",
          "vaadin-password-field",
          "(",
          ")",
          "span",
          "(",
          ")",
          "span",
          "(",
          "style",
          " display:flex",
          "=",
          "vaadin-button",
          "(",
          "textContent",
          "login",
          "=",
          ")",
          "vaadin-button",
          "(",
          "textContent",
          "register",
          "=",
          ")",
          ")",
          ")",
          "  )"
        ]
      ]
    ]
  ],
  [
    "<h2>Native HTML</h2>",
    [
      ["div", ["div", "(", ")"]],
      ["span", ["span", "(", ")"]],
      [
        "ul",
        [
          "ul",
          "(",
          "li",
          "(",
          "textContent",
          "item1",
          "=",
          ")",
          "li",
          "(",
          "textContent",
          "item2",
          "=",
          ")",
          ")"
        ]
      ],
      [
        "ol",
        [
          "ol",
          "(",
          "li",
          "(",
          "textContent",
          "item1",
          "=",
          ")",
          "li",
          "(",
          "textContent",
          "item2",
          "=",
          ")",
          ")"
        ]
      ]
    ]
  ],
  [
    "<h2>Data entry</h2>",
    [
      ["checkbox", ["vaadin-checkbox", "(", ")"]],
      [
        "checkbox-group",
        [
          "vaadin-checkbox-group",
          "(",
          "vaadin-checkbox",
          "(",
          ")",
          "vaadin-checkbox",
          "(",
          ")",
          ")"
        ]
      ],
      ["button", ["vaadin-button", "(", ")"]],
      ["radio-button", ["vaadin-radio-button", "(", ")"]],
      [
        "radio-group",
        [
          "vaadin-radio-group",
          "(",
          "vaadin-radio-button",
          "(",
          ")",
          "vaadin-radio-button",
          "(",
          ")",
          ")"
        ]
      ],
      ["text-field", ["vaadin-text-field", "(", ")"]],
      ["text-area", ["vaadin-text-area", "(", ")"]],
      ["password-field", ["vaadin-password-field", "(", ")"]],
      ["date-picker", ["vaadin-date-picker", "(", ")"]],
      ["combo-box", ["vaadin-combo-box", "(", ")"]],
      ["date-picker-light", ["vaadin-date-picker-light", "(", ")"]],
      ["infinite-scroller", ["vaadin-infinite-scroller", "(", ")"]],
      ["date-picker-overlay", ["vaadin-date-picker-overlay", "(", ")"]],
      [
        "date-picker-overlay-content",
        ["date-picker-overlay-content", "(", ")"]
      ],
      ["month-calendar", ["vaadin-month-calendar", "(", ")"]],
      ["progress-bar", ["vaadin-progress-bar", "(", ")"]],
      ["combo-box-item", ["vaadin-combo-box-item", "(", ")"]],
      ["combo-box-light", ["vaadin-combo-box-light", "(", ")"]],
      ["combo-box-dropdown", ["vaadin-combo-box-dropdown", "(", ")"]],
      ["combo-box-dropdown-wrapper", ["combo-box-dropdown-wrapper", "(", ")"]],
      ["context-menu", ["vaadin-context-menu", "(", ")"]],
      ["notification", ["vaadin-notification", "(", ")"]],
      ["device-detector", ["vaadin-device-detector", "(", ")"]],
      ["context-menu-overlay", ["vaadin-context-menu-overlay", "(", ")"]],
      ["tabs", ["vaadin-tabs", "(", ")"]],
      ["tab", ["vaadin-tab", "(", ")"]],
      ["item", ["vaadin-item", "(", ")"]],
      ["vaadin-grid-filter", ["vaadin-grid-filter", "(", ")"]]
    ]
  ],
  [
    "<h2>Layout</h2>",
    [
      ["vaadin-horizontal-layout", ["vaadin-horizontal-layout", "(", ")"]],
      ["vaadin-vertical-layout", ["vaadin-vertical-layout", "(", ")"]],
      ["vaadin-form-layout", ["vaadin-form-layout", "(", ")"]],
      ["vaadin-form-item", ["vaadin-form-item", "(", ")"]],
      ["split-layout", ["vaadin-split-layout", "(", ")"]]
    ]
  ],
  [
    "<h2>Grid</h2>",
    [
      ["grid", ["vaadin-grid", "(", ")"]],
      ["grid-sort-column", ["vaadin-grid-sort-column", "(", ")"]],
      ["grid-selection-column", ["vaadin-grid-selection-column", "(", ")"]],
      ["grid-column", ["vaadin-grid-column", "(", ")"]],
      ["grid-scroller", ["vaadin-grid-scroller", "(", ")"]],
      ["grid-templatizer", ["vaadin-grid-templatizer", "(", ")"]],
      ["grid-tree-column", ["vaadin-grid-tree-column", "(", ")"]],
      ["grid-column-group", ["vaadin-grid-column-group", "(", ")"]],
      ["grid-tree-toggle", ["vaadin-grid-tree-toggle", "(", ")"]],
      ["grid-filter-column", ["vaadin-grid-filter-column", "(", ")"]],
      ["grid-sorter", ["vaadin-grid-sorter", "(", ")"]],
      ["grid-outer-scroller", ["vaadin-grid-outer-scroller", "(", ")"]],
      ["list-box", ["vaadin-list-box", "(", ")"]],
      ["upload-file", ["vaadin-upload-file", "(", ")"]],
      ["upload", ["vaadin-upload", "(", ")"]],
      ["dialog", ["vaadin-dialog", "(", ")"]]
    ]
  ],
  ["<h2>Misc</h2>", []]
];
