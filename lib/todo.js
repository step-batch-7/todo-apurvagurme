const { TodoList } = require('./todoList');

const getSubTasks = function(tasks) {
  if (tasks.length === 1) {
    return `
    <div style="padding-left: 20px;">${tasks[0].subTasks}
    <input type="checkbox">
    </div>
    <br>`;
  }
  const subTasks = tasks.map(
    task => `
    <div id=${task.id} style="padding-left: 20px;">${task.subTask}
    <input type="checkbox">
    </div>
    <br>`
  );
  return subTasks.join('\n');
};

const separateSubtasks = function(subTasks, todoList) {
  let count = 0;
  let id = `${todoList.getSubTaskId()}_${count}`;
  if (typeof subTasks == 'string') {
    return [{ id, subTasks }];
  }
  let tasks = subTasks.map(subTask => {
    id = `${todoList.getSubTaskId()}_${count}`;
    count++;
    return { id, subTask };
  });
  return tasks;
};

class Todo {
  constructor({ title, tasks, status, id }) {
    this.title = title;
    this.tasks = tasks;
    this.status = status;
    this.id = id;
  }

  toHTML() {
    let subtasks = 'no subtasks';
    if (this.tasks) {
      subtasks = getSubTasks(this.tasks);
    }
    return `
    <div id=${this.id} class='task' style="margin: 10px;">
    <p>Title: ${this.title}</p>
    <p>Tasks: ${subtasks}</p>
    </div>`;
  }

  static getTodo(body, todoData) {
    const todoList = new TodoList(todoData);
    const id = todoList.getNextId();
    const title = body.title;
    const status = false;
    let tasks;
    if (body.task) {
      tasks = separateSubtasks(body.task, todoList);
    }
    const todoInstance = new Todo({ id, title, status, tasks });
    return todoInstance;
  }
}

module.exports = { Todo };
