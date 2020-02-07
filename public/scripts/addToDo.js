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
  subTask.required;
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

const edit = function(event) {
  const [, , header, list] = event.path;
  const [, title] = header.innerText.split(': ');
  const id = list.id;
};

const saveNewTitle = function(event) {
  let newTitle;
  let titleId;
  if (event.key == 'Enter') {
    newTitle = `title=${event.target.value}`;
    titleId = `id=${event.target.id}`;
  }
  if (newTitle) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveNewTitle', false);
    xhr.send(`${newTitle}&${titleId}`);
    load();
  }
};

const sendEditReq = function() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/deleteSubtask', false);
  xhr.send();
  load();
};

const main = function() {
  addItem();
  addTodo();
};
