const getSubTasks = function(tasks) {
  if (tasks.length === 1) {
    return `
    <div  style="padding-left: 20px; class="cbDiv"">${tasks[0].subTasks}
    <input type="checkbox" onclick="onCheck(event)"
    class="cb" value=${tasks[0].id}>
    </div>
    <br>`;
  }
  const subTasks = tasks.map(
    task => `
    <div style="padding-left: 20px; class="cbDiv">${task.subTask}
    <input type="checkbox" onclick="onCheck(event)" class="cb" value=${task.id}>
    </div>
    <br>`
  );
  return subTasks.join('\n');
};

const toHTML = function(context, todo) {
  let subtasks = 'no subtasks';
  if (todo.tasks) {
    subtasks = getSubTasks(todo.tasks);
  }
  context += `
    <div id=${todo.id} class='task' style="margin: 10px;">
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
