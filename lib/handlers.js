const fs = require('fs');

const { App } = require('./app');
const { TodoList } = require('./todoList');

const STATUS_CODE = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;
const { DATA_STORE_PATH } = require('../config');

const isValidFile = path => fs.existsSync(path) && fs.statSync(path).isFile();

const getMIMEType = function(url) {
  const extension = url.split('.').pop();
  return CONTENT_TYPES[extension];
};

const loadSavedRecords = function() {
  let savedData = [];
  if(isValidFile(DATA_STORE_PATH)){
    savedData = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'UTF8'));
  }
  return TodoList.load(savedData);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    if(req.headers['content-type'] === CONTENT_TYPES.json) {
      req.body = JSON.parse(data);
    } 
    next();
  });
};

const saveAndSendTodoList = function(res, todoList) {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList, null, 2));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const serveStaticPage = function(req, res, next) {
  const path = `${STATIC_FOLDER}${req.url === '/' ? '/index.html' : req.url}`;
  if (!isValidFile(path)) {
    return next();
  }
  res.setHeader('Content-Type', getMIMEType(path));
  res.end(fs.readFileSync(path));
};

const serveSavedTodoList = function(req, res) {
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(loadSavedRecords()));
};

const addTodo = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.addTodo(req.body.todoTitle);
  saveAndSendTodoList(res, todoList);
};

const renameTodo = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.renameTodo(req.body.todoId, req.body.todoTitle);
  saveAndSendTodoList(res, todoList);
};

const deleteTodo = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.deleteTodo(req.body.todoId);
  saveAndSendTodoList(res, todoList);
};

const addTask = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.addTask(req.body.todoId, req.body.taskName);
  saveAndSendTodoList(res, todoList);
};

const renameTask = function(req, res) {
  const {newName, taskId, todoId} = req.body;
  const todoList = loadSavedRecords();
  todoList.renameTask(taskId, newName, todoId);
  saveAndSendTodoList(res, todoList);
};

const toggleTaskStatus = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.toggleTaskStatus(req.body.taskId, req.body.todoId);
  saveAndSendTodoList(res, todoList);
};

const deleteTask = function(req, res) {
  const todoList = loadSavedRecords();
  todoList.deleteTask(req.body.taskId, req.body.todoId);
  saveAndSendTodoList(res, todoList);
};

const notFound = function(req, res) {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>Not Found</h1></body></html>');
};

const methodNotAllowed = function(req, res) {
  res.statusCode = STATUS_CODE.methodNotAllowed;
  res.setHeader('Content-Type', CONTENT_TYPES.html);
  res.end('<html><body><h1>Method Not Allowed</h1></body></html>');
};

const validateFields = function(...fields){
  return function(req, res, next){
    if(typeof req.body === 'object' && fields.every(field => field in req.body)){
      return next();
    }
    res.statusCode = 400;
    res.end();
  };
};

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.get('/todoList', serveSavedTodoList);
app.get('', notFound);
app.post('/addTodo', validateFields('todoTitle'), addTodo);
app.post('/renameTodo', validateFields('todoId', 'todoTitle'), renameTodo);
app.post('/deleteTodo', validateFields('todoId'), deleteTodo);
app.post('/addTask', validateFields('todoId', 'taskName'), addTask);
app.post('/renameTask', validateFields('todoId', 'taskId', 'newName'), renameTask);
app.post('/toggleTaskStatus', validateFields('todoId', 'taskId'), toggleTaskStatus);
app.post('/deleteTask', validateFields('todoId', 'taskId'), deleteTask);
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
