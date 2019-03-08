/**
 *  Exporter from model to LitElement
 */
import flowImports from "./flow_imports.js";

let kebabToPascalCase = str => {
  let parts = str.split("-");
  let result = "";
  for (let i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

export let exportToFlow = designs => {
  let zip = new JSZip();
  let keys = Object.keys(designs);
  let litElements = [];
  for (let i in keys) {
    let key = keys[i];
    let pascalCaseName = kebabToPascalCase(key);
    zip.file(
      pascalCaseName + ".java",
      modelToFlow(pascalCaseName, designs[key])
    );
  }
  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "flow-designs.zip");
  });
};

export let modelToFlow = (pascalCaseName, code) => {
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];
  let variableCount = 0;
  let variableStack = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentVar = "this";

  importedTags.add("div");

  let result = `import com.vaadin.flow.router.PageTitle;
  import com.vaadin.flow.router.Route;
  import com.vaadin.samples.MainLayout;
  
  @Route(value = "${pascalCaseName}", layout = MainLayout.class)
  @PageTitle("${pascalCaseName}")
  public class ${pascalCaseName} extends Div {
    public static final String VIEW_NAME = "${pascalCaseName}";
    public ${pascalCaseName}() {`;
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
        ${currentVar}.add(${newVar});\n`;
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
            if (nos === "textContent") {
              result = result.concat(
                `${currentVar}.getElement().setText("${tos}");\n`
              );
            } else {
              result = result.concat(
                `${currentVar}.getElement().setProperty("${nos}","${tos}");\n`
              );
            }
            //            result = result.concat(` .${nos}=\$\{"{JSON.parse(tos)}"\}`);
          } catch (e) {
            current[nos] = tos;
            if (nos === "textContent") {
              result = result.concat(
                `${currentVar}.getElement().setText("${tos}");\n`
              );
            } else {
              result = result.concat(
                `${currentVar}.getElement().setProperty("${nos}","${tos}");\n`
              );
            }
          }
        } else {
          result = result.concat(
            `${currentVar}.getElement().setAttribute("${nos}","${tos}");\n`
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
          ${result}
      }
    }
  `;
};
