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

const onCheck = function(event) {
  const clickedCb = `id=${event.target.parentElement.id}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleTaskStatus', false);
  xhr.send(clickedCb);
};

const deleteSubtask = function(event) {
  const deleted = `id=${event.target.parentElement.id}`;
  sendPostReq('/deleteSubtask', deleted, load);
};

const deleteTodo = function(event) {
  const deleted = `id=${event.target.parentElement.parentElement.parentElement.id}`;
  sendPostReq('/deleteTodo', deleted, load);
};

const saveNewTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendPostReq('/newTodo', `title=${title}`, load);
  }
};

const saveNewTitle = function(event) {
  if (event.key === 'Enter') {
    const newTitle = `title=${event.target.value}`;
    const titleId = `id=${event.target.parentElement.parentElement.id}`;
    sendPostReq('/saveNewTitle', `${newTitle}&${titleId}`, load);
  }
};

const editSubtask = function() {
  if (event.key === 'Enter') {
    const subtask = `subtask=${event.target.value}`;
    const subtaskId = `todoId=${event.target.parentElement.id}`;
    sendPostReq('/saveSubTask', `${subtask}&${subtaskId}`, load);
  }
};

const addSubtask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const subtask = event.target.value;
    sendPostReq('/addSubtask', `subtask=${subtask}&id=${id}`, load);
  }
};

const main = function() {
  addItem();
  addTodo();
};
