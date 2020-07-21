/**
 *  @group unit
 */
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
    "",
    ["div", "(", "textContent", "some text content", "=", ")"]
  );

  expect(exportedJava).toContain("package my.test.package;");
  expect(exportedJava).toContain(
    '_div.getElement().setText("some text content");'
  );
  expect(exportedJava).toContain("new TestDesignAux(this);");
  expect(exportedJava).toContain('@Route("TestDesign")');
});

test("Java export simple design with app layout", () => {
  const div = document.createElement("div");
  const exportedJava = modelToJava(
    "TestDesign",
    "test-design",
    "my.test.package",
    "com.example.pack.MyAppLayout",
    ["div", "(", "textContent", "some text content", "=", ")"]
  );

  expect(exportedJava).toContain(
    '@Route(value = "TestDesign", layout = MyAppLayout.class)'
  );
  expect(exportedJava).toContain("import com.example.pack.MyAppLayout;");
});

test("Grid content generated without entity", () => {
  const div = document.createElement("div");
  const exportedJava = modelToJava(
    "TestDesign",
    "test-design",
    "my.test.package",
    "com.example.pack.MyAppLayout",
    [
      "unide-grid",
      "(",
      "columnNames",
      "some text content",
      "=",
      "items",
      "",
      ")",
    ]
  );

  expect(exportedJava).toContain(
    '@Route(value = "TestDesign", layout = MyAppLayout.class)'
  );
  expect(exportedJava).toContain("import com.example.pack.MyAppLayout;");
});
test("Entity results in no grid content", () => {});
