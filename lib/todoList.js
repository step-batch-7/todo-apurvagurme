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

  getIdOfDeletedTodo(id) {
    const [todoId] = id.split('_');
    const matchedTodo = this.todoRecords.find(todoRecord => {
      const todoRecordID = `${todoRecord.id}`;
      return todoRecordID === todoId;
    });
    matchedTodo.deleteSubtask(id);
  }

  deleteTodo(id) {
    const todoIndex = this.todoRecords.findIndex(todo => {
      const todoId = `${todo.id}`;
      return todoId === id;
    });
    this.todoRecords.splice(todoIndex, 1);
  }

  addTodo(todo) {
    this.todoRecords.unshift(todo);
  }
}

module.exports = { TodoList };
