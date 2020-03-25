import { ironIconEditor } from "./dc/editor/iron-icon-editor";
import { vaadinButtonEditor } from "./dc/editor/vaadin-button-editor";
import { vaadinSplitLayoutEditor } from "./dc/editor/vaadin-split-layout-editor";
import { vaadinTabsEditor } from "./dc/editor/vaadin-tabs-editor";
import { vaadinGridEditor } from "./dc/editor/vaadin-grid-editor";
import { vaadinGridColumnEditor } from "./dc/editor/vaadin-grid-column-editor";
import { styleEditor } from "./dc/editor/style-editor";
import { flexboxEditor } from "./dc/editor/flexbox-editor";
import { defaultEditor } from "./dc/editor/default-editor";
import { scriptEditor } from "./dc/editor/script-editor";
import { sizesEditor } from "./dc/editor/sizes-editor";
import { fieldEditor } from "./dc/editor/field-editor";

import { gridUpdaterAction } from "./dc/action/grid-updater-action";
import { rawGridUpdaterAction } from "./dc/action/raw-grid-updater-action";
import { simpleRestAction } from "./dc/action/simple-rest-action";
import { listRestAction } from "./dc/action/list-rest-action";
import { stateAction } from "./dc/action/state-action";
import { elementAppenderAction } from "./dc/action/element-appender-action";
import { eventToValueAction } from "./dc/action/event-to-value-action";
import { gridNewItemEditor } from "./dc/action/grid-new-item-editor";

export const designComponentEditors = [
  ["script", elementAppenderAction],
  ["script", eventToValueAction],
  ["script", gridNewItemEditor],
  ["script", gridUpdaterAction],
  ["script", listRestAction],
  ["script", rawGridUpdaterAction],
  ["script", scriptEditor],
  ["script", stateAction],
  ["script", simpleRestAction],
  ["*", defaultEditor],
  ["*", flexboxEditor],
  ["*", styleEditor],
  ["*", sizesEditor],
  ["vaadin-text-field", fieldEditor],
  ["iron-icon", ironIconEditor],
  ["vaadin-grid", vaadinGridEditor],
  ["vaadin-grid-column", vaadinGridColumnEditor],
  ["vaadin-button", vaadinButtonEditor],
  ["vaadin-split-layout", vaadinSplitLayoutEditor],
  ["vaadin-tabs", vaadinTabsEditor]
];
