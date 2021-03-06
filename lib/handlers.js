
const sessions = require('./sessions');
const {TodoList} = require('../lib/todoList');

const serveDataOnSuccess = function (isActionPerformed, res, todoList, next){
  if(isActionPerformed){
    res.json(todoList);
    return;
  }
  res.sendStatus(406);
};

const isValidCredentials = function(userName, password, usersData){
  const allUserNames = Object.keys(usersData);
  const isValidUserName = /[A-Za-z0-9]{3,}/.test(userName) && !allUserNames.includes(userName);
  const isValidPassword = /.{4,}/.test(password);
  return isValidUserName && isValidPassword;
};

const isUserNameUniq = function(req, res){
  const allUserNames = Object.keys(req.app.locals.usersData);
  res.json({isUniq: !allUserNames.includes(req.body.entered)});
};

const registerNewUser = function(req, res){
  const {userName, password} = req.body;
  if(!isValidCredentials(userName, password, req.app.locals.usersData)){
    return res.sendStatus(406);
  }
  req.app.locals.allTodoLists[userName] = new TodoList();
  req.app.locals.usersData[userName] = {password};
  req.app.locals.saveAllTodoLists();
  req.app.locals.saveUsersData();
  res.cookie('_SID', `${sessions.addSession(userName)}`);
  res.redirect('index.html');
};

const login = function(req, res){
  const {userName, password} = req.body;
  const userInfo = req.app.locals.usersData[userName];
  const isSuccessful = Boolean(userInfo) && userInfo.password === password;
  isSuccessful && res.cookie('_SID', `${sessions.addSession(userName)}`);
  res.json({isSuccessful});
};

const logout = function(req, res){
  sessions.clearSession(req.cookies._SID);
  res.end();
};

const needsAuthentication = function(req, res, next){
  if(sessions.isValidSId(req.cookies._SID)){
    return next();
  }
  res.redirect('login.html');
};

const authorize = function(req, res, next){
  if(!sessions.isValidSId(req.cookies._SID)){
    return res.status(401).end();
  }
  req.userName = sessions.getSessionAttribute(req.cookies._SID, 'userName');
  req.userTodoList = req.app.locals.allTodoLists[req.userName];
  next();
};

const serveUserName = function(req, res, next){
  res.json({userName: req.userName});
};

const serveSavedTodoList = function(req, res) {
  res.json(req.userTodoList);
};

const addTodo = function(req, res, next) {
  const {todoTitle} = req.body;
  const isAdded = req.userTodoList.addTodo(todoTitle);
  serveDataOnSuccess(isAdded, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const renameTodo = function(req, res, next) {
  const {todoTitle, todoId} = req.body;
  const isTodoRenamed = req.userTodoList.renameTodo(todoId, todoTitle);
  serveDataOnSuccess(isTodoRenamed, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const deleteTodo = function(req, res, next) {
  const {todoId} = req.body;
  const isTodoDeleted = req.userTodoList.deleteTodo(todoId);
  serveDataOnSuccess(isTodoDeleted, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const addTask = function(req, res, next) {
  const {todoId, taskName} = req.body;
  const isTaskAdded = req.userTodoList.addTask(todoId, taskName);
  serveDataOnSuccess(isTaskAdded, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const renameTask = function(req, res, next) {
  const {newName, taskId, todoId} = req.body;
  const isTaskRenamed = req.userTodoList.renameTask(taskId, newName, todoId);
  serveDataOnSuccess(isTaskRenamed, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const toggleTaskStatus = function(req, res, next) {
  const {taskId, todoId} = req.body;
  const isToggled = req.userTodoList.toggleTaskStatus(taskId, todoId);
  serveDataOnSuccess(isToggled, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const deleteTask = function(req, res, next) {
  const {taskId, todoId} = req.body;
  const isDeleted = req.userTodoList.deleteTask(taskId, todoId);
  serveDataOnSuccess(isDeleted, res, req.userTodoList, next);
  req.app.locals.saveAllTodoLists();
};

const validateFields = function(...fields){
  return function(req, res, next){
    if(typeof req.body === 'object' && fields.every(field => field in req.body)){
      return next();
    }
    res.status(400).end();
  };
};

module.exports = { 
  validateFields, 
  needsAuthentication, 
  serveSavedTodoList, 
  registerNewUser, 
  login, 
  addTodo, 
  renameTodo, 
  deleteTodo, 
  addTask, 
  renameTask, 
  toggleTaskStatus, 
  deleteTask, 
  authorize,
  logout,
  isUserNameUniq,
  serveUserName };
