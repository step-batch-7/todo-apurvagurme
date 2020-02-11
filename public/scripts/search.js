const getAllTodo = () => Array.from(document.querySelectorAll('.task'));
const getTodoTitle = todo => todo.querySelector('.titleInputBox').value;

const getAllTasks = () => Array.from(document.querySelectorAll('.cbDiv'));
const getTaskName = task => task.querySelector('.taskName').value;

const isMatchedTodo = function(searchKeyword, todo){
  return getTodoTitle(todo).includes(searchKeyword);
};

const isMatchedTask = function(searchKeyword, task){
  return getTaskName(task).includes(searchKeyword);
};

const searchTodo = function() {
  const searchKeyword = event.target.value;
  const allTodo = getAllTodo();
  allTodo.forEach(todo => todo.classList.add('hidden'));
  const matchedTodoList = allTodo.filter(isMatchedTodo.bind(null, searchKeyword));
  matchedTodoList.forEach(todo => todo.classList.remove('hidden'));
};

const searchTask = function() {
  const searchKeyword = event.target.value;
  const allTasks = getAllTasks();
  allTasks.forEach(task => task.classList.add('hidden'));
  const matchedTasks = allTasks.filter(isMatchedTask.bind(null, searchKeyword));
  matchedTasks.forEach(task => task.classList.remove('hidden'));
};

const toggleSearchAction = function(checkbox) {
  checkbox.checked && (searchBar.oninput = searchTask);
  !checkbox.checked && (searchBar.oninput = searchTodo);
};
