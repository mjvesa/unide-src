/**
 * @jest-environment jest-environment-webdriver
 *
 * @group selenium
 */

import { exportAllDeclaration } from "@babel/types";

const url = "http://localhost:5000";

test("Can enter settigns page", async () => {
  await browser.get(url);
  await await browser.findElement(by.id("project-settings")).click();
  const paperShadow = await await browser
    .findElement(by.id("visual-editor"))
    .getProperty("shadowRoot");
  const packageName = await paperShadow
    .findElement(by.id("target-folder"))
    .getAttribute("value");
  expect(packageName).toEqual("unide.app");
});

test("Can exit settings page via cancel", async (done) => {
  await browser.get(url);
  await await browser.findElement(by.id("project-settings")).click();
  const paperShadow = await await browser
    .findElement(by.id("visual-editor"))
    .getProperty("shadowRoot");
  await await paperShadow.findElement(by.id("settings-cancel")).click();
  try {
    await paperShadow.findElement(by.id("target-folder"));
  } catch (e) {
    done();
  }
});

test("Can exit settings page via save", async (done) => {
  await browser.get(url);
  await await browser.findElement(by.id("project-settings")).click();
  const paperShadow = await await browser
    .findElement(by.id("visual-editor"))
    .getProperty("shadowRoot");
  await await paperShadow.findElement(by.id("settings-save")).click();
  try {
    await paperShadow.findElement(by.id("target-folder"));
  } catch (e) {
    done();
  }
});
