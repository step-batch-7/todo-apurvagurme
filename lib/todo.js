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

module.exports = Todo;
