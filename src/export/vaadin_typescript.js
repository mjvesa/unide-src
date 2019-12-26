/**
 *  Exporter from model to LitElement
 */
import jsImports from "./js_imports.js";
import { unideGrid } from "./unide-grid-import";
import prettier from "prettier/standalone";
import parserBabylon from "prettier/parser-babylon";

export let exportToVaadinTypescript = project => {
  JSZipUtils.getBinaryContent(
    "templates/vaadin-typescript-project.zip",
    function(err, data) {
      if (err) {
        throw err; // or handle err
      }

      JSZip.loadAsync(data).then(function(zip) {
        let routes = "";
        let designs = project.designs;
        let keys = Object.keys(designs);
        for (let i in keys) {
          let key = keys[i];

          routes =
            routes +
            `{
                path: "${"/" + key}",
                component: "${key}",
                action: async () => { await import("${"./views/" + key}")\}
            },
            `;
          zip.file(
            "frontend/views/" + key + ".ts",
            modelToLitElementTypescript(key, designs[key])
          );
          zip.file("frontend/views/" + key + ".css", designs[key].css);
        }

        zip.file("frontend/index.ts", getIndex(routes));
        zip.file("frontend/views/unide-grid.js", unideGrid);

        zip.generateAsync({ type: "blob" }).then(content => {
          saveAs(content, "vaadin-typescript-project.zip");
        });
      });
    }
  );
};

let kebabToPascalCase = str => {
  let parts = str.split("-");
  let result = "";
  for (let i in parts) {
    result = result.concat(parts[i][0].toUpperCase() + parts[i].slice(1));
  }
  return result;
};

export let modelToLitElementTypescript = (tagName, design) => {
  let pascalCaseName = kebabToPascalCase(tagName);
  let importedTags = new Set();
  let stack = [];
  let tree = [];
  let tagTree = [];

  let current = document.createElement("div");
  let currentTag = "";
  let currentClosed = true;

  let result = "";
  design.tree.forEach(str => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(": {
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
      }
      case ")": {
        if (!currentClosed) {
          result = result.concat(">\n");
          currentClosed = true;
        }
        current = tree.pop();
        result = result.concat(`</${currentTag}>\n`);
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
            `  @click = \${() => {\n
                // @ts-ignore
              Router.go("/${tos}");\n
            }}\n`
          );
        } else if (nos in current) {
          try {
            let json = JSON.parse(tos);
            current[nos] = json;
            result = result.concat(` .${nos}=\${${tos}}`);
          } catch (e) {
            current[nos] = tos;
            result = result.concat(
              ` .${nos}=\$\{"${tos.replace(/\"/g, '\\"')}"\}`
            );
          }
        } else {
          result = result.concat(` ${nos}="${tos}"`);
          current.setAttribute(nos, tos);
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
    `import { LitElement, html, customElement, unsafeCSS} from 'lit-element';
    import {Router} from '@vaadin/router';

    ${importStrings}

    // @ts-ignore
    import styles from './${tagName}.css';
    import { CSSModule } from '../css-utils';

    @customElement('${tagName}')
    export class ${pascalCaseName} extends LitElement {

        static get styles() {
            return [
              CSSModule('lumo-typography'),
              unsafeCSS(styles)
            ];
          }
        
      render() {
        return html\`${result}\`;
      }
    }`,
    { parser: "babel", plugins: [parserBabylon] }
  );
};

const getIndex = routes => {
  return `
    import {Flow} from '@vaadin/flow-frontend/Flow';
import {Router} from '@vaadin/router';

const {serverSideRoutes} = new Flow({
  imports: () => import('../target/frontend/generated-flow-imports')
});

const routes = [
    ${routes}
      // fallback to server-side Flow routes if no client-side route matches
      ...serverSideRoutes
];

const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);

    `;
};
