/**
 *  Exporter from model to Flow. Exports full project buildable with maven.
 */
import flowImports from "./flow_imports.js";

export const kebabToPascalCase = str => {
  const parts = str.split("-");
  let result = "";
  for (const i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

const kebabToCamelCase = str => {
  const pascal = kebabToPascalCase(str).replace("/Vaadin/g", "");
  return pascal.charAt(0).toLowerCase() + pascal.substring(1);
};

export const packageToFolder = packageName => {
  return "src/main/java/" + packageName.replace(/\./g, "/") + "/";
};

export const exportToJava = project => {
  const zip = new JSZip();
  const designs = project.designs;
  const keys = Object.keys(designs);
  const packageName = project.settings.packageName;
  const javaFolder = packageToFolder(packageName);
  for (const i in keys) {
    const key = keys[i];
    const pascalCaseName = kebabToPascalCase(key);
    zip.file("src/main/resources/unide_state.json", JSON.stringify(project));
    zip.file(
      javaFolder + pascalCaseName + ".java",
      modelToJava(pascalCaseName, key, packageName, designs[key].tree)
    );
    zip.file(
      javaFolder + pascalCaseName + "Aux.java",
      generateAuxClass(pascalCaseName, packageName)
    );
    zip.file(`frontend/styles/${key}.css`, designs[key].css);
  }
  zip.file(javaFolder + "UnideSplitLayout.java", unideSplitLayout(packageName));
  zip.file("pom.xml", pomXML);

  zip.generateAsync({ type: "blob" }).then(content => {
    saveAs(content, "unide-java-designs.zip");
  });
};

const generateAuxClass = (pascalCaseName, packageName) => {
  return `package ${packageName};
  public class ${pascalCaseName}Aux {
    public ${pascalCaseName}Aux(${pascalCaseName} design) {
    }
  }`;
};

export const modelToJava = (pascalCaseName, tag, packageName, code) => {
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

  importedTags.add("div");

  let result = "";
  code.forEach(str => {
    const trimmed = str.trim();
    switch (trimmed) {
      case "(": {
        currentTag = stack.pop();
        const elementClass = flowImports[currentTag]
          ? flowImports[currentTag].name
          : kebabToPascalCase(currentTag);

        //Create an element in the DOM
        const old = current;
        tree.push(current);
        current = document.createElement(currentTag);
        old.appendChild(current);

        const varName = kebabToCamelCase(elementClass);
        let varCount = varNames[varName] || 0;
        varCount++;
        varNames[varName] = varCount;
        const newVar = varName + (varCount === 1 ? "" : varCount);
        variableCount++;

        if (currentTag === "unide-grid") {
          fields += `protected ${elementClass}<${pascalCaseName}GridType> ${newVar};\n`;
          result += `${newVar} = new ${elementClass}<>();
          ${currentVar}.add(${newVar});\n`;
        } else {
          fields += `protected ${elementClass} ${newVar};\n`;
          result += `${newVar} = new ${elementClass}();
          ${currentVar}.add(${newVar});\n`;
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
            let gridItems = ` ArrayList<${pascalCaseName}GridType> items = new ArrayList<>();
                              ${pascalCaseName}GridType item;\n`;
            obj.forEach(values => {
              let item = `item = new ${pascalCaseName}GridType();\n`;
              Object.keys(values).forEach(key => {
                item = item.concat(`item.set${key}("${values[key]}");`);
              });
              item = item.concat(`items.add(item);`);
              gridItems = gridItems.concat(item);
            });
            result = result
              .concat(gridItems)
              .concat(`${currentVar}.setItems(items);\n`);
            return;
          } else if (nos === "columnCaptions") {
            const obj = JSON.parse(tos);
            let methods = "";
            let fields = "";
            let creation = "";
            obj.forEach(pair => {
              creation = creation.concat(
                `${currentVar}.addColumn(${pascalCaseName}GridType::get${pair.path}).setHeader("${pair.name}");\n`
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
              `public static class ${pascalCaseName}GridType {
              ${fields}
              ${methods}
            }`;
            result = result.concat(creation);
            return;
          }
        }

        if (nos === "targetRoute") {
          result = result.concat(
            `${currentVar}.getElement().addEventListener("click", e-> {
              ${currentVar}.getUI().ifPresent(ui -> ui.navigate("${kebabToPascalCase(
              tos
            )}"));
       });`
          );
        } else if (nos in current) {
          try {
            JSON.parse(tos);
            if (nos === "textContent") {
              result = result.concat(
                `${currentVar}.getElement().setText("${tos}");\n`
              );
            } else {
              result = result.concat(
                `${currentVar}.getElement().setProperty("${nos}","${tos.replace(
                  /"/g,
                  "'"
                )}");\n`
              );
            }
          } catch (e) {
            if (nos === "textContent") {
              result = result.concat(
                `${currentVar}.getElement().setText("${tos.replace(
                  /"/g,
                  '\\"'
                )}");\n`
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
      }
      default:
        stack.push(trimmed);
    }
  });

  let importStrings = "";

  importedTags.forEach(tag => {
    importStrings = importStrings.concat(`${flowImports[tag].import}\n`);
  });

  return `package ${packageName};
  ${importStrings}
  import java.util.ArrayList;
  import com.vaadin.flow.component.dependency.CssImport;
  import com.vaadin.flow.router.PageTitle;
  import com.vaadin.flow.router.Route;
  @Route("${pascalCaseName}")
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

const unideSplitLayout = packageName => {
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

const pomXML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>unide.app</groupId>
    <artifactId>app</artifactId>
    <name>Project base for Vaadin Flow</name>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <failOnMissingWebXml>false</failOnMissingWebXml>
        
        <vaadin.version>14.0.7</vaadin.version>
    </properties>

    <repositories>
        <!-- Repository used by many Vaadin add-ons -->
        <repository>
                         <id>Vaadin Directory</id>
            <url>http://maven.vaadin.com/vaadin-addons</url>
        </repository>
    </repositories>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.vaadin</groupId>
                <artifactId>vaadin-bom</artifactId>
                <type>pom</type>
                <scope>import</scope>
                <version>\${vaadin.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>com.vaadin</groupId>
            <artifactId>vaadin-core</artifactId>
        </dependency>

        <!-- Added to provide logging output as Flow uses -->
        <!-- the unbound SLF4J no-operation (NOP) logger implementation -->
        <dependency>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-simple</artifactId>
        </dependency>

        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Jetty plugin for easy testing without a server -->
            <plugin>
                <groupId>org.eclipse.jetty</groupId>
                <artifactId>jetty-maven-plugin</artifactId>
                <version>9.4.11.v20180605</version>
                <configuration>
                    <scanIntervalSeconds>1</scanIntervalSeconds>
                </configuration>
            </plugin>
        </plugins>
    </build>

    <profiles>
        <profile>
            <!-- Production mode can be activated with either property or profile -->
            <id>production-mode</id>
            <activation>
                <property>
                    <name>vaadin.productionMode</name>
                </property>
            </activation>
            <properties>
                <vaadin.productionMode>true</vaadin.productionMode>
            </properties>

            <dependencies>
                <dependency>
                    <groupId>com.vaadin</groupId>
                    <artifactId>flow-server-production-mode</artifactId>
                </dependency>
            </dependencies>

            <build>
                <plugins>
                    <plugin>
                        <groupId>com.vaadin</groupId>
                        <artifactId>vaadin-maven-plugin</artifactId>
                        <version>\${vaadin.version}</version>
                        <executions>
                            <execution>
                                <goals>
                                    <goal>copy-production-files</goal>
                                    <goal>package-for-production</goal>
                                </goals>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
</project>
`;
