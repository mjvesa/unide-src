export const getIndexHTML = views => {
  let imports = "";

  views.forEach(viewName => {
    imports = imports.concat(`import './${viewName}';`);
  });

  return `<html>
<head>
    <title>UniDe Project</title>
    <script src='./node_modules/universal-router/universal-router.js'></script>
    <script src="./node_modules/@vaadin/vaadin-lumo-styles/color.js" type="module"></script>
    <script src="./node_modules/@vaadin/vaadin-lumo-styles/sizing.js" type="module"></script>
    <script src="./node_modules/@vaadin/vaadin-lumo-styles/spacing.js" type="module"></script>
    <script src="./node_modules/@vaadin/vaadin-lumo-styles/style.js" type="module"></script>
    <script src="./node_modules/@vaadin/vaadin-lumo-styles/typography.js" type="module"></script>
</head>
<body>
<div id="content"></div>

<script type="module">
${imports}

const routes = [];
${JSON.stringify(views)}.forEach( viewName => {
  routes.push({path: '/' + viewName, action: () => \`<\${viewName}></\${viewName}>\`});
});
const router = new window.UniversalRouter(routes)
window.UniDe = {};
window.UniDe.route = (viewName) => {
    router.resolve('/'+viewName).then(html => {
        document.getElementById('content').innerHTML = html;
    });
};
window.UniDe.route('${views[0]}');
</script>
</body>
</html>`;
};
