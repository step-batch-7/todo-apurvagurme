const { Todo } = require('./todo');

class TodoList {
  constructor() {
    this.todoRecords = [];
    this.lastTodoId = -1;
  }

  static load(todoData) {
    const todoList = new TodoList();
    todoData.forEach(todo => todoList.todoRecords.push(Todo.load(todo)));
    todoData[0] && (todoList.lastTodoId = +todoData[0].id);
    return todoList;
  }
  
  getMatchedTodo(todoId){
    return this.todoRecords.find(todo => todo.isSameId(todoId));
  }

  getNewTodoId(){
    return `${++this.lastTodoId}`;
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

  perform(todoId, operation){
    const matchedTodo = this.getMatchedTodo(todoId);
    return Boolean(matchedTodo) && operation(matchedTodo);
  }

  addTask(todoId, taskName){
    return this.perform(todoId, (todo) => todo.addTask(taskName));
  }

  renameTask(taskId, newTaskName, todoId) {
    return this.perform(todoId, (todo) => todo.renameTask(taskId, newTaskName));
  }

  toggleTaskStatus(taskId, todoId) {
    return this.perform(todoId, (todo) => todo.toggleTaskStatus(taskId));
  }

  deleteTask(taskId, todoId) {
    return this.perform(todoId, (todo) => todo.deleteTask(taskId));
  }
  
  toJSON(){
    return this.todoRecords;
  }
}
module.exports = { TodoList };
