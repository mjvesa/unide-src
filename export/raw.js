/**
 *  Export raw model as JSON
 */
export let exportToRaw = designs => {
  const json = JSON.stringify(designs);
  saveAs(
    new Blob([json], { type: "text/plain;charset=utf-8" }),
    "raw-designs.json"
  );
};
