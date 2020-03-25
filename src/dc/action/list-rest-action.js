// An action that loads data from a REST endpoint using a list of ids.
import {
  createPropertyEditor,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  const props = {
    sourceVarName: "",
    targetVarName: "",
    itemMaxCount: "",
    restUrl: "",
    parameterName: ""
  };

  const generateRestCall = ({
    sourceVarName,
    targetVarName,
    itemMaxCount,
    restUrl,
    parameterName
  }) => {
    rect.props.textContent = `(function () {
      window.variableListeners['${sourceVarName}'].addListener(value => {
        const results = [];
        const items = value.slice(0, ${itemMaxCount});
        debugger;
        Promise.all(items.map(item =>  {
          return fetch('${restUrl}'.replace("{${parameterName}}", item))
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            results.push(data);
          });
        })).then( () => {
          console.log(results);
          window.variableListeners['${targetVarName}'].setValue(results);
        });
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
  property("Source Variable", "sourceVarName");
  property("Target Variable", "targetVarName");
  property("Item max count", "itemMaxCount");
  property("REST URL", "restUrl", "10rem");
  property("Parameter name", "parameterName");

  el.appendChild(table);
};

export const listRestAction = {
  name: "list-rest-action",
  displayname: "List REST action",
  fn: fn
};
