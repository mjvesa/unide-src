// Grid updater action that reacts to variable changes and updates a specified
// grid with the variable values. Currently just flat arrays are supported
import {
  createPropertyEditor,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  const props = { gridId: "", varName: "", path: "" };

  const generateRestCall = ({ gridId, varName, path }) => {
    rect.props.textContent = `(function () {
        window.variableListeners['${varName}'].addListener(items => {
            const grid = document.getElementById('${gridId}');
            const pathedItems = [];
            items.forEach(item => {
                pathedItems.push({'${path}':item});
            });
            grid.items = pathedItems;
        });
    })();`;
  };

  const updateScript = () => {
    generateRestCall(props);
    DCAPI.repaint();
    event.stopPropagation();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  const property = (caption, id) => {
    table.appendChild(
      createPropertyEditor(caption, event => {
        props[id] = event.target.value;
        updateScript();
      })
    );
  };
  property("Grid id ", "gridId");
  property("Variable name", "varName");
  property("Path", "path");

  el.appendChild(table);
};

export const gridUpdaterAction = {
  name: "grid-updater-action",
  displayname: "Grid updater",
  fn: fn
};
