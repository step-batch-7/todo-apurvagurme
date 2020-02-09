const getSubTasks = function(tasks) {
  const subTasks = tasks.map(task => {
    let status;
    task.status === true ? (status = 'checked') : (status = '');
    return `
    <div class="cbDiv" id=${task.subtaskID}>
    <input type="checkbox" onclick="onCheck(event)" class="cb" ${status}>
    <input class="titleInputBox" type="text" onkeydown="editSubtask(event)" value="${task.subTask}">
    <img class="remove" onclick="deleteSubtask(event)" src="./images/cross.svg" />
    </div>
    <br>`;
  });
  return subTasks.join('\n');
};

const toHTML = function(taskTemplate, todo) {
  let subtasks = '';
  if (todo.tasks) {
    subtasks = getSubTasks(todo.tasks);
  }
  taskTemplate += `
  <div id=${todo.id} class='task'>
  <div class="titleOfTodo">
  <input class="titleInputBox" type="text" value="${todo.title}" onkeydown="saveNewTitle(event)">
  <div> 
  <img class="removeTodo" onclick="deleteTodo(event)" src="./images/dustbin.svg">
  </div>
  </div>
  <p><div class='scrollTasks'>${subtasks}</div></p>
  <div>
  <input class='subtaskInput' type='text' onkeydown="addSubtask(event)" placeholder="Add subtask">
  </div>
  </div>`;
  return taskTemplate;
};

const createTasksTemplate = function(todoList) {
  const list = JSON.parse(todoList);
  const html = list.todoRecords.reduce(toHTML, '');
  const container = document.getElementById('todos');
  container.innerHTML = html;
};

const load = function() {
  sendGetReq('/todoList', createTasksTemplate);
};
