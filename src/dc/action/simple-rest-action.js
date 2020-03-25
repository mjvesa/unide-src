// An action that loads data from a REST endpoint. It is assumed that a simple array is returned
// That is placed into specific items
import {
  createPropertyEditor,
  createPropertySelect,
  createIdSelect,
  findAllIds
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  // Create a textfield and load JSON from it when a specified element is clicked.
  const props = { clickSourceId: "", varName: "", restUrl: "" };

  const generateRestCall = ({ clickSourceId, varName, restUrl }) => {
    rect.props.textContent = `(function () {
    let el = document.getElementById('${clickSourceId}');
    el.onclick = () => {
      fetch('${restUrl}')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        window.variableListeners['${varName}'].setValue(data);
      });
    }})();`;
  };

  const updateScript = () => {
    generateRestCall(props);
    DCAPI.repaint();
    event.stopPropagation();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");

  const property = (caption, id, length) => {
    table.appendChild(
      createPropertyEditor(
        caption,
        event => {
          props[id] = event.target.value;
          updateScript();
        },
        length
      )
    );
  };

  table.appendChild(
    createIdSelect("Click source Id", event => {
      props["clickSourceId"] = event.target.value;
    })
  );
  property("Variable", "varName");
  property("REST URL", "restUrl", "10rem");

  el.appendChild(table);
};

export const simpleRestAction = {
  displayname: "Simple REST action",
  name: "simple-rest-action",
  fn: fn
};
