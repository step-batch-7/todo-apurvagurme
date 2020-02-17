/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    event.target.value = '';
    sendDataToServer('/user/addTodo', {todoTitle}, renderTodoList);
  }
};

const renameTodo = function(titleElement, todoId) {
  const todoTitle = titleElement.innerText;
  sendDataToServer('/user/renameTodo', {todoTitle, todoId}, renderTodoList);
};

const deleteTodo = function(todoId) {
  confirm('Your Todo will be deleted Permanently') && sendDataToServer('/user/deleteTodo', {todoId}, renderTodoList);
};

const addTask = function(todoId) {
  if (event.key === 'Enter') {
    const taskName = event.target.value;
    sendDataToServer('/user/addTask', {todoId, taskName}, renderTodoList);
  }
};

const renameTask = function(taskElement, taskId) {
  const newName = taskElement.innerText;
  const [todoId] = taskId.split('_');
  sendDataToServer('/user/renameTask', {newName, taskId, todoId}, renderTodoList);
};

const toggleTaskStatus = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/user/toggleTaskStatus', {taskId, todoId}, renderTodoList);
};

const deleteTask = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/user/deleteTask', {taskId, todoId}, renderTodoList);
};

const logout = function(){
  document.cookie = '_SID=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  sendDataToServer('/logout', undefined, () => {
    location.assign('login.html');
  });
};

const blurOnEnter = function(element){
  event.key === 'Enter' && element.blur();
};
