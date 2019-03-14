import "./node_modules/@vaadin/vaadin-accordion/theme/lumo/vaadin-accordion.js";
import "./node_modules/@vaadin/vaadin-accordion/theme/lumo/vaadin-accordion.js";
import "./node_modules/@vaadin/vaadin-notification/theme/lumo/vaadin-notification.js";
import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox.js";
import "./node_modules/@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group.js";
import "./node_modules/@vaadin/vaadin-button/theme/lumo/vaadin-button.js";
import "./node_modules/@vaadin/vaadin-overlay/theme/lumo/vaadin-overlay.js";
import "./node_modules/@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js";
import "./node_modules/@vaadin/vaadin-split-layout/theme/lumo/vaadin-split-layout.js";
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
import "./node_modules/@vaadin/vaadin-grid/theme/lumo/vaadin-grid.js";
import "./node_modules/@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js";
import "./node_modules/@vaadin/vaadin-select/src/vaadin-select.js";
import "./node_modules/@vaadin/vaadin-upload/src/vaadin-upload-file.js";
import "./node_modules/@vaadin/vaadin-upload/theme/lumo/vaadin-upload.js";
import "./node_modules/@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog.js";
import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group.js";
import "./node_modules/@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button.js";

export let paletteContent = [
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
          "width: 100%; display:grid;grid-template-columns: 10em auto; background-color: #ddf;padding: 1em; box-sizing:border-box;",
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
      ["a", ["a", "(", ")"]],
      ["article", ["article", "(", ")"]],
      ["aside", ["aside", "(", ")"]],
      ["div", ["div", "(", ")"]],
      ["h1", ["h1", "(", ")"]],
      ["h2", ["h2", "(", ")"]],
      ["h3", ["h3", "(", ")"]],
      ["h4", ["h4", "(", ")"]],
      ["h5", ["h5", "(", ")"]],
      ["h6", ["h6", "(", ")"]],
      ["hr", ["hr", "(", ")"]],
      ["header", ["header", "(", ")"]],
      ["image", ["image", "(", ")"]],
      ["input", ["input", "(", ")"]],
      ["label", ["label", "(", ")"]],
      ["li", ["li", "(", ")"]],

      ["span", ["span", "(", ")"]],
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
      ],
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
      ]
    ]
  ],
  [
    "<h2>Buttons</h2>",
    [
      ["button", ["vaadin-button", "(", ")"]],
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
        ],
        ["tabs", ["vaadin-tabs", "(", ")"]],
        ["tab", ["vaadin-tab", "(", ")"]]
      ]
    ]
  ],

  [
    "<h2>Fields</h2>",
    [
      ["combo-box", ["vaadin-combo-box", "(", ")"]],
      ["context-menu", ["vaadin-context-menu", "(", ")"]],
      ["item", ["vaadin-item", "(", ")"]],
      ["date-picker", ["vaadin-date-picker", "(", ")"]],
      ["grid", ["vaadin-grid", "(", ")"]],
      ["list-box", ["vaadin-list-box", "(", ")"]],
      ["text-field", ["vaadin-text-field", "(", ")"]],
      ["text-area", ["vaadin-text-area", "(", ")"]],
      ["password-field", ["vaadin-password-field", "(", ")"]]
    ]
  ],
  [
    "<h2>Layout</h2>",
    [
      ["accordion", ["vaadin-accordion", "(", ")"]],
      ["app-layout", ["vaadin-app-layout", "(", ")"]],
      ["form-layout", ["vaadin-form-layout", "(", ")"]],
      ["form-item", ["vaadin-form-item", "(", ")"]],
      ["horizontal-layout", ["vaadin-horizontal-layout", "(", ")"]],
      ["vertical-layout", ["vaadin-vertical-layout", "(", ")"]],
      ["split-layout", ["vaadin-split-layout", "(", ")"]]
    ]
  ],
  [
    "<h2>Grid</h2>",
    [
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
      ["grid-filter", ["vaadin-grid-filter", "(", ")"]]
    ]
  ],
  [
    "<h2>Misc</h2>",
    [
      ["dialog", ["vaadin-dialog", "(", ")"]],
      ["notification", ["vaadin-notification", "(", ")"]],
      ["progress-bar", ["vaadin-progress-bar", "(", ")"]],
      ["upload-file", ["vaadin-upload-file", "(", ")"]],
      ["upload", ["vaadin-upload", "(", ")"]]
    ]
  ]
];
