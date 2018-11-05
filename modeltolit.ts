/**
 *  Exporter from model to LitElement
 */
let modelToLitElement = (code:string[]) => {
  let stack:string[] = [];
  let tree:HTMLElement[] = [];
  let tagTree:string[] = [];

  let current:HTMLElement = document.createElement("div");
  let currentTag:string|undefined = "";
  let currentClosed = true;

  let result = `import {LitElement, html} from 'https://unpkg.com/@polymer/lit-element@latest/lit-element.js?module';
     class MyElement extends LitElement {
       _render() {\``;
  code.forEach((str:string, index:number) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(":
        if (!currentClosed) {
          result = result.concat(">\n");
          currentClosed = true;
        }
        let old = current;
        tree.push(current);

        tagTree.push(currentTag!);
        currentTag = stack.pop()!;

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
        current = tree.pop()!;
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
          try {
            let json = JSON.parse(tos);
            (current as any)[nos] = json;
            result = result.concat(` .${nos}=\$\{"{JSON.parse(tos)}"\}`);
          } catch (e) {
            (current as any)[nos] = tos;
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
  return result.concat(`\`
      }
    }
    customElements.define('my-element', MyElement);
  `);
};

export default modelToLitElement;
