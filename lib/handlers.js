const fs = require('fs');

const { App } = require('./app');
const { TodoList } = require('./todoList');
const readBody = require('./bodyReader');

const STATUS_CODE = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const SessionManager = require('./sessionManager');
const STATIC_FOLDER = `${__dirname}/../public`;
const { DATA_STORE_PATH, USERS_INFO_PATH } = require('../config');

const sessions = new SessionManager();

const isValidFile = path => fs.existsSync(path) && fs.statSync(path).isFile();

const getMIMEType = function(url) {
  const extension = url.split('.').pop();
  return CONTENT_TYPES[extension];
};

const redirect = function(res, path){
  res.setHeader('location', path);
  res.statusCode = 302;
  res.end();
};

const loadUsersInfo = function(){
  if(!isValidFile(USERS_INFO_PATH)){
    return {};
  }
  return JSON.parse(fs.readFileSync(USERS_INFO_PATH, 'UTF8'));
};

const saveUsersInfo = function(usersInfo){
  fs.writeFileSync(USERS_INFO_PATH, JSON.stringify(usersInfo));
};

const loadSavedRecords = function() {
  if(!isValidFile(DATA_STORE_PATH)){
    return TodoList.load([]);
  }
  const savedData = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'UTF8'));
  return TodoList.load(savedData);
};

const saveAndSendTodoList = function(res, todoList) {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList, null, 2));
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todoList));
};

const serveDataOnSuccess = function (isActionPerformed, res, todoList, next){
  if(isActionPerformed){
    return saveAndSendTodoList(res, todoList);
  }
  next();
};

const registerNewUser = function(req, res){
  const {userName, password} = req.body;
  const usersInfo = loadUsersInfo();
  usersInfo[userName] = {password};
  saveUsersInfo(usersInfo);
  redirect(res, 'login.html');
};

const login = function(req, res){
  const {userName, password} = req.body;
  const usersInfo = loadUsersInfo();
  if(usersInfo[userName] && usersInfo[userName].password === password){
    const id = sessions.addSession(userName);
    res.setHeader('Set-Cookie', `_SID=${id}`);
    redirect(res, 'index.html');
    return;
  }
  redirect(res, 'login.html');
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

const renameTodo = function(req, res, next) {
  const todoList = loadSavedRecords();
  const isTodoRenamed = todoList.renameTodo(req.body.todoId, req.body.todoTitle);
  serveDataOnSuccess(isTodoRenamed, res, todoList, next);
};

const deleteTodo = function(req, res, next) {
  const todoList = loadSavedRecords();
  const isTodoDeleted = todoList.deleteTodo(req.body.todoId);
  serveDataOnSuccess(isTodoDeleted, res, todoList, next);
};

const addTask = function(req, res, next) {
  const todoList = loadSavedRecords();
  const isTaskAdded = todoList.addTask(req.body.todoId, req.body.taskName);
  serveDataOnSuccess(isTaskAdded, res, todoList, next);
};

const renameTask = function(req, res, next) {
  const {newName, taskId, todoId} = req.body;
  const todoList = loadSavedRecords();
  const isTaskRenamed = todoList.renameTask(taskId, newName, todoId);
  serveDataOnSuccess(isTaskRenamed, res, todoList, next);
};

const toggleTaskStatus = function(req, res, next) {
  const todoList = loadSavedRecords();
  const isToggled = todoList.toggleTaskStatus(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isToggled, res, todoList, next);
};

const deleteTask = function(req, res, next) {
  const todoList = loadSavedRecords();
  const isDeleted = todoList.deleteTask(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isDeleted, res, todoList, next);
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
app.post('/signUp', validateFields('userName', 'password'), registerNewUser);
app.post('/login', validateFields('userName', 'password'), login);
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
