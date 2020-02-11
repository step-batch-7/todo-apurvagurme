const generateTaskHtml = function(task) {
  const status = task.status === true ? 'checked' : '';
  return `
    <div class="cbDiv" id=${task.id}>
    <input type="checkbox" onclick="toggleTaskStatus(event)" class="cb" ${status}>
    <input class="titleInputBox" type="text" onkeydown="renameTask(event)" value="${task.name}">
    <img class="remove" onclick="deleteTask(event)" src="./images/cross.svg" />
    </div>`;
};

const generateTodoHtml = function(todo) {
  const tasks = todo.tasks.map(generateTaskHtml).join('\n');
  return`
    <div id=${todo.id} class='task'>
    <div class="titleOfTodo">
    <input class="titleInputBox" type="text" value="${todo.title}" onkeydown="renameTodo(event)">
    <div> 
    <img class="removeTodo" onclick="deleteTodo(event)" src="./images/dustbin.svg">
    </div>
    </div>
    <p><div class='scrollTasks'>${tasks}</div></p>
    <div>
    <input class='subtaskInput' type='text' onkeydown="addTask(event)" placeholder="Add subtask">
    </div>
    </div>`;
};

const renderTodoCollection = function(todoList) {
  const list = JSON.parse(todoList);
  const html = list.map(generateTodoHtml).join('\n');
  const container = document.getElementById('todoListContainer');
  container.innerHTML = html;
};

const loadAllTodoLists = function() {
  sendGetReq('/todoList', renderTodoCollection);
};
