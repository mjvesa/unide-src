import {
  createPropertyEditor,
  createPropertyEditorTextArea
} from "../dc-editor-fields";

const fn = (el, DCAPI) => {
  el.textContent = "";

  const attribute = (id, caption, table) => {
    table.appendChild(
      createPropertyEditor(caption, DCAPI.props[id], event => {
        DCAPI.props[id] = event.target.value;
        DCAPI.repaint();
        event.stopPropagation();
      })
    );
  };

  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditorTextArea("Text", DCAPI.props["textContent"], event => {
      DCAPI.props["textContent"] = event.target.value;
      DCAPI.repaint();
      event.stopPropagation();
    })
  );
  //attribute("textContent", "Text", table);
  attribute("id", "Id", table);
  attribute("class", "class", table);
  attribute("fieldName", "Field name", table);

  el.appendChild(table);
};

export const defaultEditor = {
  name: "default-editor",
  displayname: "Default editor",
  fn: fn
};
