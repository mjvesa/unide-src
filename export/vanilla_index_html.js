export const getIndexHTML = views => {
  let imports = "";

  views.forEach(viewName => {
    imports = imports.concat(`import './${viewName}';`);
  });

  return `<html>
<head>
    <title>UniDe VanillaJS</title>
    <script src='./node_modules/universal-router/universal-router.js'></script>
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
window.UniDe.route('login-view');
</script>
</body>
</html>`;
};
