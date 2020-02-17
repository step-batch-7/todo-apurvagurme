const getAllTodo = () => Array.from(document.querySelectorAll('.todo'));
const getTodoTitle = todo => todo.querySelector('.titleInputBox').innerText;

const getAllTasks = () => Array.from(document.querySelectorAll('.taskDiv'));
const getTaskName = task => task.querySelector('p').innerText;

const isMatchedTodo = function(searchKeyword, todo){
  return getTodoTitle(todo).includes(searchKeyword);
};

const isMatchedTask = function(searchKeyword, task){
  return getTaskName(task).includes(searchKeyword);
};

const searchTodo = function() {
  const searchKeyword = searchBar.value;
  const allTodo = getAllTodo();
  allTodo.forEach(todo => todo.classList.add('hidden'));
  const matchedTodoList = allTodo.filter(isMatchedTodo.bind(null, searchKeyword));
  matchedTodoList.forEach(todo => todo.classList.remove('hidden'));
};

const searchTask = function() {
  const searchKeyword = searchBar.value;
  const allTasks = getAllTasks();
  allTasks.forEach(task => task.classList.add('hidden'));
  const matchedTasks = allTasks.filter(isMatchedTask.bind(null, searchKeyword));
  matchedTasks.forEach(task => task.classList.remove('hidden'));
};

const clearAllSearch = function(){
  searchBar.value = '';
  searchTodo();
  searchTask();
};

const toggleSearchAction = function(checkbox) {
  clearAllSearch();
  if(checkbox.checked){
    searchBar.oninput = searchTask;
    searchBar.placeholder = '🔍 Search Task';
  }else{
    searchBar.oninput = searchTodo;
    searchBar.placeholder = '🔍 Search Todo';
  }
};
