// Takes one or two fields and a value. Once there is an event on one field, it
// takes the value of another field, or the same field, and
// sets it as the specified value.
import { createPropertyEditor, createIdSelect } from "../dc-editor-fields-new";

const fn = (rect, DCAPI) => {
  const fields = {
    varName: "",
    eventSourceElementId: "",
    valueElementId: "",
    eventName: ""
  };
  const generateCode = () => {
    rect.props.textContent = `(function () {
        const el = document.getElementById('${fields.eventSourceElementId}')
        el.addEventListener('${fields.eventName}', event => {
            const valueEl = document.getElementById('${fields.valueElementId}')
            window.variableListeners['${fields.varName}'].setValue(valueEl.value);
        });
      })();`;
    DCAPI.repaint();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Variable", "varName", fields, DCAPI, generateCode())
  );

  table.appendChild(
    createIdSelect(
      "Event source element Id",
      "eventSourceElementId",
      fields,
      DCAPI,
      generateCode
    )
  );

  table.appendChild(
    createIdSelect(
      "Value element Id",
      "valueElementId",
      fields,
      DCAPI,
      generateCode
    )
  );

  table.appendChild(
    createPropertyEditor("Event", eventName, fields, DCAPI, generateCode)
  );

  el.appendChild(table);
};

export const eventToValueAction = {
  name: "event-to-value-action",
  displayname: "Event to value",
  fn: fn
};
