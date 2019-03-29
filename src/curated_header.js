import "@vaadin/vaadin-accordion/theme/lumo/vaadin-accordion.js";
import "@vaadin/vaadin-accordion/theme/lumo/vaadin-accordion.js";
import "@vaadin/vaadin-notification/theme/lumo/vaadin-notification.js";
import "@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox.js";
import "@vaadin/vaadin-checkbox/theme/lumo/vaadin-checkbox-group.js";
import "@vaadin/vaadin-button/theme/lumo/vaadin-button.js";
import "@vaadin/vaadin-overlay/theme/lumo/vaadin-overlay.js";
import "@vaadin/vaadin-date-picker/theme/lumo/vaadin-date-picker.js";
import "@vaadin/vaadin-split-layout/theme/lumo/vaadin-split-layout.js";
import "@vaadin/vaadin-progress-bar/theme/lumo/vaadin-progress-bar.js";
import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-item.js";
import "@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box-light.js";
import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown.js";
import "@vaadin/vaadin-combo-box/src/vaadin-combo-box-dropdown-wrapper.js";
import "@vaadin/vaadin-combo-box/theme/lumo/vaadin-combo-box.js";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-text-field.js";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-password-field.js";
import "@vaadin/vaadin-text-field/theme/lumo/vaadin-text-area.js";
import "@vaadin/vaadin-context-menu/theme/lumo/vaadin-context-menu.js";
import "@vaadin/vaadin-context-menu/src/vaadin-device-detector.js";
import "@vaadin/vaadin-context-menu/src/vaadin-context-menu-overlay.js";
import "@vaadin/vaadin-tabs/theme/lumo/vaadin-tabs.js";
import "@vaadin/vaadin-tabs/theme/lumo/vaadin-tab.js";
import "@vaadin/vaadin-item/theme/lumo/vaadin-item.js";
import "@vaadin/vaadin-material-styles/version.js";
import "@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-horizontal-layout.js";
import "@vaadin/vaadin-ordered-layout/theme/lumo/vaadin-vertical-layout.js";
import "@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-layout.js";
import "@vaadin/vaadin-form-layout/theme/lumo/vaadin-form-item.js";
import "@vaadin/vaadin-list-box/theme/lumo/vaadin-list-box.js";
import "@vaadin/vaadin-select/src/vaadin-select.js";
import "@vaadin/vaadin-upload/src/vaadin-upload-file.js";
import "@vaadin/vaadin-upload/theme/lumo/vaadin-upload.js";
import "@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog.js";
import "@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-group.js";
import "@vaadin/vaadin-radio-button/theme/lumo/vaadin-radio-button.js";
import "./unide-grid.js";

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
        ]
      ],
      ["tabs", ["vaadin-tabs", "(", ")"]],
      ["tab", ["vaadin-tab", "(", ")"]]
    ]
  ],

  [
    "<h2>Fields</h2>",
    [
      ["combo-box", ["vaadin-combo-box", "(", ")"]],
      ["context-menu", ["vaadin-context-menu", "(", ")"]],
      ["item", ["vaadin-item", "(", ")"]],
      ["date-picker", ["vaadin-date-picker", "(", ")"]],
      ["grid", ["unide-grid", "(", ")"]],
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
