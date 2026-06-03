const { Router } = require('express');
const openApiDocument = require('../../docs/openapi');

const router = Router();

function renderSwaggerHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trainly API Docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      body { margin: 0; background: #f6f8f7; }
      .topbar { display: none; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        persistAuthorization: true,
      });
    </script>
  </body>
</html>`;
}

function renderReDocHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trainly API Reference</title>
    <style>
      body { margin: 0; }
    </style>
  </head>
  <body>
    <redoc spec-url="/openapi.json"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`;
}

router.get('/openapi.json', (req, res) => {
  res.json(openApiDocument);
});

router.get('/docs', (req, res) => {
  res.type('html').send(renderSwaggerHtml());
});

router.get('/redoc', (req, res) => {
  res.type('html').send(renderReDocHtml());
});

router.get('/docs.json', (req, res) => {
  res.json({
    name: openApiDocument.info.title,
    version: openApiDocument.info.version,
    openapi: '/openapi.json',
    swaggerUi: '/docs',
    redoc: '/redoc',
  });
});

module.exports = router;
