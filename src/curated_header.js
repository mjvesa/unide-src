import "./unide-grid.js";

export const paletteContent = [
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
    "<h2>Unide components</h2>",
    [
      [
        "Button primary",
        [
          "unide-button",
          "(",
          "textContent",
          "Button",
          "=",
          "theme",
          "primary",
          "=",
          ")"
        ]
      ],
      ["Button", ["unide-button", "(", "textContent", "Button", "=", ")"]],
      [
        "Select",
        [
          "unide-select",
          "(",
          "value",
          "1",
          "=",
          "MenuItem",
          "(",
          "value",
          "1",
          "=",
          "textContent",
          "Item1",
          "=",
          ")",
          "MenuItem",
          "(",
          "value",
          "2",
          "=",
          "textContent",
          "Item2",
          "=",
          ")",
          "MenuItem",
          "(",
          "value",
          "3",
          "=",
          "textContent",
          "Item3",
          "=",
          ")",
          ")"
        ]
      ],

      [
        "Tabs",
        [
          "unide-tabs",
          "(",
          "unide-tab",
          "(",
          "textContent",
          "Tab1",
          "=",
          ")",
          "unide-tab",
          "(",
          "textContent",
          "Tab2",
          "=",
          ")",
          "unide-tab",
          "(",
          "textContent",
          "Tab3",
          "=",
          ")",
          ")"
        ]
      ],
      ["Tab", ["unide-tab", "(", ")"]],
      ["TextField", ["unide-text-field", "(", ")"]],
      [
        "Slider",
        [
          "unide-slider",
          "(",
          "marks",
          '[{"value":0,"label":"0°C"},{"value":20,"label":"20°C"},{"value":37,"label":"37°C"},{"value":100,"label":"100°C"}]',
          "=",
          ")"
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
      ["h1", ["h1", "(", "textContent", "h1 header", "=", ")"]],
      ["h2", ["h2", "(", "textContent", "h2 header", "=", ")"]],
      ["h3", ["h3", "(", "textContent", "h3 header", "=", ")"]],
      ["h4", ["h4", "(", "textContent", "h4 header", "=", ")"]],
      ["h5", ["h5", "(", "textContent", "h5 header", "=", ")"]],
      ["h6", ["h6", "(", "textContent", "h6 header", "=", ")"]],
      ["hr", ["hr", "(", "style", "width:100px;", "=", ")"]],
      ["header", ["header", "(", ")"]],
      ["image", ["image", "(", ")"]],
      ["input text", ["input", "(", "type", "text", "=", ")"]],
      ["input range", ["input", "(", "type", "range", "=", ")"]],
      ["label", ["label", "(", ")"]],
      ["li", ["li", "(", ")"]],
      ["p", ["p", "(", "textContent", "Paragraph", "=", ")"]],
      ["span", ["span", "(", "textContent", "Span", "=", ")"]],
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
      [
        "tabs",
        [
          "vaadin-tabs",
          "(",
          "vaadin-tab",
          "(",
          "textContent",
          "Tab1",
          "=",
          ")",
          "vaadin-tab",
          "(",
          "textContent",
          "Tab2",
          "=",
          ")",
          ")"
        ]
      ],
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
      ["time-picker", ["vaadin-time-picker", "(", ")"]],
      ["password-field", ["vaadin-password-field", "(", ")"]],
      ["email-field", ["vaadin-email-field", "(", ")"]],
      ["number-field", ["vaadin-number-field", "(", ")"]]
    ]
  ],
  [
    "<h2>Layout</h2>",
    [
      ["accordion", ["vaadin-accordion", "(", ")"]],
      ["app-layout", ["vaadin-app-layout", "(", ")"]],
      ["form-layout", ["vaadin-form-layout", "(", ")"]],
      ["form-item", ["vaadin-form-item", "(", ")"]],
      [
        "horizontal-layout",
        [
          "vaadin-horizontal-layout",
          "(",
          "span",
          "(",
          "textContent",
          "Placeholder 1",
          "=",
          ")",
          "span",
          "(",
          "textContent",
          "Placeholder 2",
          "=",
          ")",
          ")"
        ]
      ],
      [
        "vertical-layout",
        [
          "vaadin-vertical-layout",
          "(",
          "span",
          "(",
          "textContent",
          "Placeholder 1",
          "=",
          ")",
          "span",
          "(",
          "textContent",
          "Placeholder 2",
          "=",
          ")",
          ")"
        ]
      ],
      [
        "split-layout horizontal",
        [
          "vaadin-split-layout",
          "(",
          "span",
          "(",
          "textContent",
          "Placeholder 1",
          "=",
          ")",
          "span",
          "(",
          "textContent",
          "Placeholder 2",
          "=",
          ")",
          ")"
        ],
        "split-layout vertical",
        [
          "vaadin-split-layout",
          "(",
          "orientation",
          "vertical",
          "=",
          "span",
          "(",
          "textContent",
          "Placeholder 1",
          "=",
          ")",
          "span",
          "(",
          "textContent",
          "Placeholder 2",
          "=",
          ")",
          ")"
        ]
      ]
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
