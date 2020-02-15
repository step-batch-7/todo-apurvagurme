/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    event.target.value = '';
    sendDataToServer('/user/addTodo', {todoTitle}, renderTodoList);
  }
};

const renameTodo = function(todoId) {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    sendDataToServer('/user/renameTodo', {todoTitle, todoId}, renderTodoList);
  }
};

const deleteTodo = function(todoId) {
  sendDataToServer('/user/deleteTodo', {todoId}, renderTodoList);
};

const addTask = function(todoId) {
  if (event.key === 'Enter') {
    const taskName = event.target.value;
    sendDataToServer('/user/addTask', {todoId, taskName}, renderTodoList);
  }
};

const renameTask = function(taskId) {
  if (event.key === 'Enter') {
    const newName = event.target.value;
    const [todoId] = taskId.split('_');
    sendDataToServer('/user/renameTask', {newName, taskId, todoId}, renderTodoList);
  }
};

const toggleTaskStatus = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/user/toggleTaskStatus', {taskId, todoId}, renderTodoList);
};

const deleteTask = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/user/deleteTask', {taskId, todoId}, renderTodoList);
};
