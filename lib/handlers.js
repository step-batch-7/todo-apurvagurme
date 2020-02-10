const fs = require('fs');
const queryString = require('querystring');

const { App } = require('./app');
const { Todo } = require('./todo');
const { TodoList } = require('./todoList');

const STATUS_CODE = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;
const { getDataStorePath } = require('../config');
const DATA_STORE = getDataStorePath();

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const [, extension] = url.split('.');
  return CONTENT_TYPES[extension];
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

const serveNewTodo = function(req, res) {
  let id = 0;
  if (todoData[0]) {
    id = todoData[0].id;
  }
  const todo = Todo.getTodo(req.body, id);
  todoList.addTodo(todo);
  const newTodo = JSON.stringify(todoList.todoRecords);
  fs.writeFileSync(DATA_STORE, newTodo, 'utf8');
  res.writeHead(STATUS_CODE.ok);
  res.end();
};

const sendResponse = function(res, statusCode, content, contentType) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(content);
};

const getFileContent = function(path) {
  let content = [];
  if (fs.existsSync(path)) {
    content = JSON.parse(fs.readFileSync(path));
  }
  return content;
};

const todoData = getFileContent(DATA_STORE, 'utf8');
const todoList = TodoList.load(todoData);

const serveStaticPage = function(req, res, next) {
  let path = `${STATIC_FOLDER}${req.url}`;
  if (req.url === '/') {
    path = `${STATIC_FOLDER}/index.html`;
    req.url = '/index.html';
  }
  const status = getStatus(path);
  if (!status || !status.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(req.url);
  sendResponse(res, STATUS_CODE.ok, content, contentType);
};

const serveTodo = function(req, res) {
  res.writeHead(STATUS_CODE.ok, {
    'Content-Type': CONTENT_TYPES.plain
  });
  res.end(JSON.stringify(todoList));
};

const sendResAfterChange = function(res) {
  const records = JSON.stringify(todoList.todoRecords);
  fs.writeFileSync(DATA_STORE, records, 'utf8');
  res.writeHead(STATUS_CODE.ok);
  res.end();
};

const toggleTaskStatus = function(req, res) {
  todoList.getMatchedIdTodo(req.body.id);
  sendResAfterChange(res);
};

const deleteSubtask = function(req, res) {
  todoList.getIdOfDeletedTodo(req.body.id);
  sendResAfterChange(res);
};

const deleteTodo = function(req, res) {
  todoList.deleteTodo(req.body.id);
  sendResAfterChange(res);
};

const notFound = function(req, res) {
  res.writeHead(STATUS_CODE.notFound);
  res.end('Not Found');
};

const saveNewTitle = function(req, res) {
  const todoId = req.body.id;
  todoList.saveNewTitle(todoId, req.body.title);
  sendResAfterChange(res);
};

const saveNewSubtask = function(req, res) {
  const subtask = req.body.subtask;
  const subtaskId = req.body.todoId;
  todoList.changeEditedSubTask(subtaskId, subtask);
  sendResAfterChange(res);
};

const addSubtask = function(req, res) {
  todoList.addSubtask(req.body.id, req.body.subtask);
  sendResAfterChange(res);
};

const serveRequiredTodo = function(req, res) {
  const matchedTodoList = todoList.searchTodo(req.body.title);
  res.writeHead(200);
  res.end(JSON.stringify(matchedTodoList));
};

const serveRequiredSubtask = function(req, res) {
  const matchedTodoList = todoList.searchSubtasks(req.body.subtask);
  res.writeHead(200);
  res.end(JSON.stringify(matchedTodoList));
};

const methodNotAllowed = function(req, res) {
  res.writeHead(STATUS_CODE.methodNotAllowed);
  res.end('Method not allowed');
};

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.get('/todoList', serveTodo);
app.get('', notFound);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/deleteSubtask', deleteSubtask);
app.post('/deleteTodo', deleteTodo);
app.post('/newTodo', serveNewTodo);
app.post('/addSubtask', addSubtask);
app.post('/saveNewTitle', saveNewTitle);
app.post('/saveSubTask', saveNewSubtask);
app.post('/searchTodo', serveRequiredTodo);
app.post('/searchSubtasks', serveRequiredSubtask);
app.use(methodNotAllowed);

module.exports = { app };
