const generateTaskHtml = function(task) {
  const status = task.status === true ? 'checked' : '';
  const taskHtml = document.createElement('div');
  taskHtml.className = 'taskDiv';
  taskHtml.id = task.id;
  taskHtml.innerHTML = `
      <input type="checkbox" oninput="toggleTaskStatus('${task.id}')" id="cb${task.id}" class="taskCheckBox" ${status}>
      <label for="cb${task.id}"><div></div></label>
      <p contenteditable=true onkeydown="blurOnEnter(this)" onblur="renameTask(this,'${task.id}')"></p>
      <img onclick="deleteTask('${task.id}')" src="images/cross.svg" />`;
  taskHtml.children[2].innerText = task.name;
  return taskHtml;
};

const generateTodoHtml = function(todo) {
  const tasks = todo.tasks.map(generateTaskHtml);
  const todoHtml = document.createElement('div');
  todoHtml.className = 'todo';
  todoHtml.id = todo.id;
  todoHtml.innerHTML = `
      <div class="todoTitle">
        <h3 class="titleInputBox" contenteditable=true onkeydown="blurOnEnter(this)" 
          onblur="renameTodo(this,'${todo.id}')">${todo.title}</h3>
        <img class="removeTodo" onclick="deleteTodo('${todo.id}')" src="./images/dustbin.svg">
      </div>
      <div class='tasksContainer'></div>
      <input class='subtaskInput' type='text' onkeydown="addTask('${todo.id}')" placeholder="New Task">`;
  tasks.forEach(task => todoHtml.children[1].append(task));
  return todoHtml;
};

const renderTodoList = function(todoList) {
  const list = JSON.parse(todoList);
  const todoHtmls = list.map(generateTodoHtml);
  const container = document.getElementById('todoListContainer');
  container.innerHTML = '';
  todoHtmls.forEach(todo => container.append(todo));
};

const loadAllTodoLists = function() {
  getDataFromServer('/user/todoList', renderTodoList);
};
