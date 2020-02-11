const { Todo } = require('./todo');

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
  
  getMatchedTodo(todoId){
    return this.todoRecords.find(todo => todo.id === todoId);
  }

  getNewTodoId(){
    return this.todoRecords[0] ? +this.todoRecords[0].id + 1 + '' : '0';
  }
  
  addTodo(todoTitle) {
    const todo = new Todo({title: todoTitle, id: this.getNewTodoId()});
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
    matchedTodo.newSubtask(subtask);
  }

  renameTask(taskId, modifiedTaskName, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.editSubtask(taskId, modifiedTaskName);
  }

  toggleTaskStatus(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.changeStateOf(taskId);
  }

  deleteTask(taskId, todoId) {
    const matchedTodo = this.getMatchedTodo(todoId);
    matchedTodo.deleteSubtask(taskId);
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
