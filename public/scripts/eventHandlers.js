/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    event.target.value = '';
    sendDataToServer('/addTodo', {todoTitle}, renderTodoList);
  }
};

const renameTodo = function() {
  if (event.key === 'Enter') {
    const todoTitle = event.target.value;
    const todoId = event.target.parentElement.parentElement.id;
    sendDataToServer('/renameTodo', {todoTitle, id: todoId}, renderTodoList);
  }
};

const deleteTodo = function() {
  const todoId = event.target.parentElement.parentElement.parentElement.id;
  sendDataToServer('/deleteTodo', {todoId}, renderTodoList);
};

const addTask = function() {
  if (event.key === 'Enter') {
    const todoId = event.target.parentElement.parentElement.id;
    const taskName = event.target.value;
    sendDataToServer('/addTask', {todoId, taskName}, renderTodoList);
  }
};

const renameTask = function() {
  if (event.key === 'Enter') {
    const newName = event.target.value;
    const taskId = event.target.parentElement.id;
    const [todoId] = taskId.split('_');
    sendDataToServer('/renameTask', {newName, taskId, todoId}, renderTodoList);
  }
};

const toggleTaskStatus = function() {
  const taskId = event.target.parentElement.id;
  const [todoId] = taskId.split('_');
  sendDataToServer('/toggleTaskStatus', {id: taskId, todoId}, renderTodoList);
};

const deleteTask = function() {
  const taskId = event.target.parentElement.id;
  const [todoId] = taskId.split('_');
  sendDataToServer('/deleteTask', {id: taskId, todoId}, renderTodoList);
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
