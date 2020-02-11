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
  sendDataToServer('/toggleTaskStatus', {id}, renderTodoCollection);
};

const deleteSubtask = function() {
  const id = event.target.parentElement.id;
  sendDataToServer('/deleteSubtask', {id}, renderTodoCollection);
};

const deleteTodo = function() {
  const id = event.target.parentElement.parentElement.parentElement.id;
  sendDataToServer('/deleteTodo', {id}, renderTodoCollection);
};

const saveNewTodo = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    event.target.value = '';
    sendDataToServer('/newTodo', {title}, renderTodoCollection);
  }
};

const saveNewTitle = function() {
  if (event.key === 'Enter') {
    const title = event.target.value;
    const id = event.target.parentElement.parentElement.id;
    sendDataToServer('/saveNewTitle', {title, id}, renderTodoCollection);
  }
};

const editSubtask = function() {
  if (event.key === 'Enter') {
    const subtask = event.target.value;
    const id = event.target.parentElement.id;
    sendDataToServer('/saveSubTask', {subtask, id}, renderTodoCollection);
  }
};

const addSubtask = function() {
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

const searchSubtask = function() {
  const requiredSubtask = event.target.value;
  sendDataToServer('/searchSubtasks', {subtask: requiredSubtask}, renderTodoCollection);
};

const main = function() {
  addItem();
  addTodo();
};
