const generateTaskHtml = function(task) {
  const status = task.status === true ? 'checked' : '';
  return `
    <div class="taskDiv" id=${task.id}>
      <input type="checkbox" oninput="toggleTaskStatus('${task.id}')" id="cb${task.id}" class="taskCheckBox" ${status}>
      <label for="cb${task.id}"><div></div></label>
      <p contenteditable=true onkeydown="blurOnEnter(this)" onblur="renameTask(this,'${task.id}')">${task.name}</p>
      <img onclick="deleteTask('${task.id}')" src="images/cross.svg" />
    </div>`;
};

const generateTodoHtml = function(todo) {
  const tasks = todo.tasks.map(generateTaskHtml).join('\n');
  return`
    <div id=${todo.id} class='todo'>
      <div class="todoTitle">
        <h3 class="titleInputBox" contenteditable=true onkeydown="blurOnEnter(this)" 
          onblur="renameTodo(this,'${todo.id}')">${todo.title}</h3>
        <img class="removeTodo" onclick="deleteTodo('${todo.id}')" src="./images/dustbin.svg">
      </div>
      <div class='tasksContainer'>${tasks}</div>
      <input class='subtaskInput' type='text' onkeydown="addTask('${todo.id}')" placeholder="New Task">
    </div>`;
};

const renderTodoList = function(todoList) {
  const list = JSON.parse(todoList);
  const html = list.map(generateTodoHtml).join('\n');
  const container = document.getElementById('todoListContainer');
  container.innerHTML = html;
};

const loadAllTodoLists = function() {
  getDataFromServer('/user/todoList', renderTodoList);
};
