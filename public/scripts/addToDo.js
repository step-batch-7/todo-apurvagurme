const addTodo = function() {
  const task = document.createElement('div');
  task.className = 'task';
  const taskBar = document.getElementById('taskBar');
  taskBar.appendChild(task);
};

const addItem = function() {
  const subTask = document.createElement('textarea');
  subTask.className = 'subTask';
  subTask.name = 'task';
  const subTaskBar = document.getElementById('subTasks');
  subTaskBar.appendChild(subTask);
};

const deleteItem = function() {
  const subtasks = document.querySelector('#subTasks');
  subtasks.removeChild(subtasks.lastChild);
};

const onCheck = function(event) {
  const clickedCb = `id=${event.target.value}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleTaskStatus', false);
  xhr.send(clickedCb);
};

const deleteSubtask = function(event) {
  const deleted = `id=${event.target.id}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteSubtask', false);
  xhr.send(deleted);
  load();
};

const deleteTodo = function(event) {
  const deleted = `id=${event.target.id}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteTodo', false);
  xhr.send(deleted);
  load();
};

const main = function() {
  addItem();
  addTodo();
};
