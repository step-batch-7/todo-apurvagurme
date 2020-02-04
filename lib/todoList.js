class TodoList {
  constructor(todoRecords) {
    this.todoRecords = todoRecords;
    this.subTask = this.getSubTaskId();
    this.id = this.getNextId();
  }

  addTodo(todo) {
    this.todoRecords.unshift(todo);
  }

  getSubTaskId() {
    const lastTask = this.todoRecords[0];
    let lastSubTaskId = 0;
    if (lastTask) {
      lastSubTaskId = lastTask.id;
    }
    return `${lastSubTaskId + 1}`;
  }

  getNextId() {
    return this.todoRecords.length + 1;
  }
}

module.exports = { TodoList };
