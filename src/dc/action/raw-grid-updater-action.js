// Grid updater action that reacts to variable changes and updates a specified
// grid with the variable values. Currently just flat arrays are supported
import {
  createPropertyEditor,
  createIdSelectForTag,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  const props = { gridId: "", varName: "", path: "" };

  const generateRestCall = ({ gridId, varName, path }) => {
    rect.props.textContent = `(function () {
        window.variableListeners['${varName}'].addListener(items => {
            const grid = document.getElementById('${gridId}');
            grid.items = items;
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
  //property("Grid id ", "gridId");
  table.appendChild(
    createIdSelectForTag("Grid id", "vaadin-grid", DCAPI, event => {
      props["gridId"] = event.target.value;
    })
  );
  property("Variable name", "varName");

  el.appendChild(table);
};

export const rawGridUpdaterAction = {
  name: "raw-grid-updater-action",
  displayname: "Raw Grid updater",
  fn: fn
};
