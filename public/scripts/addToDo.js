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
