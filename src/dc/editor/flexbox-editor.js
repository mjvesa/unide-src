import {
  createPropertyEditor,
  createPropertySelect,
  fieldsFromProperties
} from "../dc-editor-fields";

const fn = (el, DCAPI) => {
  const flexboxProps = [
    //    ["flex"], "This is the shorthand for flex-grow, flex-shrink and flex-basis combined.", do we need it?
    ["flexGrow", "number"],
    ["flexShrink", "number"],
    ["flexBasis", "size"],
    ["flexFlow", "finite", ["flex-direction", "flex-wrap"]],
    [
      "flexDirection",
      "finite",
      ["row", "row-reverse", "column", "column-reverse"]
    ],
    ["flexWrap", "finite", ["nowrap", "wrap", "wrap-reverse"]],
    ["justifyContent"],
    [
      "alignItems",
      "finite",
      [
        "stretch",
        "center",
        "flex-start",
        "flex-end",
        "baseline",
        "initial",
        "inherit"
      ]
    ],
    [
      "alignContent",
      "finite",
      [
        "stretch",
        "center",
        "flex-start",
        "flex-end",
        "space-between",
        "space-around",
        "initial",
        "inherit"
      ]
    ],
    ,
    [
      "alignSelf",
      "finite",
      ["auto", "flex-start", "flex-end", "center", "baseline", "stretch"]
    ],
    ["order", "number"]
  ];

  el.textContent = "";
  const table = document.createElement("table");
  DCAPI.style.display = "flex";
  fieldsFromProperties(flexboxProps, table, DCAPI);
  el.appendChild(table);
};

export const flexboxEditor = {
  name: "flexbox-editor",
  displayname: "Flexbox editor",
  fn: fn
};
