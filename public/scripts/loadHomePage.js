const getSubTasks = function(tasks) {
  const subTasks = tasks.map(task => {
    let status;
    task.status === true ? (status = 'checked') : (status = '');
    return `
    <div style = "padding-left: 5px; display: flex;" class = "cbDiv">
    <input type="checkbox" onclick="onCheck(event)" class="cb" value=${task.id} ${status}>
    ${task.subTask}
    <img class="remove" onclick="deleteSubtask(event)" src="./images/cross.svg" id=${task.id} ${status}/>
    </div>
    <br>`;
  });
  return subTasks.join('\n');
};

const toHTML = function(taskTemplate, todo) {
  let subtasks = 'no subtasks';
  if (todo.tasks) {
    subtasks = getSubTasks(todo.tasks);
  }
  taskTemplate += `
  <div id=${todo.id} class='task' style="margin: 10px;">
  <div class="titleOfTodo">
  <input class="titleInputBox" type="text" value=${todo.title}>
  <div> 
  <img class="saveButton" onclick="saveReq(event)" src="./images/save.png" id=${todo.id}>
  <img class="editTitle" onclick="edit(event)" src="./images/edit.svg" id=${todo.id}>
  <img class="removeTodo" onclick="deleteTodo(event)" src="./images/dustbin.svg" id=${todo.id}>
  </div>
  </div>
  <p><div class='scrollTasks'>${subtasks}</div></p>
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
