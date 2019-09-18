const fs = require("fs");

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

window.Unide = {};
window.Unide.inElectron = true;
window.Unide.saveFile = (fileName, content) => {
  const directory = fileName.substring(0, fileName.lastIndexOf("/"));
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.writeFileSync(fileName, content);
};
window.Unide.loadState = () => {
  let state = '{"designs": [] }';
  if (fs.existsSync("./src/main/resources/unide_state.json")) {
    state = fs.readFileSync("./src/main/resources/unide_state.json", "utf8");
  }
  return state;
};

window.Unide.saveState = state => {
  if (!fs.existsSync("./src/main/resources")) {
    fs.mkdirSync("./src/main/resources", { recursive: true });
  }
  fs.writeFileSync("./src/main/resources/unide_state.json", state);
};
