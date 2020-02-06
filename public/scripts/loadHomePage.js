const getSubTasks = function(tasks) {
  const subTasks = tasks.map(task => {
    let status;
    task.status === true ? (status = 'checked') : (status = '');
    return `
    <div style="padding-left: 20px; class="cbDiv">${task.subTask}
    <input type="checkbox" onclick="onCheck(event)" class="cb" value=${task.id} ${status}>
     <img class="remove" onclick="deleteSubtask(event)" src="./images/remove.svg" id=${task.id} ${status}/>
    </div>
    <br>`;
  });
  return subTasks.join('\n');
};

const toHTML = function(context, todo) {
  let subtasks = 'no subtasks';
  if (todo.tasks) {
    subtasks = getSubTasks(todo.tasks);
  }
  context += `
    <div id=${todo.id} class='task' style="margin: 10px;">
    <img class="remove" onclick="deleteTodo(event)" src="./images/remove.svg" id=${todo.id}>
    <p>Title: ${todo.title}</p>
    <p>Tasks: ${subtasks}</p>
    </div>`;
  return context;
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
