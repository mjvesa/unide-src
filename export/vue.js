/**
 *  Exporter from model to Svelte
 */

import jsImports from "./js_imports.js";

let kebabToPascalCase = str => {
  let parts = str.split("-");
  let result = "";
  for (let i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

export let exportToVue = designs => {
  let zip = new JSZip();
  let keys = Object.keys(designs);
  let litElements = [];
  for (let i in keys) {
    let key = keys[i];
    zip.file(kebabToPascalCase(key) + ".vue", modelToVue(key, designs[key]));
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "vue-designs.zip");
  });
};

export let modelToVue = (tagName, code) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentClosed = true;

  let hasTextContent = false;
  let textContent = "";

  // Property name generation
  let props = {};
  let propCount = 0;

  let result = "";

  code.forEach((str, index) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(":
        if (!currentClosed) {
          result = result.concat(`>${hasTextContent ? textContent : ""}\n`);
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
        hasTextContent = false;
        currentClosed = false;
        break;
      case ")":
        if (!currentClosed) {
          result = result.concat(`>${hasTextContent ? textContent : ""}\n`);
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
        if (nos in current && nos !== "style") {
          if (nos === "textContent") {
            hasTextContent = true;
            textContent = tos;
          } else {
            let propName = "prop" + propCount;
            propCount++;
            props[propName] = tos;
            result = result.concat(` :${nos}.prop={${propName}}`);
          }
        } else {
          result = result.concat(` ${nos}="${tos}"`);
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

  let propString =
    propCount > 0 ? `,data: () => {return ${JSON.stringify(props)}}` : "";

  return ` 
  <template>
  ${result}
  </template>
  <script>
  ${importStrings}
  export default {
    name: '${pascalCaseName}'
    ${propString}
  }
  </script>`;
};
