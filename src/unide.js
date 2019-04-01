// UniDe Universal Designer for components
import { exportToAngular } from "./export/angular";
import { exportToLitElement } from "./export/lit";
import { exportToFlow } from "./export/flow";
import { exportToPreact } from "./export/preact";
import { exportToReact } from "./export/react";
import { exportToRaw } from "./export/raw";
import { exportToSvelte } from "./export/svelte";
import { exportToVanilla } from "./export/vanilla";
import { exportToVoK } from "./export/vok";
import { exportToVue } from "./export/vue";
import { paletteContent } from "./curated_header.js";
import { checkModel } from "./check-model";
import { demoDesigns } from "./demo_designs";
import Picker from "vanilla-picker";
import * as Model from "./model";
import { cssPropertyTypes } from "./css-proprety-types";
const initialDesign = `div
  (
    style
    width: 100%; height: 100%;
    =
  )`;

let currentDesign = [];
let selectedElement;
let storedDesigns = {};

// DnD Stuff
let previousBegin, previousEnd;

// Design stack for undo/redo
let designStack = [];
let redoStack = [];

let textEditor;

const getPaperElement = () => {
  let el = document.getElementById("paper");
  return el;
};

const getOutlineElement = () => {
  return document.getElementById("outline");
};

const showCurrentDesign = () => {
  checkModel(currentDesign.tree);
  let paper = getPaperElement();
  paper.shadowRoot.innerHTML = "";
  let style = document.createElement("style");
  style.textContent = currentDesign.css; //textEditor.getValue();
  textEditor.getDoc().setValue(currentDesign.css);
  paper.shadowRoot.appendChild(style);
  modelToDOM(currentDesign.tree, paper.shadowRoot);
  let outline = getOutlineElement();
  outline.innerHTML = "";
  modelToOutline(currentDesign.tree, outline);
};

const startDrag = (event, snippet) => {
  event.dataTransfer.setData("text", JSON.stringify(snippet));
  previousBegin = previousEnd = -1;
};

const showNewDesign = newDesign => {
  designStack.push(currentDesign);
  currentDesign = newDesign;
  showCurrentDesign();
};

// eslint-disable-next-line
const startDragFromModel = (elementId, event) => {
  previousBegin = elementId - 1;
  previousEnd = Model.findDanglingParen(currentDesign.tree, elementId + 1);
  //event.dataTransfer.setData("text", JSON.stringify(elementTree));
  event.stopPropagation();
};

/**
 * Determines where on the target the current coordinates lie. Either
 * they are before the element, on the element or after the
 * element.
 *
 * @param {*} el
 * @param {*} clientX
 * @param {*} clientY
 */
const getPositionOnTarget = (el, clientX, clientY) => {
  let bcr = el.getBoundingClientRect();
  let radius = Math.min(bcr.right - bcr.left, bcr.bottom - bcr.top) / 2;
  let midX = (bcr.left + bcr.right) / 2;
  let midY = (bcr.top + bcr.bottom) / 2;
  if (
    Math.sqrt(
      (midX - clientX) * (midX - clientX) + (midY - clientY) * (midY - clientY)
    ) <= radius
  ) {
    return Model.POSITION_CHILD_OF_ELEMENT;
  } else if (clientY < midY) {
    return Model.POSITION_BEFORE_ELEMENT;
  } else {
    return Model.POSITION_AFTER_ELEMENT;
  }
};

const getElementAt = (x, y) => {
  let el = getPaperElement().shadowRoot.elementFromPoint(x, y);
  el = el ? el : document.elementFromPoint(x, y);
  return el;
};

const placeMarker = e => {
  let marker = document.getElementById("marker");
  marker.style.display = "none";
  let target = getElementAt(e.clientX, e.clientY);
  let designId = target ? target.getAttribute("data-design-id") : null;
  if (target && designId) {
    let bcr = target.getBoundingClientRect();
    marker.style.display = "block";
    marker.style.top = bcr.top + "px";
    marker.style.left = bcr.left + "px";
    marker.style.width = bcr.width + "px";
    marker.style.height = bcr.height + "px";
    let position = getPositionOnTarget(target, e.clientX, e.clientY);
    switch (position) {
      case Model.POSITION_CHILD_OF_ELEMENT:
        marker.style.border = "1px red solid";
        break;
      case Model.POSITION_BEFORE_ELEMENT:
        marker.style.border = "none";
        marker.style.borderTop = "1px red solid";
        break;
      case Model.POSITION_AFTER_ELEMENT:
        marker.style.border = "none";
        marker.style.borderBottom = "1px red solid";
        break;
      default:
        break;
    }
    e.preventDefault();
    e.stopPropagation();
  } else {
    marker.style.display = "none";
  }
};

const insertingNewSubtree = () => {
  return previousBegin === previousEnd;
};

let dropElement = e => {
  // Hide marker
  let marker = document.getElementById("marker");
  marker.style.display = "none";
  // Find position of target
  let target = getElementAt(e.clientX, e.clientY);
  let index = Number(target.getAttribute("data-design-id"));
  let position = getPositionOnTarget(target, e.clientX, e.clientY);

  let newDesign;

  if (insertingNewSubtree()) {
    let subtree = JSON.parse(e.dataTransfer.getData("text"));
    newDesign = {
      tree: Model.insertSubtree(index, position, subtree, currentDesign.tree),
      css: currentDesign.css
    };
  } else {
    if (index >= previousBegin && index <= previousEnd) {
      // Do not allow dropping on itself
      return;
    }
    newDesign = {
      tree: Model.moveSubtree(
        index,
        position,
        previousBegin,
        previousEnd,
        currentDesign.tree
      ),
      css: currentDesign.css
    };
  }

  designStack.push(currentDesign);
  currentDesign = newDesign;
  showCurrentDesign();
  e.preventDefault();
};

/**
 * Selects the clicked element and displays its attributes in the
 * attribute panel.
 *
 * @param {*} e
 */
let selectElement = e => {
  let target = getElementAt(e.clientX, e.clientY);
  let designId = target.getAttribute("data-design-id");
  if (designId) {
    selectedElement = Number(designId);
    // Mini interpreter for extracting property values
    let stack = [];
    let props = "";
    let ip = Number(designId) + 1;
    let value = currentDesign.tree[ip].trim();
    while (value !== "(" && value !== ")" && ip < currentDesign.tree.length) {
      if (value === "=") {
        let tos = stack.pop();
        let nos = stack.pop();
        if (nos.trim() === "targetRoute") {
          document.getElementById("target-route").value = tos;
        } else {
          props = props + `${nos}\t${tos}\n`;
        }
      } else {
        stack.push(value);
      }
      ip++;
      value = currentDesign.tree[ip].trim();
    }
    document.getElementById("attributes").value = props;
    e.preventDefault();
    e.stopPropagation();
  }
};

/**
 * Updates the attributes of the selected element by removing
 * the previous ones and replacing them with new attributes.
 */
const updateAttributes = () => {
  let attributeString = document.getElementById("attributes").value;
  let targetRoute = document.getElementById("target-route").value;
  if (targetRoute.trim() !== "") {
    attributeString = attributeString.concat(`targetRoute\t${targetRoute}`);
  }
  let newDesign = {
    tree: Model.updateSubtreeAttributes(
      attributeString,
      selectedElement,
      currentDesign.tree
    ),
    css: currentDesign.css
  };
  designStack.push(currentDesign);
  currentDesign = newDesign;
  showCurrentDesign();
};

// eslint-disable-next-line
const navigateTo = event => {
  let targetRoute = event.target.getAttribute("targetroute");
  if (targetRoute) {
    loadDesign(targetRoute);
  }
};

/**
 * Creates an interpreter for the Attribute Tree Intermediate Representation
 * that is the UniDe model. The provided functions (in string form) each
 * handle one of the three words in ATIR: ()=
 *
 * @param {*} lparenfnStr
 * @param {*} rparenfnStr
 * @param {*} eqfnStr
 * @param {*} valuefnStr
 */
const makeATIRInterpreter = (lparenfnStr, rparenfnStr, eqfnStr, valuefnStr) => {
  // eslint-disable-next-line
  let stack = [];
  // eslint-disable-next-line
  let tree = [];
  let current;
  let lparenfn = eval(lparenfnStr);
  let rparenfn = eval(rparenfnStr);
  let eqfn = eval(eqfnStr);
  let valuefn = eval(valuefnStr);
  return (code, target, inert = false) => {
    current = target;
    code.forEach((str, index) => {
      let trimmed = str.trim();
      switch (trimmed) {
        case "(":
          lparenfn(index, inert);
          break;
        case ")":
          rparenfn();
          break;
        case "=":
          eqfn();
          break;
        default:
          valuefn(trimmed);
      }
    });
    return current;
  };
};

const modelToDOM = (code, target, inert = false) => {
  let stack = [];
  let tree = [];
  let current = target;
  // current = target;
  code.forEach((str, index) => {
    let trimmed = str.trim();
    switch (trimmed) {
      case "(": {
        let old = current;
        tree.push(current);
        let tag = stack.pop();
        if (tag in storedDesigns.designs) {
          current = document.createElement("div");
          modelToDOM(storedDesigns[tag], current, true);
        } else {
          current = document.createElement(tag);
        }
        if (!inert) {
          current.setAttribute("data-design-id", index);
          current.ondragstart = event => {
            startDragFromModel(index, event);
          };
          current.ondblclick = event => {
            navigateTo(event);
          };
          current.draggable = true;
        }
        old.appendChild(current);
        break;
      }
      case ")": {
        current = tree.pop();
        break;
      }
      case "=": {
        let tos = stack.pop();
        let nos = stack.pop();
        if (nos in current) {
          try {
            let json = JSON.parse(tos);
            current[nos] = json;
          } catch (e) {
            current[nos] = tos;
            current.setAttribute(nos, tos);
          }
        } else {
          current.setAttribute(nos, tos);
        }

        break;
      }
      default: {
        stack.push(trimmed);
      }
    }
  });
  return current;
};

const modelToOutline = makeATIRInterpreter(
  `(index, inert) => {
      let old = current;
      tree.push(current);
      current = document.createElement('div');
      current.textContent=stack.pop();
      current.setAttribute('data-design-id', index);
      current.ondragstart = (event) => {startDragFromModel(index, event)};
      current.draggable = true;
      old.appendChild(current);
    }`,
  "() => {current = tree.pop()}",
  "() => {}",
  "str => {stack.push(str)}"
);

/**
 * Creates a section in the palette. Features a title of
 * the section and contents that appears on hover.
 * @param {string} name
 * @param {*} tags
 * @param {*} palette
 */
const createPaletteSection = (name, tags, palette) => {
  let outer = document.createElement("div");
  outer.className = "palette-section";
  outer.innerHTML = name;
  outer.onmouseover = () => {
    outer.style.height = 8 + tags.length + "rem";
  };
  outer.onmouseout = () => {
    outer.style.height = null;
  };
  palette.appendChild(outer);
  for (let i in tags) {
    let tagAndSnippet = tags[i];
    let el = document.createElement("div");
    const snippet = tagAndSnippet[1];
    if (snippet) {
      el.draggable = true;
      el.ondragstart = event => {
        const preview = document.getElementById("element-preview");
        preview.style.display = "none";
        startDrag(event, snippet);
      };

      el.onmouseover = event => {
        const preview = document.getElementById("element-preview");
        preview.style.top = event.clientY + "px";
        preview.style.left = event.clientX + 200 + "px";
        preview.innerHTML = "";
        modelToDOM(snippet, preview);
        preview.style.display = "block";
      };
      el.onmouseout = () => {
        const preview = document.getElementById("element-preview");
        preview.style.display = "none";
      };
    }
    el.innerHTML = tagAndSnippet[0];
    outer.appendChild(el);
  }
};

/**
 * Collects designs stored in local storage for inclusion
 * in the palette.
 */
const getStoredDesignsForPalette = () => {
  let project = JSON.parse(
    window.localStorage.getItem("unide.project") || "{designs:{}}"
  );
  let parsedDesigns = [];
  let keys = Object.keys(project.designs);
  keys.forEach(key => {
    parsedDesigns.push(["#" + key, [key, "(", ")"]]);
    parsedDesigns.push([key, project.designs[key].tree]);
  });
  return parsedDesigns;
};

/**
 * Fills the palette from a curated set of elements and snippets.
 * Also adds a section containing existing designs to be used
 * as components or expanded into the current design.
 */
const populatePalette = () => {
  let palette = document.getElementById("palette");
  palette.innerHTML = "";
  createPaletteSection(
    "<h2>Designs</h2>",
    getStoredDesignsForPalette(),
    palette
  );
  for (let j in paletteContent) {
    let section = paletteContent[j];
    createPaletteSection(section[0], section[1], palette);
  }
};

/**
 * Populates the design selector with the designs found
 * in local storage.
 */
const populateDesignSelector = () => {
  let selector = document.getElementById("choose-design");
  selector.innerHTML = "";
  let keys = Object.keys(storedDesigns.designs);
  let placeholder = document.createElement("option");
  placeholder.textContent = "Select a design";
  selector.add(placeholder);
  for (let i in keys) {
    let el = document.createElement("option");
    el.textContent = keys[i];
    el.setAttribute("value", keys[i]);
    selector.add(el);
  }
};

/**
 * Saves the current design into local storage.
 *
 * @param {*} event
 */
const saveDesign = () => {
  let designName = document.getElementById("design-name").value;
  storedDesigns.designs[designName] = currentDesign;
  localStorage.setItem("unide.project", JSON.stringify(storedDesigns));
  populateDesignSelector();
};

/**
 * Pulls the specified design from local storage and uses it as the
 * current design.
 *
 * @param {*} designName
 */
const loadDesign = designName => {
  document.getElementById("design-name").value = designName;
  currentDesign = storedDesigns.designs[designName];
  designStack = [];
  redoStack = [];
  showCurrentDesign();
};

const loadSelectedDesign = () => {
  loadDesign(document.getElementById("choose-design").value);
};

/**
 * Imports a raw model, that is a plain JSON representation of what is in local storage.
 * @param {*} event
 */
const importRawModel = () => {
  const upload = document.getElementById("import-file-input");
  const file = upload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(evt) {
      localStorage.setItem("unide.project", evt.target.result);
      populateDesignSelector();
    };
  }
};

/**
 * Calls the appropriate function for exporting the designs currently
 * in local storage based on user selection.
 */
const exportDesign = () => {
  let format = document.getElementById("choose-export-format").value;
  if (format === "LitElement") {
    exportToLitElement(storedDesigns);
  } else if (format === "Angular") {
    exportToAngular(storedDesigns);
  } else if (format === "Flow") {
    exportToFlow(storedDesigns);
  } else if (format === "Preact") {
    exportToPreact(storedDesigns);
  } else if (format === "Raw") {
    exportToRaw(storedDesigns);
  } else if (format === "React") {
    exportToReact(storedDesigns);
  } else if (format === "Svelte") {
    exportToSvelte(storedDesigns);
  } else if (format === "VanillaJS") {
    exportToVanilla(storedDesigns);
  } else if (format === "Vaadin on Kotlin") {
    exportToVoK(storedDesigns);
  } else if (format === "Vue") {
    exportToVue(storedDesigns);
  } else {
    window.alert(`Export to ${format} is not implemented yet, sorry.`);
  }
};

/**
 * Installs handlers for mouse events on various parts of the UI
 */
const installUIEventHandlers = () => {
  let outline = getOutlineElement();
  outline.ondragover = placeMarker;
  outline.onclick = selectElement;
  let paper = getPaperElement();
  paper.ondragover = placeMarker;
  paper.onclick = selectElement;
  let marker = document.getElementById("marker");
  marker.ondrop = dropElement;
  marker.ondragover = placeMarker;
  let attributes = document.getElementById("attributes");
  attributes.onblur = updateAttributes;

  document.getElementById("save-design").onclick = saveDesign;
  document.getElementById("choose-design").onchange = loadSelectedDesign;
  document.getElementById("export-design").onclick = exportDesign;
  document.getElementById("import-file").onclick = importRawModel;

  textEditor.on("change", () => {
    let el = paper.shadowRoot.querySelector("style");
    if (el) {
      let css = textEditor.getValue();
      el.textContent = css;
      currentDesign.css = css;
    }
  });

  let showingEditor = false;
  let lastLine = 0;

  textEditor.on("cursorActivity", () => {
    let el = document.getElementById("element-preview");
    let pos = textEditor.getCursor();
    let line = textEditor.getLine(pos.line);
    let pieces = line.split(":");
    let prop = pieces[0].trim();
    if (pieces.length > 1) {
      if (cssPropertyTypes.size.includes(prop)) {
        if (!showingEditor || lastLine !== pos.line) {
          showingEditor = true;
          lastLine = pos.line;
          el.innerHTML = '<input type="range" id="somerange"></input>';
          el.style.display = "block";
          el.style.top = pos.line + 4 + "rem";
          el.style.left = pos.ch + "rem";
          let rangeEl = document.getElementById("somerange");
          rangeEl.oninput = event => {
            line = textEditor.getLine(pos.line);
            let end = { line: pos.line, ch: line.length };
            let beginning = { line: pos.line, ch: 0 };
            let newContent;
            if (/[0-9]+/.test(line)) {
              newContent = line.replace(/[0-9]+/, rangeEl.value);
            } else {
              newContent = line.replace(
                /:[ ]*[0-9]*[ ]*;?/,
                ": " + rangeEl.value + "px;"
              );
            }
            //"font-size:" + rangeEl.value + "px",
            textEditor.replaceRange(newContent, beginning, end);
          };
        }
      } else if (cssPropertyTypes.color.includes(prop)) {
        if (!showingEditor || lastLine !== pos.line) {
          showingEditor = true;
          lastLine = pos.line;
          el.innerHTML = '<div id="color-picker">Pick Color</div>';
          el.style.display = "block";
          el.style.top = pos.line + 4 + "rem";
          el.style.left = pos.ch + "rem";
          let parent = document.getElementById("color-picker");
          new Picker({
            parent: parent,
            color: pieces[1].replace(";", ""),
            onChange: color => {
              let newLine = textEditor.getLine(pos.line);
              let end = { line: pos.line, ch: newLine.length };
              let beginning = { line: pos.line, ch: 0 };
              let newContent = newLine.replace(
                /:[ ]*#*([a-z]|[0-9])*[ ]*;?/,
                ": " + color.hex + ";"
              );
              //"font-size:" + rangeEl.value + "px",
              textEditor.replaceRange(newContent, beginning, end);
            }
          });
        }
      } else if (cssPropertyTypes.finite.hasOwnProperty(prop)) {
        if (!showingEditor || lastLine !== pos.line) {
          let choices = cssPropertyTypes.finite[prop];
          showingEditor = true;
          lastLine = pos.line;
          el.innerHTML = '<select id="finite-select"></select>';
          el.style.display = "block";
          el.style.top = pos.line + 4 + "rem";
          el.style.left = pos.ch + "rem";
          let parent = document.getElementById("finite-select");
          choices.forEach(choice => {
            let opt = document.createElement("option");
            opt.textContent = choice;
            parent.appendChild(opt);
          });

          parent.onchange = () => {
            let newLine = textEditor.getLine(pos.line);
            let end = { line: pos.line, ch: newLine.length };
            let beginning = { line: pos.line, ch: 0 };
            let newContent = newLine.replace(
              /:[ ]*#*([a-z]|-)*[ ]*;?/,
              ": " + parent.value + ";"
            );
            //"font-size:" + rangeEl.value + "px",
            textEditor.replaceRange(newContent, beginning, end);
          };
        }
      } else {
        showingEditor = false;
        lastLine = 0;
        el.style.display = "none";
      }
    } else {
      showingEditor = false;
      lastLine = 0;
      el.style.display = "none";
    }
  });
};

const initializeDesign = () => {
  getPaperElement().attachShadow({ mode: "open" });
  const keys = Object.keys(storedDesigns.designs);
  if (!storedDesigns.designs[keys[0]]) {
    currentDesign = { css: "", tree: initialDesign.split("\n") };
    designStack.push(currentDesign);
  } else {
    loadDesign(keys[0]);
  }
};

const installKeyboardHandlers = () => {
  document.body.onkeypress = event => {
    if (event.key === "z" && event.ctrlKey) {
      if (designStack.length > 0) {
        redoStack.push(currentDesign);
        currentDesign = designStack.pop();
        showCurrentDesign();
      }
      event.stopPropagation();
      event.preventDefault();
    }
    if (event.key === "y" && event.ctrlKey) {
      if (redoStack.length > 0) {
        designStack.push(currentDesign);
        currentDesign = redoStack.pop();
        showCurrentDesign();
      }
      event.stopPropagation();
      event.preventDefault();
    }

    if (event.key === "Delete") {
      let newDesign = {
        tree: Model.deleteSubtree(selectedElement, currentDesign.tree),
        css: currentDesign.css
      };
      showNewDesign(newDesign);
      event.stopPropagation();
      event.preventDefault();
    }
  };
};

const getStoredDesigns = () => {
  let designsStr = localStorage.getItem("unide.project") || '{"designs": {}}';
  storedDesigns = JSON.parse(designsStr);
};

const setDemoDesigns = () => {
  if (!localStorage.getItem("unide.project")) {
    localStorage.setItem("unide.project", JSON.stringify(demoDesigns));
  }
};

const setupTextEditor = () => {
  // eslint-disable-next-line no-undef
  textEditor = CodeMirror(document.getElementById("text-editor"), {
    mode: "text/css",
    theme: "tomorrow-night-eighties",
    extraKeys: { "Ctrl-Space": "autocomplete" }
  });
};

const initDesigner = () => {
  setDemoDesigns();
  getStoredDesigns();
  setupTextEditor();
  populatePalette();
  populateDesignSelector();
  initializeDesign();
  installUIEventHandlers();
  installKeyboardHandlers();
  showCurrentDesign();
};

export default initDesigner;
