/**
 *
 * @param {*} bean A Java bean. The getX and isX methods with their return types are
 * used to gerate a crud view.
 */

const FIELD_TYPES = {
  String: "vaadin-text-field",
  Boolean: "vaadin-checkbox",
  Integer: "vaadin-number-field",
  Long: "vaadin-number-field",
};
export const generateCrudFromBean = (bean) => {
  const matcher = /([A-Z]\S*)\s(get|is)(\S*)\(/g;
  const matches = bean.matchAll(matcher);
  let fields = [];
  let gridColumns = "";
  let paths = [];

  for (let match of matches) {
    let fieldType = FIELD_TYPES[match[1]] || "vaadin-text-field";

    fields = fields.concat(fieldType, "(", "label", match[3], "=", ")");

    gridColumns =
      gridColumns +
      `{\"name\": \"${match[3]}\", \"path\": \"${match[3].toLowerCase()}\"},`;
    paths.push(match[3].toLowerCase());
  }

  let items = "";
  for (let i = 0; i < 100; i++) {
    let item = "{";
    for (let path of paths) {
      item = item + `"${path}": "aaa",`;
    }
    items = items + item.substring(0, item.length - 1) + "},";
  }

  return [
    "vaadin-split-layout",
    "(",
    "vaadin-vertical-layout",
    "(",
    "style",
    "width:75%",
    "=",
  ]
    .concat([
      "unide-grid",
      "(",
      "style",
      "width:100%;height:100%",
      "=",
      "columnCaptions",
      "[" + gridColumns.substring(0, gridColumns.length - 1) + "]",
      "=",
      "items",
      "[" + items.substring(0, items.length - 1) + "]",
      "=",
      ")",
    ])

    .concat([
      ")",
      "vaadin-form-layout",
      "(",
      "theme",
      "margin",
      "=",
      "style",
      "width:25%",
      "=",
    ])
    .concat(fields)
    .concat([
      "vaadin-horizontal-layout",
      "(",
      "theme",
      "spacing",
      "=",
      "vaadin-button",
      "(",
      "textContent",
      "Cancel",
      "=",
      "theme",
      "primary",
      "=",
      ")",
      "vaadin-button",
      "(",
      "textContent",
      "Save",
      "=",
      "theme",
      "primary",
      "=",
      ")",
      ")",
    ])
    .concat(")", ")");
};
