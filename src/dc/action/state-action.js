//
//  State is represented by a set of state variables that are sources of values. Listeners
//  can be added to the variables and those will be called when the value changes. No
//  values are stored anywhere in the variable at the moment, the are just propagated.
//

import {
  createPropertyEditor,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  const stateVariables = [];

  const addColumnField = (row, caption, listener) => {
    let captionTd = document.createElement("td");
    captionTd.textContent = caption;
    row.appendChild(captionTd);
    const inputTd = document.createElement("td");
    const input = document.createElement("input");
    input.onmousedown = event => {
      event.stopPropagation();
    };
    input.style.width = "6rem";
    input.type = "text";
    input.oninput = listener;
    inputTd.appendChild(input);
    row.appendChild(inputTd);
  };

  const createVariableEditor = (table, index) => {
    const tr = document.createElement("tr");
    addColumnField(tr, "Name", event => {
      stateVariables[index] = event.target.value;
      generateCode();
    });

    const button = document.createElement("button");
    button.textContent = "delete";
    button.onmousedown = event => {
      event.stopPropagation();
    };

    button.onclick = event => {
      delete stateVariables[index];
      table.removeChild(tr);
      event.stopPropagation();
    };
    tr.appendChild(button);

    table.appendChild(tr);
  };

  const generateVariableCreation = () => {
    let listeners = "";
    stateVariables.forEach(varName => {
      listeners =
        listeners +
        `window.variableListeners['${varName}']= createVariable([]);\n`;
    });
    return listeners;
  };

  const generateCode = () => {
    rect.props.textContent = `(function(){
        const createVariable = (init) => {
            const listeners = [];
            let currentValue = init;
            const listener = {};
            
            const fireListeners = () => {
                listeners.forEach(listener => {
                    listener(currentValue);
                });
            }

            listener.addListener = value => {
              listeners.push(value);
            }

            listener.setValue = value => {
              currentValue=value;
              fireListeners();
           }
          return listener;  
        }
        window.variableListeners = {};
        ${generateVariableCreation()}
      })();`;
    DCAPI.repaint();
  };
  const el = rect.el;
  el.textContent = "";
  const variableEditorTable = document.createElement("table");
  let variableEditorCount = 0;

  const button = document.createElement("button");
  button.textContent = "add variable";
  button.onmousedown = event => {
    event.stopPropagation();
  };

  button.onclick = event => {
    createVariableEditor(variableEditorTable, variableEditorCount);
    variableEditorCount++;
    event.stopPropagation();
  };
  el.appendChild(button);
  el.appendChild(variableEditorTable);
};

export const stateAction = {
  name: "state-action",
  displayname: "State",
  fn: fn
};
