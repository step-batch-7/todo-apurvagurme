const fs = require('fs');
const { TodoList } = require('./todoList');

const CONTENT_TYPES = require('./contentType');
const sessions = require('./sessionManager');
const { DATA_STORE_PATH, USERS_INFO_PATH } = require('../config');

const isValidFile = path => fs.existsSync(path) && fs.statSync(path).isFile();

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
    return {};
  }
  const records = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'UTF8'));
  Object.entries(records).forEach(([user, todoList]) => {
    records[user] = TodoList.load(todoList);
  });
  return records;
};

const saveAllUsersTodoList = function(todoList) {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(todoList, null, 2));
};

const serveDataOnSuccess = function (isActionPerformed, res, todoList, next){
  if(isActionPerformed){
    res.setHeader('Content-Type', CONTENT_TYPES.json);
    res.end(JSON.stringify(todoList));
    return;
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

const verifyPageAccess = function(req, res, next){
  const sessionId = req.cookies._SID;
  if(sessions.isValidSId(sessionId)){
    return next();
  }
  redirect(res, 'login.html');
};

const getUserName = function(req){
  return sessions.getSessionAttribute(req.cookies._SID, 'userName');
};

const serveSavedTodoList = function(req, res) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(userTodoList));
};

const addTodo = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isAdded = userTodoList && userTodoList.addTodo(req.body.todoTitle);
  serveDataOnSuccess(isAdded, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const renameTodo = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTodoRenamed = userTodoList && userTodoList.renameTodo(req.body.todoId, req.body.todoTitle);
  serveDataOnSuccess(isTodoRenamed, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const deleteTodo = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTodoDeleted = userTodoList && userTodoList.deleteTodo(req.body.todoId);
  serveDataOnSuccess(isTodoDeleted, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const addTask = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTaskAdded = userTodoList && userTodoList.addTask(req.body.todoId, req.body.taskName);
  serveDataOnSuccess(isTaskAdded, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const renameTask = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const {newName, taskId, todoId} = req.body;
  const isTaskRenamed = userTodoList && userTodoList.renameTask(taskId, newName, todoId);
  serveDataOnSuccess(isTaskRenamed, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const toggleTaskStatus = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isToggled = userTodoList && userTodoList.toggleTaskStatus(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isToggled, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
};

const deleteTask = function(req, res, next) {
  const allUsersTodoList = loadSavedRecords();
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isDeleted = userTodoList && userTodoList.deleteTask(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isDeleted, res, userTodoList, next);
  saveAllUsersTodoList(allUsersTodoList);
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

module.exports = { validateFields, verifyPageAccess, serveSavedTodoList, registerNewUser, login, addTodo, renameTodo, deleteTodo, addTask, renameTask, toggleTaskStatus, deleteTask };
