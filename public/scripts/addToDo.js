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
  const clickedCb = `id=${event.target.parentElement.id}`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/toggleTaskStatus', false);
  xhr.send(clickedCb);
};

const deleteSubtask = function() {
  const deleted = `id=${event.target.parentElement.id}`;
  sendPostReq('/deleteSubtask', deleted, loadAllTodoLists);
};

const deleteTodo = function() {
  const deleted = `id=${event.target.parentElement.parentElement.parentElement.id}`;
  sendPostReq('/deleteTodo', deleted, loadAllTodoLists);
};

const saveNewTodo = function() {
  // look back
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendPostReq('/newTodo', `title=${title}`, loadAllTodoLists);
  }
};

const saveNewTitle = function() {
  if (event.key === 'Enter') {
    const newTitle = `title=${event.target.value}`;
    const titleId = `id=${event.target.parentElement.parentElement.id}`;
    sendPostReq('/saveNewTitle', `${newTitle}&${titleId}`, loadAllTodoLists);
  }
};

const editSubtask = function() {
  if (event.key === 'Enter') {
    const subtask = `subtask=${event.target.value}`;
    const subtaskId = `todoId=${event.target.parentElement.id}`;
    sendPostReq('/saveSubTask', `${subtask}&${subtaskId}`, loadAllTodoLists);
  }
};

const addSubtask = function() {
  if (event.key === 'Enter') {
    const id = event.target.parentElement.parentElement.id;
    const subtask = event.target.value;
    sendPostReq('/addSubtask', `subtask=${subtask}&id=${id}`, loadAllTodoLists);
  }
};

const searchTodo = function() {
  const requiredText = event.target.value;
  sendPostReq('/searchTodo', `title=${requiredText}`, displaySearched);
};

const searchSubtask = function() {
  const requiredSubtask = event.target.value;
  sendPostReq('/searchSubtasks', `subtask=${requiredSubtask}`, displaySearched);
};

//look back
const main = function() {
  addItem();
  addTodo();
};
