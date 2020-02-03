const fs = require('fs');
const { App } = require('./app');
const app = new App();
const queryString = require('querystring');
const statusCode = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const [, extension] = url.split('.');
  return CONTENT_TYPES[extension];
};

const notFound = function(req, res) {
  res.setHeader(statusCode.notFound);
  res.end('Not Found');
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    req.body = queryString.parse(data);
    next();
  });
};

const separateSubtasks = function(subTasks) {
  let count = 1;
  if (typeof subTasks == 'string') {
    return [subTasks];
  }
  const tasks = subTasks.map(subTask => {
    const id = count++;
    return {
      id,
      subTask
    };
  });
  return tasks;
};

const serveAddTodoPage = function(req, res, next) {
  const path = `${__dirname}/../todoData.json`;
  let fileContent = require(path);
  let todo = {};
  todo.id = new Date().getTime();
  todo.title = req.body.title;
  todo.subTasks = separateSubtasks(req.body.task);
  fileContent.unshift(todo);
  const newTodo = JSON.stringify(fileContent);
  fs.writeFileSync(path, newTodo, 'utf8');
  res.writeHead(statusCode.redirection, { location: '/index.html' });
  res.end();
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

app.use(readBody);
app.get('', serveStaticPage);
app.get('', notFound);
app.post('', serveAddTodoPage);
app.post('', notFound);

module.exports = { app };
