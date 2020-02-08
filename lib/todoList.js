const { Todo } = require('./todo');

const getMatchedTodo = function(todoId, todoRecords) {
  const matchedTodo = todoRecords.find(todoRecord => {
    const todoRecordID = `${todoRecord.id}`;
    return todoRecordID === todoId;
  });
  return matchedTodo;
};

class TodoList {
  constructor() {
    this.todoRecords = [];
  }

  static load(todoData) {
    const todoList = new TodoList();
    todoData.forEach(todo => {
      const { title, tasks, id } = todo;
      todoList.todoRecords.push(new Todo({ title, tasks, id }));
    });
    return todoList;
  }

  getMatchedIdTodo(id) {
    const [todoId] = id.split('_');
    const matchedTodo = getMatchedTodo(todoId, this.todoRecords);
    matchedTodo.changeStateOf(id);
  }

  getIdOfDeletedTodo(id) {
    const [todoId] = id.split('_');
    const matchedTodo = getMatchedTodo(todoId, this.todoRecords);
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

  saveNewTitle(id, newTitle) {
    const matchedTodo = getMatchedTodo(id, this.todoRecords);
    matchedTodo.title = newTitle;
  }

  changeEditedSubTask(subtaskId, subTaskTitle, todoId) {
    const matchedTodo = getMatchedTodo(todoId, this.todoRecords);
    matchedTodo.editSubtask(subtaskId, subTaskTitle);
  }

  addSubtask(id, subtask) {
    const todo = getMatchedTodo(id, this.todoRecords);
    todo.newSubtask(subtask, this.todoRecords);
  }
}

module.exports = { TodoList };
