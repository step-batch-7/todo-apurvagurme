const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todoRecords = [];
  }

  static load(todoData) {
    const todoList = new TodoList();
    todoData.forEach(todo => todoList.todoRecords.push(Todo.load(todo)));
    return todoList;
  }
  
  getMatchedTodo(todoId){
    return this.todoRecords.find(todo => todo.isSameId(todoId));
  }

  getNewTodoId(){
    return this.todoRecords[0] ? `${+this.todoRecords[0].id + 1}` : '0';
  }
  
  addTodo(todoTitle) {
    const id = this.getNewTodoId();
    this.todoRecords.unshift(new Todo( todoTitle, id));
    return id;
  }

  renameTodo(todoId, newTitle) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo && matchedTodo.rename(newTitle);
    return Boolean(matchedTodo);
  }

  deleteTodo(todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    const deletionIndex = this.todoRecords.indexOf(matchedTodo);
    const isValidIndex = deletionIndex >= 0;
    isValidIndex && this.todoRecords.splice(deletionIndex, 1);
    return isValidIndex;
  }

  addTask(todoId, subtask) {
    const matchedTodo = this.getMatchedTodo(todoId);
    return matchedTodo && matchedTodo.addTask(subtask);
  }

  renameTask(taskId, modifiedTaskName, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    return matchedTodo && matchedTodo.renameTask(taskId, modifiedTaskName);
  }

  toggleTaskStatus(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    return matchedTodo && matchedTodo.toggleTaskStatus(taskId);
  }

  deleteTask(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    return matchedTodo && matchedTodo.deleteTask(taskId);
  }
  
  toJSON(){
    return this.todoRecords;
  }
}
module.exports = { TodoList };
