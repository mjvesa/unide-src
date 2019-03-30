/**
 *  Exporter from model to VanillaJS
 */
import jsImports from "./js_imports.js";
import { getIndexHTML } from "./vanilla_index_html";
import { unideGrid } from "./unide-grid-import";

export let exportToVanilla = project => {
  let zip = new JSZip();
  let designs = project.designs;
  let keys = Object.keys(designs);
  for (let i in keys) {
    let key = keys[i];
    zip.file(key + ".js", modelToVanilla(key, designs[key].tree));
  }
  zip.file("package.json", packageJson);
  zip.file("index.html", getIndexHTML(keys));
  zip.file("unide-grid.js", unideGrid);

  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "js-designs.zip");
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

export let modelToVanilla = (tagName, design) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];

  let current = document.createElement("div");
  let currentTag = "";

  let varCount = 0;
  let currentVar = "shadow";
  let varStack = [];

  let result = "";
  design.tree.forEach(str => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(": {
        let old = current;
        tree.push(current);

        tagTree.push(currentTag);
        currentTag = stack.pop();
        if (currentTag in jsImports) {
          importedTags.add(currentTag);
        }

        current = document.createElement(currentTag);
        varStack.push(currentVar);
        let newVar = "el" + varCount;
        varCount++;
        result = result.concat(`const ${newVar} = document.createElement("${currentTag}");
          ${currentVar}.appendChild(${newVar});\n`);
        old.appendChild(current);
        currentVar = newVar;
        break;
      }
      case ")": {
        currentVar = varStack.pop();
        current = tree.pop();
        currentTag = tagTree.pop();
        break;
      }
      case "=": {
        let tos = stack.pop();
        let nos = stack.pop();
        if (!nos || !tos) {
          return;
        }

        if (nos == "targetRoute") {
          result = result.concat(
            ` ${currentVar}.onclick = event => {window.UniDe.route("${tos}")};\n`
          );
        } else if (nos in current) {
          try {
            JSON.parse(tos);
            result = result.concat(` ${currentVar}["${nos}"]=${tos};\n`);
          } catch (e) {
            result = result.concat(
              ` ${currentVar}["${nos}"]="${tos.replace(/\"/g, '\\"')}";\n`
            );
          }
        } else {
          result = result.concat(
            `${currentVar}.setAttribute("${nos}","${tos}");\n`
          );
        }
        break;
      }
      default:
        stack.push(trimmed);
    }
  });

  let importStrings = "";

  importedTags.forEach(tag => {
    importStrings = importStrings.concat(`${jsImports[tag]}\n`);
  });

  return prettier.format(
    `${importStrings}
   class ${pascalCaseName} extends HTMLElement {
    constructor() {
      super();
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement('style');
        style.textContent = \`${design.css}\`;
        shadow.appendChild(style);
        ${result}
      }
    }
    customElements.define("${tagName}", ${pascalCaseName});
  `,
    { parser: "babylon", plugins: prettierPlugins }
  );
};

const packageJson = `{
  "name": "vanilla",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "universal-router": "^8.1.0",
    "@vaadin/vaadin-core": "^13.0.1",
    "@vaadin/vaadin-grid": "^5.3.3",
    "@vaadin/vaadin-tabs": "^2.1.2"
  }
}`;
