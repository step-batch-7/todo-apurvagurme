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

  changeEditedSubTask(subtaskId, subtask) {
    const [todoId] = subtaskId.split('_');
    const matchedTodo = getMatchedTodo(todoId, this.todoRecords);
    matchedTodo.editSubtask(subtaskId, subtask);
  }

  addSubtask(id, subtask) {
    const todo = getMatchedTodo(id, this.todoRecords);
    todo.newSubtask(subtask);
  }

  searchTodo(title) {
    const requiredTodo = this.todoRecords.filter(todo => {
      const todoPart = todo.title.slice(0, title.length);
      return todoPart == title;
    });
    return requiredTodo;
  }

  searchSubtasks(subtask) {
    const requiredSubtasks = this.todoRecords.filter(todo => {
      const subtasks = todo.getMatched(subtask);
      return todo.tasks.includes(subtasks[0]);
    });
    return requiredSubtasks;
  }

  toJSON(){
    return this.todoRecords;
  }
}
module.exports = { TodoList };
