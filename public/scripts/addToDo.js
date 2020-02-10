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

const onCheck = function() {
  const id = event.target.parentElement.id;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleTaskStatus', false);
  xhr.send(JSON.stringify({id}));
};

const deleteSubtask = function() {
  const id = event.target.parentElement.id;
  sendPostReq('/deleteSubtask', JSON.stringify({id}), renderTodoCollection);
};

const deleteTodo = function() {
  const id = event.target.parentElement.parentElement.parentElement.id;
  sendPostReq('/deleteTodo', JSON.stringify({id}), renderTodoCollection);
};

const saveNewTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendPostReq('/newTodo', JSON.stringify({title}), renderTodoCollection);
  }
};

const saveNewTitle = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    const id = event.target.parentElement.parentElement.id;
    sendPostReq('/saveNewTitle', JSON.stringify({title, id}), renderTodoCollection);
  }
};

const editSubtask = function() {
  if (event.key === 'Enter') {
    const subtask = event.target.value;
    const id = event.target.parentElement.id;
    sendPostReq('/saveSubTask', JSON.stringify({subtask, id}), renderTodoCollection);
  }
};

const addSubtask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const subtask = event.target.value;
    sendPostReq('/addSubtask', JSON.stringify({id, subtask}), renderTodoCollection);
  }
};

const searchTodo = function() {
  const requiredText = event.target.value;
  sendPostReq('/searchTodo', JSON.stringify({title: requiredText}), renderTodoCollection);
};

const searchSubtask = function() {
  const requiredSubtask = event.target.value;
  sendPostReq('/searchSubtasks', JSON.stringify({subtask: requiredSubtask}), renderTodoCollection);
};

const main = function() {
  addItem();
  addTodo();
};
