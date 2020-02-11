/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const toggleTaskStatus = function() {
  const id = event.target.parentElement.id;
  sendDataToServer('/toggleTaskStatus', {id}, renderTodoCollection);
};

const deleteTask = function() {
  const id = event.target.parentElement.id;
  sendDataToServer('/deleteSubtask', {id}, renderTodoCollection);
};

const deleteTodo = function() {
  const id = event.target.parentElement.parentElement.parentElement.id;
  sendDataToServer('/deleteTodo', {id}, renderTodoCollection);
};

const addTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendDataToServer('/newTodo', {title}, renderTodoCollection);
  }
};

const renameTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    const id = event.target.parentElement.parentElement.id;
    sendDataToServer('/saveNewTitle', {title, id}, renderTodoCollection);
  }
};

const renameTask = function() {
  if (event.key === 'Enter') {
    const subtask = event.target.value;
    const id = event.target.parentElement.id;
    sendDataToServer('/saveSubTask', {subtask, id}, renderTodoCollection);
  }
};

const addTask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const subtask = event.target.value;
    sendDataToServer('/addSubtask', {id, subtask}, renderTodoCollection);
  }
};

const searchTodo = function() {
  const requiredText = event.target.value;
  sendDataToServer('/searchTodo', {title: requiredText}, renderTodoCollection);
};

const searchTask = function() {
  const requiredSubtask = event.target.value;
  sendDataToServer('/searchSubtasks', {subtask: requiredSubtask}, renderTodoCollection);
};

const toggleSearchAction = function(checkbox) {
  checkbox.checked && (searchBar.oninput = searchTask);
  !checkbox.checked && (searchBar.oninput = searchTodo);
};
