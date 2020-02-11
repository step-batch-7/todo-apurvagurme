const fs = require('fs');

const { App } = require('./app');
const { TodoList } = require('./todoList');

const STATUS_CODE = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;
const { getDataStorePath } = require('../config');
const DATA_STORE = getDataStorePath();

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const extension = url.split('.').pop();
  return CONTENT_TYPES[extension];
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    if(data !== '') {
      req.body = JSON.parse(data);
    } 
    next();
  });
};

const addTodo = function(req, res) {
  todoList.addTodo(req.body.title);
  const newTodo = JSON.stringify(todoList, null, 2);
  fs.writeFileSync(DATA_STORE, newTodo, 'utf8');
  res.writeHead(STATUS_CODE.ok);
  res.end(newTodo);
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

const serveSavedTodoList = function(req, res) {
  res.writeHead(STATUS_CODE.ok, {
    'Content-Type': CONTENT_TYPES.plain
  });
  res.end(JSON.stringify(todoList));
};

const sendResAfterChange = function(res) {
  const records = JSON.stringify(todoList, null, 2);
  fs.writeFileSync(DATA_STORE, records, 'utf8');
  res.writeHead(STATUS_CODE.ok);
  res.end(records);
};

const toggleTaskStatus = function(req, res) {
  todoList.toggleTaskStatus(req.body.id, req.body.todoId);
  sendResAfterChange(res);
};

const deleteTask = function(req, res) {
  todoList.deleteTask(req.body.id, req.body.todoId);
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

const renameTodo = function(req, res) {
  const todoId = req.body.id;
  todoList.renameTodo(todoId, req.body.title);
  sendResAfterChange(res);
};

const renameTask = function(req, res) {
  const subtask = req.body.subtask;
  const subtaskId = req.body.id;
  const todoId = req.body.todoId;
  todoList.renameTask(subtaskId, subtask, todoId);
  sendResAfterChange(res);
};

const addTask = function(req, res) {
  todoList.addTask(req.body.id, req.body.subtask);
  sendResAfterChange(res);
};

const searchTodo = function(req, res) {
  const matchedTodoList = todoList.searchTodo(req.body.title);
  res.writeHead(200);
  res.end(JSON.stringify(matchedTodoList));
};

const searchTask = function(req, res) {
  const matchedTodoList = todoList.searchTasks(req.body.subtask);
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
app.get('/todoList', serveSavedTodoList);
app.get('', notFound);
app.post('/addTodo', addTodo);
app.post('/renameTodo', renameTodo);
app.post('/deleteTodo', deleteTodo);
app.post('/addTask', addTask);
app.post('/renameTask', renameTask);
app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/deleteTask', deleteTask);
app.post('/searchTodo', searchTodo);
app.post('/searchTask', searchTask);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
