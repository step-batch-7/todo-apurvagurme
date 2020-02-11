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
    return this.todoRecords.find(todo => todo.id === todoId);
  }

  getNewTodoId(){
    return this.todoRecords[0] ? +this.todoRecords[0].id + 1 + '' : '0';
  }
  
  addTodo(todoTitle) {
    const todo = new Todo( todoTitle, this.getNewTodoId());
    this.todoRecords.unshift(todo);
  }

  renameTodo(todoId, newTitle) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.rename(newTitle);
  }

  deleteTodo(todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    const deletionIndex = this.todoRecords.indexOf(matchedTodo);
    this.todoRecords.splice(deletionIndex, 1);
  }

  addTask(todoId, subtask) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.addTask(subtask);
  }

  renameTask(taskId, modifiedTaskName, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.renameTask(taskId, modifiedTaskName);
  }

  toggleTaskStatus(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.toggleTaskStatus(taskId);
  }

  deleteTask(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.deleteTask(taskId);
  }
  
  searchTodo(title) {
    const requiredTodo = this.todoRecords.filter(todo => {
      const todoPart = todo.title.slice(0, title.length);
      return todoPart == title;
    });
    return requiredTodo;
  }

  searchTasks(subtask) {
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
