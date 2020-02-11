/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    event.target.value = '';
    sendDataToServer('/addTodo', {todoTitle}, renderTodoList);
  }
};

const renameTodo = function(todoId) {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    sendDataToServer('/renameTodo', {todoTitle, todoId}, renderTodoList);
  }
};

const deleteTodo = function(todoId) {
  sendDataToServer('/deleteTodo', {todoId}, renderTodoList);
};

const addTask = function(todoId) {
  if (event.key === 'Enter') {
    const taskName = event.target.value;
    sendDataToServer('/addTask', {todoId, taskName}, renderTodoList);
  }
};

const renameTask = function(taskId) {
  if (event.key === 'Enter') {
    const newName = event.target.value;
    const [todoId] = taskId.split('_');
    sendDataToServer('/renameTask', {newName, taskId, todoId}, renderTodoList);
  }
};

const toggleTaskStatus = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/toggleTaskStatus', {taskId, todoId}, renderTodoList);
};

const deleteTask = function(taskId) {
  const [todoId] = taskId.split('_');
  sendDataToServer('/deleteTask', {taskId, todoId}, renderTodoList);
};

const searchTodo = function() {
  const requiredText = event.target.value;
  sendDataToServer('/searchTodo', {title: requiredText}, renderTodoList);
};

const searchTask = function() {
  const requiredSubtask = event.target.value;
  sendDataToServer('/searchTask', {subtask: requiredSubtask}, renderTodoList);
};

const toggleSearchAction = function(checkbox) {
  checkbox.checked && (searchBar.oninput = searchTask);
  !checkbox.checked && (searchBar.oninput = searchTodo);
};
