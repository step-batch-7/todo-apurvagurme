const getSubTasks = function(tasks) {
  const subTasks = tasks.map(task => {
    //  look back
    let status;
    task.status === true ? status = 'checked' : status = '';
    return `
    <div class="cbDiv" id=${task.subtaskID}>
    <input type="checkbox" onclick="onCheck(event)" class="cb" ${status}>
    <input class="titleInputBox" type="text" onkeydown="editSubtask(event)" value="${task.subTask}">
    <img class="remove" onclick="deleteSubtask(event)" src="./images/cross.svg" />
    </div>`;
  });
  return subTasks.join('\n');
};

const generateTodoHtml = function(todo) {
  return`
  <div id=${todo.id} class='task'>
  <div class="titleOfTodo">
  <input class="titleInputBox" type="text" value="${todo.title}" onkeydown="saveNewTitle(event)">
  <div> 
  <img class="removeTodo" onclick="deleteTodo(event)" src="./images/dustbin.svg">
  </div>
  </div>
  <p><div class='scrollTasks'>${getSubTasks(todo.tasks)}</div></p>
  <div>
  <input class='subtaskInput' type='text' onkeydown="addSubtask(event)" placeholder="Add subtask">
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
