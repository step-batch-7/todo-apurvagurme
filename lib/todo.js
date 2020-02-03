const getSubTasks = function(tasks) {
  const subTasks = tasks.map(task => `<div style="padding-left: 20px;">${task.subTask}</div><br>`);
  return subTasks.join('\n');
};

class Todo {
  constructor(title, tasks) {
    this.title = title;
    this.tasks = tasks;
  }

  toHTML() {
    const subtasks = getSubTasks(this.tasks);
    return `
    <div class='task'>
    <p>Title: ${this.title}</p>
    <p>Tasks: ${subtasks}</p>
    </div>`;
  }
}

module.exports = Todo;
