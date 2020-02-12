const Task = require('./task');

class Todo {
  constructor( title, id) {
    this.title = title;
    this.id = id;
    this.tasks = [];
    this.lastTaskIdSuffix = -1;
  }

  static load(todoData){
    const {title, id, tasks} = todoData;
    const todo = new Todo(title, id);
    todo.tasks = tasks.map(Task.load);
    const lastTask = tasks[tasks.length - 1];
    lastTask && (todo.lastTaskIdSuffix = +lastTask.id.split('_').pop());
    return todo;
  }

  getNewTaskId(){
    return `${this.id}_${++this.lastTaskIdSuffix}`;
  }

  findTaskById(taskId){
    return this.tasks.find(task => task.isSameId(taskId));
  }

  rename(title){
    this.title = title;
  }

  addTask(taskName) {
    const id = this.getNewTaskId();
    this.tasks.push(new Task(taskName, id));
    return id;
  }
  
  renameTask(taskId, modifiedTaskName) {
    const matchedTask = this.findTaskById(taskId);
    matchedTask && matchedTask.rename(modifiedTaskName);
    return Boolean(matchedTask);
  }

  toggleTaskStatus(taskId) {
    const matchedTask = this.findTaskById(taskId);
    matchedTask && matchedTask.toggleStatus();
    return Boolean(matchedTask);
  }
  
  deleteTask(taskId) {
    const matchedTask = this.findTaskById(taskId);
    const deletionIndex = this.tasks.indexOf(matchedTask);
    const isValidIndex = deletionIndex >= 0;
    isValidIndex && this.tasks.splice(deletionIndex, 1);
    return isValidIndex;
  }
  
  isSameId(id){
    return this.id === id;
  }

  toJSON(){
    const {title, id, tasks} = this;
    return {title, id, tasks};
  }
}

module.exports = { Todo };
