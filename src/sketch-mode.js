let $;

const ipsumLorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum".split(
  " "
);

const childOf = (rectA, rectB) => {
  return (
    rectA.left > rectB.left &&
    rectA.top > rectB.top &&
    rectA.right < rectB.right &&
    rectA.bottom < rectB.bottom
  );
};

const isSquarish = rect => {
  const ratio = (rect.right - rect.left) / (rect.bottom - rect.top);
  return ratio > 0.7 && ratio < 1.3;
};

const isCheckBox = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;

  return (
    isSquarish(rect) &&
    !rect.children &&
    w < 30 &&
    h < 30 &&
    (!rect.text || rect.text.includes("x"))
  );
};

const isRadioButton = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;

  return (
    isSquarish(rect) &&
    !rect.children &&
    w < 30 &&
    h < 30 &&
    rect.text &&
    rect.text.includes("o")
  );
};

const isRadioGroup = rect => {
  if (!rect.children) {
    return false;
  }
  let result = true;
  rect.children.forEach(rect => {
    if (!isRadioButton(rect)) {
      result = false;
    }
  });
  return result;
};

const isCheckBoxGroup = rect => {
  if (!rect.children) {
    return false;
  }
  let result = true;
  rect.children.forEach(rect => {
    if (!isCheckBox(rect)) {
      result = false;
    }
  });
  return result;
};

const isSpan = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h > 2 && h < 100 && rect.text && rect.text.includes("#");
};

const isButton = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h > 2 && w < 150 && h < 100 && !rect.children;
};

const isSelect = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return (
    w / h > 2 && w > 150 && h < 100 && rect.text && rect.text.includes(",")
  );
};

const isGrid = rect => {
  const h = rect.bottom - rect.top;
  return h > 100 && rect.text && rect.text.includes(",");
};

const isComboBox = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h > 2 && h < 100 && rect.text && rect.text.includes(";");
};

const isTextField = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h > 2 && w > 150 && h < 50; // && !rect.children && !rect.text;
};

const isPasswordField = rect => {
  return isTextField(rect) && rect.text && rect.text.includes("*");
};

const isDatePicker = rect => {
  return isTextField(rect) && rect.text && rect.text.includes("$date");
};

const isTimePicker = rect => {
  return isTextField(rect) && rect.text && rect.text.includes("$time");
};

const isNumberField = rect => {
  return isTextField(rect) && rect.text && rect.text.includes("$number");
};

const isEmailField = rect => {
  return isTextField(rect) && rect.text && rect.text.includes("$email");
};

const isVerticalLayout = rect => {
  if (!rect.children || rect.children.length < 2) {
    return false;
  }
  let result = true;
  rect.children.forEach(outer => {
    rect.children.forEach(inner => {
      const hdiff = Math.abs(outer.left - inner.left);
      const vdiff = Math.abs(outer.top - inner.top);
      if (hdiff > vdiff) {
        result = false;
      }
    });
  });

  return result;
};

const isHorizontalLayout = rect => {
  if (!rect.children || rect.children.length < 2) {
    return false;
  }
  let result = true;
  rect.children.forEach(outer => {
    rect.children.forEach(inner => {
      const hdiff = Math.abs(outer.left - inner.left);
      const vdiff = Math.abs(outer.top - inner.top);
      if (hdiff < vdiff) {
        result = false;
      }
    });
  });

  return result;
};

const rectArea = rect => {
  const w = Math.abs(rect.right - rect.left);
  const h = Math.abs(rect.bottom - rect.top);
  return w * h;
};

const pointInsideRect = (rect, x, y) => {
  return x > rect.left && x < rect.right && y > rect.top && y < rect.bottom;
};

const rectsIntersect = (rectA, rectB) => {
  return (
    pointInsideRect(rectA, rectB.left, rectB.top) ||
    pointInsideRect(rectA, rectB.right, rectB.top) ||
    pointInsideRect(rectA, rectB.right, rectB.bottom) ||
    pointInsideRect(rectA, rectB.left, rectB.bottom)
  );
};

const getSmallestRect = rects => {
  let smallestArea = rectArea(rects[0]);
  let smallest = rects[0];
  rects.forEach(rect => {
    if (rectArea(rect) < smallestArea) {
      smallestArea = rectArea(rect);
      smallest = rect;
    }
  });
  return smallest;
};

const isSplitLayout = rect => {
  if (!rect.children || rect.children.length !== 3) {
    return false;
  }

  const smallest = getSmallestRect(rect.children);
  const others = rect.children.filter(rect => rect !== smallest);

  return (
    rectsIntersect(others[0], smallest) && rectsIntersect(others[1], smallest)
  );
};

const isTabs = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h > 2 && rect.text && rect.text.includes("|");
};

const isGridLayout = rect => {
  return rect.children && rect.children.length > 1 ? true : false;
};

const heuristics = [
  [isSpan, "span"],
  [isButton, "vaadin-button"],
  [isRadioButton, "vaadin-radio-button"],
  [isCheckBox, "vaadin-checkbox"],
  [isRadioGroup, "vaadin-radio-group"],
  [isCheckBoxGroup, "vaadin-checkbox-group"],
  [isPasswordField, "vaadin-password-field"],
  [isSelect, "vaadin-select"],
  [isComboBox, "vaadin-combo-box"],
  [isDatePicker, "vaadin-date-picker"],
  [isTimePicker, "vaadin-time-picker"],
  [isNumberField, "vaadin-number-field"],
  [isEmailField, "vaadin-email-field"],
  [isTabs, "vaadin-tabs"],
  [isTextField, "vaadin-text-field"],
  [isGrid, "unide-grid"],
  [isSplitLayout, "vaadin-split-layout"],
  [isVerticalLayout, "vaadin-vertical-layout"],
  [isHorizontalLayout, "vaadin-horizontal-layout"]
  // [isGridLayout, "grid-layout"]
];

const getTagForRect = rect => {
  for (let i = 0; i < heuristics.length; i++) {
    const heuristic = heuristics[i];
    if (heuristic[0](rect)) {
      return heuristic[1];
    }
  }
  return "div";
};

const createTreeFromRects = rects => {
  const roots = [];
  rects.forEach(rect => {
    let smallestArea = 10000000;
    let potentialParent;
    rects.forEach(parentRect => {
      const area =
        Math.abs(parentRect.right - parentRect.left) *
        Math.abs(parentRect.bottom - parentRect.top);
      if (area < smallestArea && childOf(rect, parentRect)) {
        potentialParent = parentRect;
        smallestArea = area;
      }
    });
    if (potentialParent) {
      const children = potentialParent.children || [];
      children.push(rect);
      potentialParent.children = children;
    } else {
      roots.push(rect);
    }
  });
  return roots;
};

const showCurrentGuess = (rect, rects) => {
  const el = $("#current-guess");
  el.style.display = "inline";
  el.style.top = rect.top - 20 + "px";
  el.style.left = rect.left + "px";

  createTreeFromRects(rects);
  el.textContent = getTagForRect(rect).replace("vaadin-", "");
  rects.forEach(rect => {
    delete rect.children;
  });
};

const hideCurrentGuess = () => {
  $("#current-guess").style.display = "none";
};

const rectRatio = rect => {
  const w = rect.right - rect.left;
  const h = rect.bottom - rect.top;
  return w / h;
};

const createAndAppendChildElements = rects => {
  let tree = [];
  const setAttribute = (name, value) => {
    tree.push(name, value, "=");
  };
  rects.forEach(rect => {
    const children = [];
    let styles = "";
    const tagName = getTagForRect(rect);
    tree.push(tagName);
    tree.push("(");
    if (
      tagName !== "grid-layout" &&
      tagName !== "vaadin-vertical-layout" &&
      tagName !== "vaadin-horizontal-layout"
    ) {
      styles = styles + "margin:0.5em;";
    }

    if (
      tagName === "vaadin-radio-group" ||
      tagName === "vaadin-checkbox-group"
    ) {
      if (rectRatio(rect) < 1) {
        setAttribute("theme", "vertical");
      }
    }

    if (tagName === "vaadin-vertical-layout") {
      rect.children.sort((rectA, rectB) => {
        return rectA.top - rectB.top;
      });
    }

    if (tagName === "vaadin-horizontal-layout") {
      rect.children.sort((rectA, rectB) => {
        return rectA.left - rectB.left;
      });
    }

    if (tagName === "grid-layout") {
      styles = styles + "display:grid;";
      // Sort into left-right and top down order
      rect.children.sort((rectA, rectB) => {
        return (
          rectA.left +
          (rectA.top - rect.top - ((rectA.top - rect.top) % 50)) * 8192 -
          (rectB.left +
            (rectB.top - rect.top - ((rectB.top - rect.top) % 50)) * 8192)
        );
      });
      let columnWidth = 0;
      let maxColumnWidth = 0;
      let previous = rect.children[0];
      rect.children.forEach(rect => {
        if (previous.left > rect.left) {
          if (columnWidth > maxColumnWidth) {
            maxColumnWidth = columnWidth;
          }
          columnWidth = 0;
        }
        columnWidth++;
        previous = rect;
      });
      styles =
        styles + `grid-template-columns:repeat(${maxColumnWidth}, auto);`;
    }

    if (tagName === "vaadin-split-layout") {
      // remove drag handle rect
      const smallest = getSmallestRect(rect.children);
      rect.children = rect.children.filter(rect => rect !== smallest);
      // determine orientation
      const child = rect.children[0];
      if (
        pointInsideRect(child, smallest.left, smallest.top) !==
        pointInsideRect(child, smallest.left, smallest.bottom)
      ) {
        setAttribute("orientation", "vertical");
      }
    }

    // Handle text content in rect
    if (
      rect.text &&
      tagName !== "vaadin-radio-button" &&
      tagName !== "vaadin-checkbox"
    ) {
      if (tagName == "unide-grid") {
        const columns = rect.text.split(",");
        const columnCaptions = [];
        columns.forEach(column => {
          columnCaptions.push({ name: column, path: column });
        });
        setAttribute("columnCaptions", JSON.stringify(columnCaptions));
        const items = [];
        for (let i = 0; i < 10; i++) {
          const item = {};
          columns.forEach(column => {
            item[column] = ipsumLorem[(Math.random() * ipsumLorem.length) | 0];
          });
          items.push(item);
        }
        setAttribute("items", JSON.stringify(items));
      } else if (rect.text.includes(",")) {
        rect.text.split(",").forEach(str => {
          children.push("vaadin-item", "(", "textContent", str, "=", ")");
        });
      } else if (rect.text.includes("|")) {
        rect.text.split("|").forEach(str => {
          children.push("vaadin-tab", "(", "textContent", str, "=", ")");
        });
      } else if (rect.text.includes(";")) {
        setAttribute("items", JSON.stringify(rect.text.split(";")));
      } else {
        setAttribute("textContent", rect.text.replace("#", ""));
      }
    }

    if (styles.length > 0) {
      setAttribute("style", styles);
    }
    if (children.length > 0) {
      tree = tree.concat(children);
    }

    if (rect.children) {
      tree = tree.concat(createAndAppendChildElements(rect.children));
    }
    tree.push(")");
  });
  return tree;
};

const fixZIndexes = rects => {
  const fixInternal = (rects, zIndex) => {
    rects.forEach(rect => {
      if (rect.el) {
        rect.el.style.zIndex = zIndex;
        rect.el.style.backgroundColor = `rgb(${255 - zIndex * 32},${255 -
          zIndex * 32},255)`;

        if (rect.children) {
          fixInternal(rect.children, zIndex + 1);
        }
      }
    });
  };
  fixInternal(rects, 1);
};

export const enterSketchMode = (targetEl, designCallback) => {
  const rects = [];
  let draggedEl;
  let draggedRect = {};
  let originX, originY;
  let focusedElement;

  $ = targetEl.shadowRoot.querySelector.bind(targetEl.shadowRoot);
  targetEl.shadowRoot.innerHTML = `
  <style>
    #sketch-canvas {
        height: 100%;
    }
    #sketch-canvas div {
        border: solid 1px black;
        position: absolute;
      }
    #current-guess {
        display: none;
        position: absolute;
        z-index: 10000;
    }
  </style>
  <span id="current-guess"></span>
  <vaadin-button id="generate-button"><iron-icon icon="vaadin:vaadin-h"></iron-icon></vaadin-button>
  <div id="sketch-canvas"></div>`;

  const canvas = $("#sketch-canvas");
  canvas.onkeypress = event => {
    if (event.key === "Delete") {
      if (focusedElement) {
        rects.remove(focusedElement.rect);
        canvas.removeChild(focusedElement);
      }
    }
  };

  canvas.onmousedown = event => {
    draggedEl = document.createElement("div");
    draggedEl.style.zIndex = 1000;
    draggedRect = { el: draggedEl };

    draggedEl.rect = draggedRect;
    draggedEl.contentEditable = true;
    draggedEl.oninput = event => {
      event.target.rect.text = event.target.textContent;
      showCurrentGuess(event.target.rect, rects);
    };

    draggedEl.onmouseover = event => {
      event.target.focus();
      focusedElement = event.target;
      showCurrentGuess(event.target.rect, rects);
    };

    draggedEl.onmousever = () => {
      hideCurrentGuess();
    };

    originX = event.clientX;
    originY = event.clientY;
    draggedEl.style.position = "absolute";
    draggedEl.style.left = event.clientX + "px";
    draggedEl.style.top = event.clientY + "px";

    canvas.appendChild(draggedEl);
  };

  canvas.onmousemove = event => {
    if (draggedEl) {
      draggedEl.style.width = event.clientX - originX + "px";
      draggedEl.style.height = event.clientY - originY + "px";
      Object.assign(draggedRect, {
        left: originX,
        top: originY,
        right: event.clientX,
        bottom: event.clientY
      });
      showCurrentGuess(draggedRect, rects);
    }
  };

  canvas.onmouseup = () => {
    rects.push(draggedRect);
    draggedEl = undefined;
    hideCurrentGuess();
    fixZIndexes(createTreeFromRects(rects));
  };

  $("#generate-button").onclick = () => {
    hideCurrentGuess();
    const roots = createTreeFromRects(rects);
    designCallback(createAndAppendChildElements(roots));
  };
};
