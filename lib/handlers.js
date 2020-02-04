const fs = require('fs');
const { App } = require('./app');
const app = new App();
const queryString = require('querystring');
const statusCode = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;
const TEMPLATE_FOLDER = `${__dirname}/../template`;
const DATA_STORE = `${__dirname}/../todoData.json`;
const todoData = require(DATA_STORE, 'utf8');
const { Todo } = require('./todo');

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const [, extension] = url.split('.');
  return CONTENT_TYPES[extension];
};

const notFound = function(req, res) {
  res.writeHead(statusCode.notFound);
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

const serveAddTodoPage = function(req, res, next) {
  const path = `${__dirname}/../todoData.json`;
  let fileContent = require(path);
  const todo = Todo.getTodo(req.body, todoData);
  fileContent.unshift(todo);
  const newTodo = JSON.stringify(fileContent);
  fs.writeFileSync(path, newTodo, 'utf8');
  res.writeHead(statusCode.redirection, { location: '/index.html' });
  res.end();
};

const sendResponse = function(res, content, contentType, statusCode) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(content);
};

const serveStaticPage = function(req, res, next) {
  const path = `${STATIC_FOLDER}${req.url}`;
  const status = getStatus(path);
  if (!status || !status.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(req.url);
  sendResponse(res, content, contentType, statusCode.ok);
};

const getTodoTemplate = function(todoData) {
  let todos = todoData.map(
    todo => new Todo({ title: todo.title, tasks: todo.tasks, status: todo.status, id: todo.id })
  );
  return todos.map(todo => todo.toHTML()).join('\n');
};

const serveHomePage = function(req, res) {
  const path = `${TEMPLATE_FOLDER}/index.html`;
  const oldContent = fs.readFileSync(path, 'utf8');
  let newTodo = getTodoTemplate(todoData);
  const content = oldContent.replace("__TODO'S__", newTodo);
  sendResponse(res, content, 'html', statusCode.ok);
};

app.use(readBody);
app.get('', serveStaticPage);
app.get('/', serveHomePage);
app.get('', notFound);
app.post('/index.html', serveAddTodoPage);
app.post('', notFound);

module.exports = { app };
