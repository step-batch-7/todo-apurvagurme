const generateTaskHtml = function(task) {
  const status = task.status === true ? 'checked' : '';
  return `
    <div class="cbDiv" id=${task.id}>
    <input type="checkbox" onclick="toggleTaskStatus('${task.id}')" class="cb" ${status}>
    <input class="taskName" type="text" onkeydown="renameTask('${task.id}')" value="${task.name}">
    <img class="remove" onclick="deleteTask('${task.id}')" src="./images/cross.svg" />
    </div>`;
};

const generateTodoHtml = function(todo) {
  const tasks = todo.tasks.map(generateTaskHtml).join('\n');
  return`
    <div id=${todo.id} class='task'>
    <div class="titleOfTodo">
    <input class="titleInputBox" type="text" value="${todo.title}" onkeydown="renameTodo('${todo.id}')">
    <div> 
    <img class="removeTodo" onclick="deleteTodo('${todo.id}')" src="./images/dustbin.svg">
    </div>
    </div>
    <p><div class='scrollTasks'>${tasks}</div></p>
    <div>
    <input class='subtaskInput' type='text' onkeydown="addTask('${todo.id}')" placeholder="Add subtask">
    </div>
    </div>`;
};

const renderTodoList = function(todoList) {
  const list = JSON.parse(todoList);
  const html = list.map(generateTodoHtml).join('\n');
  const container = document.getElementById('todoListContainer');
  container.innerHTML = html;
};

const loadAllTodoLists = function() {
  getDataFromServer('/todoList', renderTodoList);
};
