import { createPropertyEditor, createIdSelect } from "../dc-editor-fields-new";

const fn = (rect, DCAPI) => {
  const el = rect.el;
  const props = rect.editorProps;
  const generateCode = () => {
    rect.props.textContent = `(function () {
        window.variableListeners['${props.varName}'].addListener( value => {
          const dataEl = document.createElement('${props.elementTag}');
          dataEl.textContent = value;
          document.getElementById('${props.targetId}').appendChild(dataEl);
        });
      })();`;
    DCAPI.repaint();
  };
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Variable", "varNamr", props, DCAPI, event => {
      generateCode();
    })
  );
  table.appendChild(
    createPropertyEditor(
      "Target element ID",
      "targetId",
      props,
      DCAPI,
      event => {
        generateCode();
      }
    )
  );

  table.appendChild(
    createPropertyEditor("Tag", "elementTag", props, DCAPI, event => {
      generateCode();
    })
  );
  el.appendChild(table);
};

export const elementAppenderAction = {
  name: "element-appender-action",
  displayname: "Element appender",
  fn: fn
};
