
const sessions = require('./sessionManager');

const serveDataOnSuccess = function (isActionPerformed, res, todoList, next){
  if(isActionPerformed){
    res.json(todoList);
    return;
  }
  next();
};

const registerNewUser = function(req, res){
  const {userName, password} = req.body;
  const usersInfo = req.app.locals.usersData;
  usersInfo[userName] = {password};
  req.app.locals.saveUsersInfo();
  res.redirect('login.html');
};

const login = function(req, res){
  const {userName, password} = req.body;
  const usersInfo = req.app.locals.usersData;
  if(!usersInfo[userName] || usersInfo[userName].password !== password){
    res.redirect('login.html');
    return;
  }
  const id = sessions.addSession(userName);
  res.cookie('_SID', `${id}`);
  res.redirect('index.html');
};

const verifyPageAccess = function(req, res, next){
  if(sessions.isValidSId(req.cookies._SID)){
    return next();
  }
  res.redirect('login.html');
};

const checkAuthorization = function(req, res, next){
  if(sessions.isValidSId(req.cookies._SID)){
    return next();
  }
  res.status(401).end();
};

const getUserName = function(req){
  return sessions.getSessionAttribute(req.cookies._SID, 'userName');
};

const serveSavedTodoList = function(req, res) {
  const userTodoList = req.app.locals.allTodoData[getUserName(req)];
  res.json(userTodoList);
};

const addTodo = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isAdded = userTodoList && userTodoList.addTodo(req.body.todoTitle);
  serveDataOnSuccess(isAdded, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const renameTodo = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTodoRenamed = userTodoList && userTodoList.renameTodo(req.body.todoId, req.body.todoTitle);
  serveDataOnSuccess(isTodoRenamed, res, userTodoList, next);
  req.app.locals.saveAllTodoData;
};

const deleteTodo = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTodoDeleted = userTodoList && userTodoList.deleteTodo(req.body.todoId);
  serveDataOnSuccess(isTodoDeleted, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const addTask = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isTaskAdded = userTodoList && userTodoList.addTask(req.body.todoId, req.body.taskName);
  serveDataOnSuccess(isTaskAdded, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const renameTask = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const {newName, taskId, todoId} = req.body;
  const isTaskRenamed = userTodoList && userTodoList.renameTask(taskId, newName, todoId);
  serveDataOnSuccess(isTaskRenamed, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const toggleTaskStatus = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isToggled = userTodoList && userTodoList.toggleTaskStatus(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isToggled, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const deleteTask = function(req, res, next) {
  const allUsersTodoList = req.app.locals.allTodoData;
  const userTodoList = allUsersTodoList[getUserName(req)];
  const isDeleted = userTodoList && userTodoList.deleteTask(req.body.taskId, req.body.todoId);
  serveDataOnSuccess(isDeleted, res, userTodoList, next);
  req.app.locals.saveAllTodoData();
};

const validateFields = function(...fields){
  return function(req, res, next){
    if(typeof req.body === 'object' && fields.every(field => field in req.body)){
      return next();
    }
    res.status(400).end();
  };
};

module.exports = { validateFields, verifyPageAccess, serveSavedTodoList, registerNewUser, login, addTodo, renameTodo, deleteTodo, addTask, renameTask, toggleTaskStatus, deleteTask, checkAuthorization };
