/**
 *  Exporter from model to LitElement
 */
import jsImports from "./js_imports.js";

export let exportToVanilla = designs => {
  let zip = new JSZip();
  let keys = Object.keys(designs);
  let litElements = [];
  for (let i in keys) {
    let key = keys[i];
    zip.file(key + ".js", modelToLitElement(key, designs[key]));
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "lit-element-designs.zip");
  });
};

let kebabToPascalCase = str => {
  let parts = str.split("-");
  let result = "";
  for (let i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

export let modelToVanilla = (tagName, code) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentClosed = true;

  let elementStack = [];
  let currentElement = "this";

  let result = `class ${pascalCaseName} extends HTMLElement {
       _render() {\``;
  code.forEach((str, index) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(":
        if (!currentClosed) {
          result = result.concat(">\n");
          currentClosed = true;
        }
        let old = current;
        tree.push(current);

        tagTree.push(currentTag);
        currentTag = stack.pop();
        if (currentTag in jsImports) {
          importedTags.add(currentTag);
        }

        current = document.createElement(currentTag);
        result = result.concat("<" + currentTag);
        old.appendChild(current);
        currentClosed = false;
        break;
      case ")":
        if (!currentClosed) {
          result = result.concat(">\n");
          currentClosed = true;
        }
        current = tree.pop();
        result = result.concat(`</${currentTag}>\n`);
        currentTag = tagTree.pop();
        break;
      case "=":
        let tos = stack.pop();
        let nos = stack.pop();
        if (!nos || !tos) {
          return;
        }
        if (nos in current) {
          current[nos] = json;
          result = result.concat(` .${nos}=\$\{"${tos}"\}`);
        } else {
          result = result.concat(` ${nos}="${tos}"`);
          current.setAttribute(nos, tos);
        }
        break;
      default:
        stack.push(trimmed);
    }
  });

  let importStrings = "";

  importedTags.forEach(tag => {
    importStrings = importStrings.concat(`${jsImports[tag]}\n`);
  });

  return `${importStrings}
          ${result}\`
      }
    }
    customElements.define(${tagName}, ${pascalCaseName});
  `;
};
