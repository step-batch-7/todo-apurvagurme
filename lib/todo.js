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
    <div style="padding-left: 20px;">${task.subTask}
    <input type="checkbox">
    </div>
    <br>`
  );
  return subTasks.join('\n');
};

class Todo {
  constructor(title, tasks, status) {
    this.title = title;
    this.tasks = tasks;
    this.status = status;
  }

  toHTML() {
    let subtasks = 'no subtasks';
    if (this.tasks) {
      subtasks = getSubTasks(this.tasks);
    }
    return `
    <div class='task' style="margin: 10px;">
    <p>Title: ${this.title}</p>
    <p>Tasks: ${subtasks}</p>
    </div>`;
  }
}

class TodoList {
  constructor(todoRecords) {
    this.todoRecords = todoRecords;
    this.subTask = this.getSubTaskId();
    this.id = this.getNextId();
  }

  getSubTaskId() {
    const lastTask = this.todoRecords[0];
    let lastSubTaskId = 0;
    // if (this.subTask.id)
    if (lastTask) {
      lastSubTaskId = lastTask.id;
    }
    return `${lastSubTaskId + 1}`;
  }

  getNextId() {
    return this.todoRecords.length + 1;
  }
}

module.exports = { Todo, TodoList };
