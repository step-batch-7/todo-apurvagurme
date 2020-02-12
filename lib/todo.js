const Task = require('./task');

class Todo {
  constructor( title, id) {
    this.title = title;
    this.id = id;
    this.tasks = [];
  }

  static load(todoData){
    const {title, id, tasks} = todoData;
    const todo = new Todo(title, id);
    todo.tasks = tasks.map(Task.load);
    return todo;
  }

  getNewTaskId(){
    const lastTask = this.tasks[this.tasks.length - 1];
    if(!lastTask){
      return `${this.id}_0`;
    }
    const newIdSuffix = +lastTask.id.split('_').pop() + 1;
    return `${this.id}_${newIdSuffix}`;
  }

  findTaskById(taskId){
    return this.tasks.find(task => task.id === taskId);
  }

  rename(title){
    this.title = title;
  }

  addTask(taskName) {
    this.tasks.push(new Task(taskName, this.getNewTaskId()));
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
  
}

module.exports = { Todo };
