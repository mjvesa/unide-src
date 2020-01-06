// Visual designer for pure Java and Vaadin
import CodeMirror from "codemirror";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/css-hint.js";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/tomorrow-night-eighties.css";

import "@vaadin/vaadin-lumo-styles/color.js";
import "@vaadin/vaadin-lumo-styles/sizing.js";
import "@vaadin/vaadin-lumo-styles/spacing.js";
import "@vaadin/vaadin-lumo-styles/style.js";
import "@vaadin/vaadin-lumo-styles/typography.js";

import "file-saver/dist/FileSaver.js";

import {
  exportToJava,
  modelToJava,
  kebabToPascalCase,
  packageToFolder
} from "./export/java";
import { exportToVaadinTypescript } from "./export/vaadin_typescript";
import { exportToRaw } from "./export/raw";
import { exportToAngular } from "./export/angular";
import { exportToLitElement } from "./export/lit";
import { exportToPreact } from "./export/preact";
import { exportToReact } from "./export/react";
import { exportToSvelte } from "./export/svelte";
import { exportToVanilla } from "./export/vanilla";
import { exportToVue } from "./export/vue";

import { paletteContent } from "./curated_header.js";
import { checkModel } from "./check-model";
import { demoDesigns } from "./demo_designs";
import Picker from "vanilla-picker";
import * as Model from "./model";
import { cssPropertyTypes } from "./css-proprety-types";
import { cssProperties } from "./css-properties.js";
import { enterSketchMode } from "./sketch-mode";
import { ATIRToXML, XMLToATIR } from "./xml";

// Global variables
const $ = document.querySelector.bind(document);

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
let htmlEditor;
let currentMode = "Visual";

const getPaperElement = () => {
  const el = document.getElementById("visual-editor");
  return el;
};

const getOutlineElement = () => {
  return document.getElementById("outline");
};

const showCurrentDesign = () => {
  checkModel(currentDesign.tree);
  hideMarkers();
  const paper = getPaperElement();
  paper.shadowRoot.innerHTML = "";
  const style = document.createElement("style");
  style.textContent = currentDesign.css; //textEditor.getValue();
  textEditor.getDoc().setValue(currentDesign.css);
  paper.shadowRoot.appendChild(style);
  modelToDOM(currentDesign.tree, paper.shadowRoot);
  const outline = getOutlineElement();
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
  const bcr = el.getBoundingClientRect();
  const radius = Math.min(bcr.right - bcr.left, bcr.bottom - bcr.top) / 2;
  const midX = (bcr.left + bcr.right) / 2;
  const midY = (bcr.top + bcr.bottom) / 2;
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

const hideMarkers = () => {
  $("#select-marker-outline").style.display = "none";
  $("#select-marker-paper").style.display = "none";
  $("#marker").style.display = "none";
};

const placeMarker = e => {
  const marker = document.getElementById("marker");
  marker.style.display = "none";
  const target = getElementAt(e.clientX, e.clientY);
  const designId = target ? target.getAttribute("data-design-id") : null;
  if (target && designId) {
    const bcr = target.getBoundingClientRect();
    marker.style.display = "block";
    marker.style.top = bcr.top + "px";
    marker.style.left = bcr.left + "px";
    marker.style.width = bcr.width + "px";
    marker.style.height = bcr.height + "px";
    const position = getPositionOnTarget(target, e.clientX, e.clientY);
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

const dropElement = e => {
  hideMarkers();
  // Find position of target
  const target = getElementAt(e.clientX, e.clientY);
  const index = Number(target.getAttribute("data-design-id"));
  const position = getPositionOnTarget(target, e.clientX, e.clientY);

  let newDesign;

  if (insertingNewSubtree()) {
    const subtree = JSON.parse(e.dataTransfer.getData("text"));
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

const placeSelectMarker = (target, marker) => {
  const bcr = target.getBoundingClientRect();
  marker.style.display = "block";
  marker.style.top = bcr.top + "px";
  marker.style.left = bcr.left + "px";
  marker.style.width = bcr.width + "px";
  marker.style.height = bcr.height + "px";
};

/**
 * Selects the clicked element and displays its attributes in the
 * attribute panel.
 *
 * @param {*} e
 */
const selectElement = e => {
  const target = getElementAt(e.clientX, e.clientY);
  const designId = target.getAttribute("data-design-id");
  if (designId) {
    placeSelectMarker(
      $("#visual-editor").shadowRoot.querySelector(
        `[data-design-id="${designId}"]`
      ),
      document.getElementById("select-marker-paper")
    );
    placeSelectMarker(
      $(`#outline [data-design-id="${designId}"]`),
      document.getElementById("select-marker-outline")
    );
    selectedElement = Number(designId);
    // Mini interpreter for extracting property values
    const stack = [];
    let props = "<table>";
    let ip = Number(designId) + 1;
    let value = currentDesign.tree[ip].trim();
    $("#target-route").value = "";
    $("#field-name").value = "";
    while (value !== "(" && value !== ")" && ip < currentDesign.tree.length) {
      if (value === "=") {
        const tos = stack.pop();
        const nos = stack.pop();
        if (nos.trim() === "targetRoute") {
          $("#target-route").value = tos;
        } else if (nos.trim() === "fieldName") {
          $("#field-name").value = tos;
        } else {
          props =
            props +
            `<tr><td contenteditable>${nos}</td><td contenteditable>${tos}</td></tr>`;
        }
      } else {
        stack.push(value);
      }
      ip++;
      value = currentDesign.tree[ip].trim();
    }

    // Add ten lines for new props
    for (let i = 0; i < 10; i++) {
      props =
        props + `<tr><td contenteditable></td><td contenteditable></td></tr>`;
    }

    document.getElementById("attributes").innerHTML = props + "</table>";
    e.preventDefault();
    e.stopPropagation();
  }
};

/**
 * Updates the attributes of the selected element by removing
 * the previous ones and replacing them with new attributes.
 */
const updateAttributes = () => {
  let attributes = [];
  const table = $("#attributes").firstChild.firstChild;
  table.childNodes.forEach(tr => {
    let key = tr.firstChild.textContent;
    let value = tr.lastChild.textContent;
    if (!(key.trim() === "")) {
      attributes.push(key);
      attributes.push(value);
      attributes.push("=");
    }
  });
  const targetRoute = $("#target-route").value;
  if (targetRoute.trim() !== "") {
    attributes.push("targetRoute");
    attributes.push(targetRoute);
    attributes.push("=");
  }

  const fieldName = $("#field-name").value;
  if (fieldName.trim() !== "") {
    attributes.push("fieldName");
    attributes.push(fieldName);
    attributes.push("=");
  }

  const newDesign = {
    tree: Model.updateSubtreeAttributes(
      attributes,
      selectedElement,
      currentDesign.tree
    ),
    css: currentDesign.css
  };
  showNewDesign(newDesign);
};

// eslint-disable-next-line
const navigateTo = event => {
  const targetRoute = event.target.getAttribute("targetroute");
  if (targetRoute) {
    loadDesign(targetRoute);
  }
};

const insertCssRule = el => {
  let selector = "";
  let current = el;
  const shadowParent = getPaperElement().shadowRoot;
  while (current && current != shadowParent) {
    if (current.className != "") {
      selector = `.${current.className} ${selector}`;
    } else {
      selector = `${current.tagName.toLowerCase()} ${selector}`;
    }
    current = current.parentElement;
  }
  textEditor.setCursor(textEditor.lineCount(), 0);
  insertCssAtCursor(`\n${selector.trim().replace(/ /g, " > ")} {\n\n}`);
  textEditor.setCursor(textEditor.lineCount() - 2, 0);
  textEditor.focus();
};

const modelToDOM = (code, target, inert = false) => {
  const stack = [];
  const tree = [];
  let current = target;
  // current = target;
  code.forEach((str, index) => {
    const trimmed = str.trim();
    switch (trimmed) {
      case "(": {
        const old = current;
        tree.push(current);
        const tag = stack.pop();
        // Nested designs, attach shadow root, append style and content
        if (tag in storedDesigns.designs) {
          console.log("creating shadow root for nested");
          current = document.createElement("div");
          const root = document.createElement("div");
          current.attachShadow({ mode: "open" });
          current.shadowRoot.appendChild(root);
          const style = document.createElement("style");
          style.textContent = storedDesigns.designs[tag].css;
          current.shadowRoot.appendChild(style);
          modelToDOM(storedDesigns.designs[tag].tree, root, true);
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

          current.oncontextmenu = event => {
            insertCssRule(event.target);
            event.stopPropagation();
            event.preventDefault();
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
        const tos = stack.pop();
        const nos = stack.pop();
        if (nos in current) {
          try {
            const json = JSON.parse(tos);
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

const modelToOutline = (code, target, inert = false) => {
  let stack = [];
  let tree = [];
  let current;
  current = target;
  code.forEach((str, index) => {
    const trimmed = str.trim();
    switch (trimmed) {
      case "(":
        let old = current;
        tree.push(current);
        current = document.createElement("div");
        current.textContent = stack.pop();
        current.setAttribute("data-design-id", index);
        current.ondragstart = event => {
          startDragFromModel(index, event);
        };
        current.draggable = true;
        old.appendChild(current);
        break;
      case ")":
        current = tree.pop();
        break;
      case "=":
        break;
      default:
        stack.push(trimmed);
    }
  });
  return current;
};

/**
 * Creates a section in the palette. Features a title of
 * the section and contents that appears on hover.
 * @param {string} name
 * @param {*} tags
 * @param {*} palette
 */
const createPaletteSection = (name, tags, palette) => {
  const outer = document.createElement("div");
  outer.className = "palette-section";
  outer.innerHTML = name;
  palette.appendChild(outer);
  for (const i in tags) {
    const tagAndSnippet = tags[i];
    const el = document.createElement("div");
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
  const parsedDesigns = [];
  const keys = Object.keys(storedDesigns.designs);
  keys.forEach(key => {
    parsedDesigns.push([key, [key, "(", ")"]]);
    parsedDesigns.push(["expanded " + key, storedDesigns.designs[key].tree]);
  });
  return parsedDesigns;
};

/**
 * Fills the palette from a curated set of elements and snippets.
 * Also adds a section containing existing designs to be used
 * as components or expanded into the current design.
 */
const populatePalette = () => {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";
  createPaletteSection(
    "<h2>Designs</h2>",
    getStoredDesignsForPalette(),
    palette
  );
  for (const j in paletteContent) {
    const section = paletteContent[j];
    createPaletteSection(section[0], section[1], palette);
  }
};

/**
 * Populates the design selector with the designs found
 * in local storage.
 */
const populateDesignSelector = selector => {
  selector.innerHTML = "";
  const keys = Object.keys(storedDesigns.designs);
  const placeholder = document.createElement("option");
  placeholder.textContent = "Select a design";
  selector.add(placeholder);
  for (const i in keys) {
    const el = document.createElement("option");
    el.textContent = keys[i];
    el.setAttribute("value", keys[i]);
    selector.add(el);
  }
};

const populateDesignSelectors = () => {
  populateDesignSelector($("#choose-design"));
  populateDesignSelector($("#target-route"));
};

const storeProject = () => {
  const storedDesignsString = JSON.stringify(storedDesigns);

  if (window.Unide && (window.Unide.inElectron || window.Unide.inVSCode)) {
    window.Unide.saveState(storedDesignsString);
  } else {
    localStorage.setItem("unide.project", storedDesignsString);
  }

  populateDesignSelectors();
};

/**
 * Saves the current design into local storage.
 *
 * @param {*} event
 */
const saveDesign = () => {
  const designName = document.getElementById("design-name").value;
  storedDesigns.designs[designName] = currentDesign;
  storeProject();
  const format = storedDesigns.settings.exportFormat || "Vaadin Java";
  if (
    window.Unide &&
    (window.Unide.inElectron || window.Unide.inVSCode) &&
    format === "Vaadin Java"
  ) {
    const javaName = kebabToPascalCase(designName);
    let content = modelToJava(
      javaName,
      designName,
      storedDesigns.settings.packageName,
      currentDesign.tree
    );
    window.Unide.saveFile(
      `${packageToFolder(storedDesigns.settings.packageName)}${javaName}.java`,
      content
    );
    window.Unide.saveFile(
      `./frontend/styles/${designName}.css`,
      currentDesign.css
    );
  }
};

/**
 * Pulls the specified design from local storage and uses it as the
 * current design.
 *
 * @param {*} designName
 */
const loadDesign = designName => {
  hideMarkers();
  $("#design-name").value = designName;
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
 */
const importRawModel = () => {
  const upload = document.getElementById("import-file-input");
  const file = upload.files[0];
  if (file) {
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function(evt) {
      localStorage.setItem("unide.project", evt.target.result);
      populateDesignSelectors();
    };
  }
};

/**
 * Calls the appropriate function for exporting the designs currently
 * in local storage based on user selection.
 */
const exportDesign = () => {
  const format = storedDesigns.settings.exportFormat || "Vaadin Java";

  if (format === "LitElement") {
    exportToLitElement(storedDesigns);
  } else if (format === "Angular") {
    exportToAngular(storedDesigns);
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
  } else if (format === "Vue") {
    exportToVue(storedDesigns);
  } else if (format === "Vaadin Java") {
    exportToJava(storedDesigns);
  } else if (format === "Vaadin TypeScript") {
    exportToVaadinTypescript(storedDesigns);
  } else {
    window.alert(`Export to ${format} is not implemented yet, sorry.`);
  }
};

const switchToSketchMode = () => {
  hideMarkers();
  enterSketchMode(getPaperElement(), design => {
    const newTree = currentDesign.tree.slice().concat(design);
    showNewDesign({ css: currentDesign.css.slice(), tree: newTree });
  });
};

const initializeDesign = () => {
  const keys = Object.keys(storedDesigns.designs);
  if (!storedDesigns.designs[keys[0]]) {
    currentDesign = { css: "", tree: initialDesign.split("\n") };
    designStack.push(currentDesign);
    $("#choose-design").value = keys[0];
  } else {
    loadDesign(keys[0]);
  }
};

const deleteDesign = () => {
  const designName = $("#design-name").value;
  delete storedDesigns.designs[designName];
  localStorage.setItem("unide.project", JSON.stringify(storedDesigns));
  populateDesignSelectors();
  initializeDesign();
};

const newDesign = () => {
  $("#design-name").value = "";
  currentDesign = { css: "", tree: initialDesign.split("\n") };
  designStack.push(currentDesign);
  showCurrentDesign();
};

const shareDesigns = () => {
  const designs = btoa(JSON.stringify(storedDesigns));
  const shareLink = window.location.href + "?share=" + designs;
  const ta = document.createElement("textarea");
  ta.value = shareLink;
  ta.style.height = "0px";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  document.body.scroll(0, 0);
};

const showProjectSettings = event => {
  const el = $("#visual-editor");
  const settings = storedDesigns.settings || {};
  const node = document.importNode($("#settings-template").content, true);
  el.shadowRoot.innerHTML = "";
  el.shadowRoot.appendChild(node);

  el.shadowRoot.querySelector("#target-folder").value =
    settings.packageName || "unide.app";
  el.shadowRoot.querySelector("#choose-export-format").value =
    settings.exportFormat || "Vaadin Java";

  el.shadowRoot.querySelector("#settings-cancel").onclick = () => {
    showCurrentDesign();
  };
  el.shadowRoot.querySelector("#settings-save").onclick = () => {
    const packageName = el.shadowRoot.querySelector("#target-folder").value;
    const exportFormat = el.shadowRoot.querySelector("#choose-export-format")
      .value;
    settings.packageName = packageName;
    settings.exportFormat = exportFormat;
    2;
    storedDesigns.settings = settings;
    storeProject();
    showCurrentDesign();
  };
};

const toggleXMLMode = () => {
  const editorEl = $("#xml-editor");
  if (currentMode !== "XML") {
    currentMode = "XML";
    editorEl.style.display = "block";
    editorEl.innerHTML = "";
    // eslint-disable-next-line no-undef
    const ta = document.createElement("text-area");

    editorEl.appendChild(ta);
    htmlEditor = CodeMirror(ta, {
      mode: "text/xml",
      theme: "tomorrow-night-eighties",
      extraKeys: { "Ctrl-Space": "autocomplete" },
      lineNumbers: true
    });
    htmlEditor.getDoc().setValue(ATIRToXML(currentDesign.tree));
    htmlEditor.on("change", () => {
      window.requestAnimationFrame(() => {
        const newDesign = {
          css: currentDesign.css,
          tree: XMLToATIR(htmlEditor.getDoc().getValue())
        };
        showNewDesign(newDesign);
      });
    });
  } else {
    currentMode = "Visual";
    editorEl.style.display = "none";
  }
};

/**
 * Installs handlers for mouse events on various parts of the UI
 */
const installUIEventHandlers = () => {
  const outline = getOutlineElement();
  outline.ondragover = placeMarker;
  outline.onclick = selectElement;
  const paper = getPaperElement();
  paper.ondragover = placeMarker;
  paper.onclick = selectElement;
  const marker = $("#marker");
  marker.ondrop = dropElement;
  marker.ondragover = placeMarker;
  document.body.ondragend = hideMarkers;
  const attributes = $("#attributes");
  attributes.oninput = updateAttributes;
  $("#target-route").onchange = updateAttributes;
  $("#field-name").oninput = updateAttributes;

  $("#save-design").onclick = saveDesign;
  $("#choose-design").onchange = loadSelectedDesign;
  $("#export-design").onclick = exportDesign;
  $("#import-file").onclick = importRawModel;
  $("#sketch-design").onclick = switchToSketchMode;
  $("#delete-design").onclick = deleteDesign;
  $("#new-design").onclick = newDesign;
  $("#share-designs").onclick = shareDesigns;
  $("#project-settings").onclick = showProjectSettings;
  $("#html-mode").onclick = toggleXMLMode;

  $("#css-rule-filter").oninput = () => {
    setupCssRules($("#css-rule-filter").value);
  };

  textEditor.on("change", () => {
    const el = paper.shadowRoot.querySelector("style");
    if (el) {
      const css = textEditor.getValue();
      el.textContent = css;
      currentDesign.css = css;
    }
  });

  let showingEditor = false;
  let lastLine = 0;

  textEditor.on("cursorActivity", () => {
    const el = document.getElementById("element-preview");
    const pos = textEditor.getCursor();
    let line = textEditor.getLine(pos.line);
    const pieces = line.split(":");
    const prop = pieces[0].trim();
    if (pieces.length > 1) {
      if (cssPropertyTypes.size.includes(prop)) {
        if (!showingEditor || lastLine !== pos.line) {
          showingEditor = true;
          lastLine = pos.line;
          el.innerHTML = '<input type="range" id="somerange"></input>';
          el.style.display = "block";
          el.style.top = pos.line + 4 + "rem";
          el.style.left = pos.ch + "rem";
          const rangeEl = document.getElementById("somerange");
          rangeEl.oninput = () => {
            line = textEditor.getLine(pos.line);
            const end = { line: pos.line, ch: line.length };
            const beginning = { line: pos.line, ch: 0 };
            let newContent;
            if (/[0-9]+/.test(line)) {
              newContent = line.replace(/[0-9]+/, rangeEl.value);
            } else {
              newContent = line.replace(
                /:[ ]*[0-9]*[ ]*;?/,
                ": " + rangeEl.value + "px;"
              );
            }
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
          const parent = document.getElementById("color-picker");
          new Picker({
            parent: parent,
            color: pieces[1].replace(";", ""),
            onChange: color => {
              const newLine = textEditor.getLine(pos.line);
              const end = { line: pos.line, ch: newLine.length };
              const beginning = { line: pos.line, ch: 0 };
              const newContent = newLine.replace(
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
          const choices = cssPropertyTypes.finite[prop];
          showingEditor = true;
          lastLine = pos.line;
          el.innerHTML = '<select id="finite-select"></select>';
          el.style.display = "block";
          el.style.top = pos.line + 4 + "rem";
          el.style.left = pos.ch + "rem";
          const parent = document.getElementById("finite-select");
          choices.forEach(choice => {
            const opt = document.createElement("option");
            opt.textContent = choice;
            parent.appendChild(opt);
          });

          parent.onchange = () => {
            const newLine = textEditor.getLine(pos.line);
            const end = { line: pos.line, ch: newLine.length };
            const beginning = { line: pos.line, ch: 0 };
            const newContent = newLine.replace(
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
      const newDesign = {
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
  const shared = window.location.href.split("share=")[1];
  if (shared) {
    storedDesigns = JSON.parse(atob(shared));
  } else if (window.Unide && window.Unide.inElectron) {
    storedDesigns = JSON.parse(window.Unide.loadState());
  } else if (window.Unide && window.Unide.inVSCode) {
    storedDesigns = JSON.parse(atob(window.Unide.state));
  } else {
    const designsStr =
      localStorage.getItem("unide.project") || '{"designs": {}}';
    storedDesigns = JSON.parse(designsStr);
  }
};

const inWeb = () => {
  return !window.Unide || !(window.Unide.inVSCode || window.Unide.inElectron);
};

const setDemoDesigns = () => {
  if (inWeb() && !localStorage.getItem("unide.project")) {
    localStorage.setItem("unide.project", JSON.stringify(demoDesigns));
  }
};

const setupTextEditor = () => {
  // eslint-disable-next-line no-undef
  textEditor = CodeMirror($("#text-editor"), {
    mode: "text/css",
    theme: "tomorrow-night-eighties",
    extraKeys: { "Ctrl-Space": "autocomplete" }
  });
};

const insertCssAtCursor = cssText => {
  const pos = textEditor.getCursor();
  textEditor.replaceRange(cssText, pos);
};

const setupCssRules = filter => {
  const el = $("#css-rules");
  el.innerHTML = "";
  Object.keys(cssProperties).forEach(key => {
    if (!filter || key.includes(filter)) {
      const header = document.createElement("h2");
      header.textContent = key;
      el.appendChild(header);
      cssProperties[key].forEach(propName => {
        const div = document.createElement("div");
        div.textContent = propName;
        div.onclick = () => {
          insertCssAtCursor(propName + ":");
        };
        div.oncontextmenu = event => {
          window.open(
            `https://developer.mozilla.org/en-US/docs/Web/CSS/${propName}`,
            "_blank"
          );
          event.preventDefault();
          event.stopPropagation();
        };
        el.appendChild(div);
      });
    }
  });
};

const initializePaper = () => {
  getPaperElement().attachShadow({ mode: "open" });
};

const initDesigner = () => {
  setDemoDesigns();
  getStoredDesigns();
  setupTextEditor();
  setupCssRules();
  populatePalette();
  populateDesignSelectors();
  initializePaper();
  initializeDesign();
  installUIEventHandlers();
  installKeyboardHandlers();
  showCurrentDesign();
};

initDesigner();
