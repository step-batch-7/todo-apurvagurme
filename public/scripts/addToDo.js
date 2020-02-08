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
  const deleted = `id=${event.target.parentElement.id}`;
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

const saveNewTodo = function() {
  let title;
  if (event.key == 'Enter') {
    title = event.target.value;
    event.target.value = '';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/newTodo', false);
    xhr.send(`title=${title}`);
    load();
  }
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

const editSubtask = function() {
  if (event.key === 'Enter') {
    const subtask = `subtask=${event.target.value}`;
    const subtaskId = `todoId=${event.target.parentElement.id}`;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveSubTask', false);
    xhr.send(`${subtask}&${subtaskId}`);
    load();
  }
};

const saveSubTask = function(event) {
  if (event.key === 'Enter') {
    const newTitle = `title=${event.target.value}`;
    const titleId = `id=${event.target.id}`;
    const parentId = `todoId=${event.target.parentElement.id}`;
    event.target.focus();
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/saveSubTask', false);
    xhr.send(`${newTitle}&${titleId}&${parentId}`);
    load();
  }
};

const addSubtask = function() {
  if (event.key == 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const subtask = event.target.value;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/addSubtask', false);
    xhr.send(`subtask=${subtask}&id=${id}`);
    load();
  }
};

const main = function() {
  addItem();
  addTodo();
};
