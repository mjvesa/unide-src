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
  fs.writeFileSync(fileName, content);
};
window.Unide.loadState = () => {
  const state = fs.readFileSync(
    "./src/main/resources/unide_state.json",
    "utf8"
  );
  console.log(state);
  return state;
};

window.Unide.saveState = state => {
  fs.writeFileSync("./src/main/resources/unide_state.json", state);
};
