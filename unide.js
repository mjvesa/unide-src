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

// Positions for DnD
const POSITION_BEFORE_ELEMENT = -1;
const POSITION_CHILD_OF_ELEMENT = 0;
const POSITION_AFTER_ELEMENT = 1;

// Design stack for undo/redo
let designStack = [];
let redoStack = [];

let textEditor;

// Finds the first parenthesis starting from index which is not matched.
// That paren marks the end of the component
const findDanglingParen = (arr, index) => {
  let i = index;
  let parenCount = 0;
  do {
    if (i >= arr.length) {
      throw "Ran out of array while dangling" + JSON.stringify(currentDesign);
    }
    switch (arr[i].trim()) {
      case "(":
        parenCount++;
        break;
      case ")":
        parenCount--;
        break;
      default:
        break;
    }
    i++;
  } while (parenCount >= 0);
  return i - 1;
};

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
  previousEnd = findDanglingParen(currentDesign.tree, elementId + 1);
  let elementTree = currentDesign.tree.slice(previousBegin, previousEnd + 1);
  checkModel(elementTree);
  event.dataTransfer.setData("text", JSON.stringify(elementTree));
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
    return POSITION_CHILD_OF_ELEMENT;
  } else if (clientY < midY) {
    return POSITION_BEFORE_ELEMENT;
  } else {
    return POSITION_AFTER_ELEMENT;
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
      case POSITION_CHILD_OF_ELEMENT:
        marker.style.border = "1px red solid";
        break;
      case POSITION_BEFORE_ELEMENT:
        marker.style.border = "none";
        marker.style.borderTop = "1px red solid";
        break;
      case POSITION_AFTER_ELEMENT:
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

let insertSnippet = (index, position, snippet, tree) => {
  let spliceIndex;
  switch (position) {
    case POSITION_CHILD_OF_ELEMENT:
      spliceIndex = findDanglingParen(currentDesign.tree, index + 1);
      break;
    case POSITION_BEFORE_ELEMENT:
      spliceIndex = index - 1;
      break;
    case POSITION_AFTER_ELEMENT:
      spliceIndex = findDanglingParen(currentDesign.tree, index + 1) + 1;
      break;
  }

  let left = tree.slice(0, spliceIndex);
  let right = tree.slice(spliceIndex);
  return left.concat(snippet).concat(right);
};

let dropElement = e => {
  // Hide marker
  let marker = document.getElementById("marker");
  marker.style.display = "none";
  // Find position of target and adjust
  let target = getElementAt(e.clientX, e.clientY);
  let index = Number(target.getAttribute("data-design-id"));
  if (index >= previousBegin && index <= previousEnd) {
    // Do not allow dropping on itself
    return;
  }
  let snippet = JSON.parse(e.dataTransfer.getData("text"));
  let position = getPositionOnTarget(target, e.clientX, e.clientY);
  let newDesign = {
    tree: insertSnippet(index, position, snippet, currentDesign.tree),
    css: currentDesign.css
  };

  if (index < previousBegin) {
    // Adjust for content added before old position
    const snippetLength = previousEnd - previousBegin + 1;
    previousBegin += snippetLength;
    previousEnd += snippetLength;
  }
  newDesign.tree.splice(previousBegin, previousEnd - previousBegin + 1);

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
  let target = document.elementFromPoint(e.clientX, e.clientY);
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
        props = props + `${nos}\t${tos}\n`;
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
  let attributesAsStrings = attributeString.split("\n");
  let attributes = [];
  for (let i in attributesAsStrings) {
    let str = attributesAsStrings[i].trim();
    if (str !== "") {
      let index = str.indexOf("\t");
      if (index === -1) {
        index = str.indexOf(" ");
      }
      let key = str.substring(0, index);
      let value = str.substring(index);
      attributes.push(key);
      attributes.push(value);
      attributes.push("=");
    }
  }
  // Find range of previous attributes
  let index = selectedElement + 1;
  do {
    let a = currentDesign.tree[index].trim();
    if (a === "(") {
      index--;
      break;
    }
    if (a === ")") {
      break;
    }
    index++;
  } while (index < currentDesign.tree.length);

  // Stick the attributes where the old ones were
  let first = currentDesign.tree.slice(0, selectedElement + 1);
  let rest = currentDesign.tree.slice(index, currentDesign.tree.length);
  let newDesign = {
    tree: first.concat(attributes).concat(rest),
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
        if (tag in storedDesigns) {
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
  let designs = JSON.parse(window.localStorage.getItem("designs") || "{}");
  let parsedDesigns = [];
  let keys = Object.keys(designs);
  keys.forEach(key => {
    parsedDesigns.push(["#" + key, [key, "(", ")"]]);
    parsedDesigns.push([key, designs[key]]);
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
  storedDesigns[designName] = currentDesign;
  localStorage.setItem("designs", JSON.stringify(storedDesigns));
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
  //  let designs = JSON.parse(window.localStorage.getItem("designs") || "{}");
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
      localStorage.setItem("designs", evt.target.result);
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
};

const initializeDesign = () => {
  getPaperElement().attachShadow({ mode: "open" });
  currentDesign = { css: "", tree: initialDesign.split("\n") };
  designStack.push(currentDesign);
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
        tree: currentDesign.tree.slice(),
        css: currentDesign.css
      };
      newDesign.tree.splice(
        selectedElement - 1,
        findDanglingParen(newDesign.tree, selectedElement + 1) -
          selectedElement +
          2
      );
      showNewDesign(newDesign);
      event.stopPropagation();
      event.preventDefault();
    }
  };
};

const getStoredDesigns = () => {
  let designsStr = localStorage.getItem("designs") || "{}";
  storedDesigns = JSON.parse(designsStr);
};

const setDemoDesigns = () => {
  if (!localStorage.getItem("designs")) {
    localStorage.setItem("designs", JSON.stringify(demoDesigns));
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
