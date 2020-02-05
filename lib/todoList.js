const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todoRecords = [];
  }

  static load(todoData) {
    const todoList = new TodoList();
    todoData.forEach(todo => {
      todoList.todoRecords.push(
        new Todo({
          title: todo.title,
          tasks: todo.tasks,
          id: todo.id
        })
      );
    });
    return todoList;
  }

  getMatchedIdTodo(id) {
    const [todoId] = id.split('_');

    const matchedTodo = this.todoRecords.find(todoRecord => {
      const todoRecordID = `${todoRecord.id}`;
      return todoRecordID === todoId;
    });
    matchedTodo.changeStateOf(id);
  }

  addTodo(todo) {
    this.todoRecords.unshift(todo);
  }
}

module.exports = { TodoList };
