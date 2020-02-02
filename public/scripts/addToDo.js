let taskId = 1;
let subTaskId = 1;

const getTaskId = () => taskId++;
const getSubTaskId = () => subTaskId++;

const addTodo = function() {
  const task = document.createElement('div');
  task.className = 'task';
  task.id = getTaskId();
  const taskBar = document.getElementById('taskBar');
  taskBar.appendChild(task);
};

const addItem = function() {
  const subTask = document.createElement('textarea');
  subTask.className = 'subTask';
  subTask.id = getSubTaskId();
  const subTaskBar = document.getElementById('subTasks');
  subTaskBar.appendChild(subTask);
};

const deleteItem = function() {
  const subtasks = document.querySelector('#subTasks');
  console.log(subtasks);
  subtasks.removeChild(subtasks.lastChild);
};
