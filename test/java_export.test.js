const esmImport = require("esm")(module);
// const java = esmImport("../src/export/java.js");
import { kebabToPascalCase, modelToJava } from "../src/export/java.js";

test("Kebab to pascal case", () => {
  expect(kebabToPascalCase("my-kebab-case")).toBe("MyKebabCase");
});

test("Java export simple design", () => {
  const div = document.createElement("div");
  const exportedJava = modelToJava(
    "TestDesign",
    "test-design",
    "my.test.package",
    ["div", "(", "textContent", "some text content", "=", ")"]
  );

  expect(exportedJava).toContain("package my.test.package;");
  expect(exportedJava).toContain(
    '_div.getElement().setText("some text content");'
  );
  expect(exportedJava).toContain("new TestDesignAux(this);");
});
