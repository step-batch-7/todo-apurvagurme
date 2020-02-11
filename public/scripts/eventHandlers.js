/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendDataToServer('/addTodo', {title}, renderTodoCollection);
  }
};

const renameTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    const id = event.target.parentElement.parentElement.id;
    sendDataToServer('/renameTodo', {title, id}, renderTodoCollection);
  }
};

const deleteTodo = function() {
  const id = event.target.parentElement.parentElement.parentElement.id;
  sendDataToServer('/deleteTodo', {id}, renderTodoCollection);
};

const addTask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const task = event.target.value;
    sendDataToServer('/addTask', {id, subtask: task}, renderTodoCollection);
  }
};

const renameTask = function() {
  if (event.key === 'Enter') {
    const task = event.target.value;
    const id = event.target.parentElement.id;
    const [todoId] = id.split('_');
    sendDataToServer('/renameTask', {subtask: task, id, todoId}, renderTodoCollection);
  }
};

const toggleTaskStatus = function() {
  const id = event.target.parentElement.id;
  const [todoId] = id.split('_');
  sendDataToServer('/toggleTaskStatus', {id, todoId}, renderTodoCollection);
};

const deleteTask = function() {
  const id = event.target.parentElement.id;
  const [todoId] = id.split('_');
  sendDataToServer('/deleteTask', {id, todoId}, renderTodoCollection);
};

const searchTodo = function() {
  const requiredText = event.target.value;
  sendDataToServer('/searchTodo', {title: requiredText}, renderTodoCollection);
};

const searchTask = function() {
  const requiredSubtask = event.target.value;
  sendDataToServer('/searchTask', {subtask: requiredSubtask}, renderTodoCollection);
};

const toggleSearchAction = function(checkbox) {
  checkbox.checked && (searchBar.oninput = searchTask);
  !checkbox.checked && (searchBar.oninput = searchTodo);
};