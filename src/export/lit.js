/**
 *  Exporter from model to LitElement
 */
import jsImports from "./js_imports.js";
import { getIndexHTML } from "./vanilla_index_html";

export let exportToLitElement = project => {
  let zip = new JSZip();
  let designs = project.designs;
  let keys = Object.keys(designs);
  let litElements = [];
  for (let i in keys) {
    let key = keys[i];
    zip.file(key + ".js", modelToLitElement(key, designs[key].tree));
  }

  zip.file("package.json", packageJson);
  zip.file("index.html", getIndexHTML(keys));

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

export let modelToLitElement = (tagName, code) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentClosed = true;

  let result = "";
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

        if (nos == "targetRoute") {
          result = result.concat(
            `  @click = \${event => {
              window.UniDe.route("${tos}");
            }}\n`
          );
        } else if (nos in current) {
          try {
            let json = JSON.parse(tos);
            current[nos] = json;
            result = result.concat(` .${nos}=\${${tos}}`);
          } catch (e) {
            current[nos] = tos;
            result = result.concat(` .${nos}=\$\{"${tos}"\}`);
          }
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

  return prettier.format(
    `import { LitElement, html } from 'lit-element';
    ${importStrings}
    class ${pascalCaseName} extends LitElement {
      render() {
        return html\`${result}\`;
      }
    }
    customElements.define("${tagName}", ${pascalCaseName});`,
    { parser: "babel", plugins: prettierPlugins }
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
    "@vaadin/vaadin-tabs": "^2.1.2",
    "lit-element": "^2.0.1"
  }
}`;
