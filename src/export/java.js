/**
 *  Exporter from model to Flow. Exports full project buildable with maven.
 */
import flowImports from "./flow_imports.js";

export const kebabToPascalCase = (str) => {
  const parts = str.split("-");
  let result = "";
  for (const i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

const kebabToCamelCase = (str) => {
  const pascal = kebabToPascalCase(str).replace("/Vaadin/g", "");
  return pascal.charAt(0).toLowerCase() + pascal.substring(1);
};

export const packageToFolder = (packageName) => {
  return "src/main/java/" + packageName.replace(/\./g, "/") + "/";
};

export const exportToJava = (project) => {
  JSZipUtils.getBinaryContent("templates/vaadin-java-project.zip", function (
    err,
    data
  ) {
    if (err) {
      throw err; // or handle err
    }

    JSZip.loadAsync(data).then(function (zip) {
      const designs = project.designs;
      const keys = Object.keys(designs);
      const packageName = project.settings.packageName;
      const appLayoutClass = project.settings.useAppLayout
        ? project.settings.appLayoutClass
        : "";
      const javaFolder = packageToFolder(packageName);
      for (const i in keys) {
        const key = keys[i];
        const pascalCaseName = kebabToPascalCase(key);
        zip.file(
          "src/main/resources/unide_state.json",
          JSON.stringify(project)
        );
        zip.file(
          javaFolder + pascalCaseName + ".java",
          modelToJava(
            pascalCaseName,
            key,
            packageName,
            appLayoutClass,
            designs[key].tree
          )
        );
        zip.file(
          javaFolder + pascalCaseName + "Aux.java",
          generateAuxClass(pascalCaseName, packageName)
        );
        zip.file(`frontend/styles/${key}.css`, designs[key].css);
      }

      zip.file(
        javaFolder + "UnideSplitLayout.java",
        unideSplitLayout(packageName)
      );

      zip.file(javaFolder + "Application.java", application(packageName));
      zip.file(javaFolder + "AppShell.java", appShell(packageName));

      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "unide-java-designs.zip");
      });
    });
  });
};

export const generateAuxClass = (pascalCaseName, packageName) => {
  return `package ${packageName};
  public class ${pascalCaseName}Aux {
    public ${pascalCaseName}Aux(${pascalCaseName} design) {
    }
  }`;
};

const classForTag = (tag) => {
  return flowImports[tag] ? flowImports[tag].name : kebabToPascalCase(tag);
};

export const modelToJava = (
  pascalCaseName,
  tag,
  packageName,
  appLayoutClass,
  code
) => {
  const singleIndent = "    ";
  const doubleIndent = singleIndent + singleIndent;
  const importedTags = new Set();
  let internalClasses = "";
  const stack = [];
  const tree = [];
  const variableStack = [];
  const varNames = {};
  let fields = "";

  let variableCount = 0;

  let current = document.createElement("div");
  let currentTag = "";
  let currentVar = "this";
  let currentVarDefinition = "";

  importedTags.add("div");

  let result = "";
  code.forEach((str) => {
    const trimmed = str.trim();
    switch (trimmed) {
      case "(": {
        currentTag = stack.pop();
        const elementClass = classForTag(currentTag);

        //Create an element in the DOM
        const old = current;
        tree.push(current);
        current = document.createElement(currentTag);
        old.appendChild(current);

        const varName = "_" + kebabToCamelCase(elementClass);
        let varCount = varNames[varName] || 0;
        varCount++;
        varNames[varName] = varCount;
        const newVar = varName + (varCount === 1 ? "" : varCount);
        variableCount++;

        if (currentTag === "unide-grid") {
          currentVarDefinition = `${elementClass}<${pascalCaseName}GridType> ${newVar}`;
          result +=
            `${doubleIndent}${currentVarDefinition} = new ${elementClass}<>();\n` +
            `${doubleIndent}${currentVar}.add(${newVar});\n`;
        } else {
          currentVarDefinition = `${elementClass} ${newVar}`;
          result +=
            `${doubleIndent}${currentVarDefinition} = new ${elementClass}();\n` +
            `${doubleIndent}${currentVar}.add(${newVar});\n`;
        }
        variableStack.push(currentVar);
        currentVar = newVar;

        if (currentTag in flowImports) {
          importedTags.add(currentTag);
        }
        break;
      }
      case ")":
        current = tree.pop();
        currentVar = variableStack.pop();
        break;
      case "=": {
        const tos = stack.pop();
        const nos = stack.pop();
        if (!nos || !tos) {
          return;
        }

        if (currentTag === "unide-grid") {
          if (nos === "items") {
            const obj = JSON.parse(tos);
            let gridItems =
              `${doubleIndent}ArrayList<${pascalCaseName}GridType> items = new ArrayList<>();\n` +
              `${doubleIndent}${pascalCaseName}GridType item;\n`;
            obj.forEach((values) => {
              let item = `${doubleIndent}item = new ${pascalCaseName}GridType();\n`;
              Object.keys(values).forEach((key) => {
                item = item.concat(
                  `${doubleIndent}item.set${key}("${values[key]}");\n`
                );
              });
              item = item.concat(`${doubleIndent}items.add(item);\n`);
              gridItems = gridItems.concat(item);
            });
            result = result
              .concat(gridItems)
              .concat(`${doubleIndent}${currentVar}.setItems(items);\n`);
            return;
          } else if (nos === "columnCaptions") {
            const obj = JSON.parse(tos);
            let methods = "";
            let fields = "";
            let creation = "";
            obj.forEach((pair) => {
              creation = creation.concat(
                `${doubleIndent}${currentVar}.addColumn(${pascalCaseName}GridType::get${pair.path}).setHeader("${pair.name}");\n`
              );
              fields = fields.concat(`private String ${pair.path};\n`);
              methods = methods.concat(`public String get${pair.path}() {
                  return this.${pair.path};
              }
              public void set${pair.path}(String value) {
                this.${pair.path}=value;
              }
                `);
            });

            internalClasses =
              internalClasses +
              `${singleIndent}public static class ${pascalCaseName}GridType {
              ${fields}
              ${methods}
            }`;
            result = result.concat(creation);
            return;
          }
        }

        if (nos === "targetRoute") {
          result = result.concat(
            `${doubleIndent}${currentVar}.getElement().addEventListener("click", e-> {\n` +
              `${doubleIndent}${singleIndent}${currentVar}.getUI().ifPresent(ui -> ui.navigate("${kebabToPascalCase(
                tos
              )}"))\n;` +
              `${doubleIndent}});`
          );
        } else if (nos === "fieldName") {
          const fieldName = tos;
          result = result.replace(currentVarDefinition, fieldName);
          const re = new RegExp(currentVar, "g");
          result = result.replace(re, fieldName);
          fields =
            fields +
            `${singleIndent}${
              currentVarDefinition.split(" ")[0]
            } ${fieldName};\n`;
          currentVar = fieldName;
        } else if (nos in current) {
          try {
            JSON.parse(tos);
            if (nos === "textContent") {
              result = result.concat(
                `        ${currentVar}.getElement().setText("${tos}");\n`
              );
            } else {
              result = result.concat(
                `${doubleIndent}${currentVar}.getElement().setProperty("${nos}","${tos.replace(
                  /"/g,
                  "'"
                )}");\n`
              );
            }
          } catch (e) {
            if (nos === "textContent") {
              result = result.concat(
                `${doubleIndent}${currentVar}.getElement().setText("${tos.replace(
                  /"/g,
                  '\\"'
                )}");\n`
              );
            } else {
              result = result.concat(
                `${doubleIndent}${currentVar}.getElement().setProperty("${nos}","${tos}");\n`
              );
            }
          }
        } else {
          result = result.concat(
            `${doubleIndent}${currentVar}.getElement().setAttribute("${nos}","${tos}");\n`
          );
        }
        break;
      }
      default:
        stack.push(trimmed);
    }
  });

  let importStrings = "";

  importedTags.forEach((tag) => {
    importStrings = importStrings.concat(`${flowImports[tag].import}\n`);
  });

  return `package ${packageName};
  ${importStrings}
  import java.util.ArrayList;
  import com.vaadin.flow.component.dependency.CssImport;
  import com.vaadin.flow.router.PageTitle;
  import com.vaadin.flow.router.Route;
  @Route("${pascalCaseName}"${
    !appLayoutClass | (appLayoutClass === "")
      ? ""
      : ", layout=" + appLayoutClass + ".class"
  })
  @CssImport("styles/${tag}.css")
  public class ${pascalCaseName} extends Div {
      ${fields}
      ${internalClasses}
      public ${pascalCaseName}() {
          ${result}
          new ${pascalCaseName}Aux(this);
      }
    }
  `;
};

const unideSplitLayout = (packageName) => {
  return `package ${packageName};
import com.vaadin.flow.component.splitlayout.SplitLayout;
import com.vaadin.flow.component.Component;

public class UnideSplitLayout extends SplitLayout {

  private boolean firstAdded = false;
  public void add(Component component) {
    if (!firstAdded) {
      addToPrimary(component);
      firstAdded = true;
    } else {
      addToSecondary(component);
    }
  }
}
`;
};

const appShell = (packageName) => `package ${packageName};

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.server.PWA;

/**
 * Use the @PWA annotation make the application installable on phones, tablets
 * and some desktop browsers.
 */
@PWA(name = "unide app", shortName = "unide app")
public class AppShell implements AppShellConfigurator {
}
`;

const application = (packageName) => `package ${packageName};

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * The entry point of the Spring Boot application.
 */
@SpringBootApplication
public class Application extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
`;
