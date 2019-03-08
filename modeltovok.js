/**
 *  Exporter from model to LitElement
 */
import flowImports from "./flow_imports.js";

export let exportToVoK = designs => {
  let zip = new JSZip();
  let keys = Object.keys(designs);
  let litElements = [];
  for (let i in keys) {
    let key = keys[i];
    zip.file(key + ".kt", modelToFlow(key, designs[key]));
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "vaadin-on-kotlin-designs.zip");
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

export let modelToVoK = (tagName, code) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  importedTags.add("div");
  let stack = [];
  let tree = [];
  let tagTree = [];
  let variableCount = 0;
  let variableStack = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentVar = "this";

  let result = `class ${pascalCaseName} extends Div {
       public ${pascalCaseName}() {\``;
  code.forEach((str, index) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(":
        currentTag = stack.pop();
        let elementClass = flowImports[currentTag]
          ? flowImports[currentTag].name
          : kebabToPascalCase(currentTag);

        //Create an element in the DOM
        let old = current;
        tree.push(current);
        current = document.createElement(currentTag);
        old.appendChild(current);

        let newVar = "el" + variableCount;
        variableCount++;

        result += `${elementClass} ${newVar} = new ${elementClass}();
        ${currentVar}.addComponent(${newVar});\n`;
        variableStack.push(currentVar);
        currentVar = newVar;

        if (currentTag in flowImports) {
          importedTags.add(currentTag);
        }
        break;
      case ")":
        current = tree.pop();
        currentVar = variableStack.pop();
        break;
      case "=":
        let tos = stack.pop();
        let nos = stack.pop();
        if (!nos || !tos) {
          return;
        }
        if (nos in current) {
          try {
            let json = JSON.parse(tos);
            current[nos] = json;
            result = result.concat(
              `${currentVar}.setProperty("${nos}","${tos}");\n`
            );
            //            result = result.concat(` .${nos}=\$\{"{JSON.parse(tos)}"\}`);
          } catch (e) {
            current[nos] = tos;
            result = result.concat(
              `${currentVar}.setProperty("${nos}","${tos}");\n`
            );
          }
        } else {
          result = result.concat(
            `${currentVar}.setAttribute("${nos}","${tos}");\n`
          );
        }
        break;
      default:
        stack.push(trimmed);
    }
  });

  let importStrings = "";

  importedTags.forEach(tag => {
    importStrings = importStrings.concat(`${flowImports[tag].import}\n`);
  });

  return `${importStrings}
          ${result}\`
      }
    }
  `;
};
