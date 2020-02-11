/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const addTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendDataToServer('/addTodo', {title}, renderTodoList);
  }
};

const renameTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    const id = event.target.parentElement.parentElement.id;
    sendDataToServer('/renameTodo', {title, id}, renderTodoList);
  }
};

const deleteTodo = function() {
  const id = event.target.parentElement.parentElement.parentElement.id;
  sendDataToServer('/deleteTodo', {id}, renderTodoList);
};

const addTask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const task = event.target.value;
    sendDataToServer('/addTask', {id, subtask: task}, renderTodoList);
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
  const id = event.target.parentElement.id;
  const [todoId] = id.split('_');
  sendDataToServer('/toggleTaskStatus', {id, todoId}, renderTodoList);
};

const deleteTask = function() {
  const id = event.target.parentElement.id;
  const [todoId] = id.split('_');
  sendDataToServer('/deleteTask', {id, todoId}, renderTodoList);
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
