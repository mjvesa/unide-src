/**
 *  Exporter from model to React
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

export let exportToReact = project => {
  let zip = new JSZip();
  let designs = project.designs;
  let keys = Object.keys(designs);
  for (let i in keys) {
    let key = keys[i];
    zip.file(
      kebabToPascalCase(key) + ".js",
      modelToReact(key, designs[key].tree)
    );
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "react-designs.zip");
  });
};

export let modelToReact = (tagName, code) => {
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
        if (nos in current) {
          current[nos] = tos;
          if (nos === "style") {
            result = result.concat(
              ` ${nos}={{${tos
                .replace(/;/g, '",')
                .replace(/-([a-z])/g, function(g) {
                  return g[1].toUpperCase();
                })
                .replace(/:/g, ':"')
                .concat('"')}}}`
            );
          } else {
            result = result.concat(` ${nos}="${tos}"`);
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

  return ` 
  import React from 'react';
  ${importStrings}
  function  ${pascalCaseName}() {
    return ${result};
  }        
  export default ${pascalCaseName};`;
};