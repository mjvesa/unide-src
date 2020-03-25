import {
  createPropertyEditor,
  createPropertySelect
} from "../dc-editor-fields";

const fn = (rect, DCAPI) => {
  let clickId, tableId;
  const columns = [];

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

  const createGridColumnEditor = (table, index) => {
    const tr = document.createElement("tr");
    columns[index] = {};
    addColumnField(tr, "Field Id", event => {
      columns[index].fieldId = event.target.value;
      generateCode();
    });
    addColumnField(tr, "Column path", event => {
      columns[index].path = event.target.value;
      generateCode();
    });

    const button = document.createElement("button");
    button.textContent = "delete";
    button.onclick = event => {
      delete columns[index];
      table.removeChild(tr);
      event.stopPropagation();
    };
    tr.appendChild(button);

    table.appendChild(tr);
  };

  const generateFieldCreation = () => {
    let listeners = "";
    columns.forEach(column => {
      console.log("here we gooo " + column);
      listeners =
        listeners +
        `field = document.getElementById('${column.fieldId}');
         item['${column.path}'] = field.value;
         `;
    });
    return listeners;
  };

  const generateCode = () => {
    rect.props.textContent = `(function () {
        const el = document.getElementById('${clickId}');
        el.onclick = event => {
            const table = document.getElementById('${tableId}');
            const items = table.items instanceof Array ? table.items.slice() : []; 
            let field;
            const item = {};
            ${generateFieldCreation()}
            items.push(item);
            table.items = items;
            table.notifyResize();
        }
      })();`;
    DCAPI.repaint();
  };
  const el = rect.el;
  el.textContent = "";
  const table = document.createElement("table");
  table.appendChild(
    createPropertyEditor("Click source ID", event => {
      clickId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );
  table.appendChild(
    createPropertyEditor("Table ID", event => {
      tableId = event.target.value;
      generateCode();
      event.stopPropagation();
    })
  );

  el.appendChild(table);

  const columnEditorTable = document.createElement("table");
  let columnEditorCount = 0;

  const button = document.createElement("button");
  button.textContent = "add field";
  button.onmousedown = event => {
    event.stopPropagation();
  };

  button.onclick = event => {
    createGridColumnEditor(columnEditorTable, columnEditorCount);
    columnEditorCount++;
    event.stopPropagation();
  };
  el.appendChild(button);
  el.appendChild(columnEditorTable);
};
export const gridNewItemEditor = {
  name: "grid-new-item-editor",
  displayname: "Grid new item",
  fn: fn
};
