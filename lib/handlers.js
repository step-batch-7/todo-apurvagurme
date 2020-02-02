const { App } = require('./app');
const app = new App();

const statusCode = require('./statusCode');
const STATIC_FOLDER = `${__dirname}/../public`;
const fs = require('fs');
const CONTENT_TYPES = require('./contentType');

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const [, extension] = url.split('.');
  return CONTENT_TYPES[extension];
};

const notFound = function(req, res) {
  res.setHeader(statusCode.notFound);
  res.end('Not Found');
};

const serveStaticPage = function(req, res, next) {
  if (req.url === '/') {
    req.url = '/index.html';
  }
  const path = `${STATIC_FOLDER}${req.url}`;
  const status = getStatus(path);
  if (!status || !status.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(req.url);
  res.writeHead(statusCode.ok, { 'Content-Type': contentType, 'Content-Length': content.length });
  res.end(content);
};

app.get('', serveStaticPage);
app.get('', notFound);

module.exports = { app };
