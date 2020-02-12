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
  if(!isValidFile(DATA_STORE_PATH)){
    return[];
  }
  return JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'UTF8'));
};

const todoList = TodoList.load(loadSavedRecords());

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

const saveAndSendTodoList = function(res) {
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
  res.end(JSON.stringify(todoList));
};

const addTodo = function(req, res) {
  todoList.addTodo(req.body.todoTitle);
  saveAndSendTodoList(res);
};

const renameTodo = function(req, res) {
  todoList.renameTodo(req.body.todoId, req.body.todoTitle);
  saveAndSendTodoList(res);
};

const deleteTodo = function(req, res) {
  todoList.deleteTodo(req.body.todoId);
  saveAndSendTodoList(res);
};

const addTask = function(req, res) {
  todoList.addTask(req.body.todoId, req.body.taskName);
  saveAndSendTodoList(res);
};

const renameTask = function(req, res) {
  const {newName, taskId, todoId} = req.body;
  todoList.renameTask(taskId, newName, todoId);
  saveAndSendTodoList(res);
};

const toggleTaskStatus = function(req, res) {
  todoList.toggleTaskStatus(req.body.taskId, req.body.todoId);
  saveAndSendTodoList(res);
};

const deleteTask = function(req, res) {
  todoList.deleteTask(req.body.taskId, req.body.todoId);
  saveAndSendTodoList(res);
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
app.post('', notFound);
app.use(methodNotAllowed);

module.exports = { app };
