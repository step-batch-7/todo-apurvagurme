class Todo {
  constructor( title, id) {
    this.title = title;
    this.tasks = [];
    this.id = id;
  }

  static load(todoData){
    const {title, id, tasks} = todoData;
    const todo = new Todo(title, id);
    todo.tasks = tasks;
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
    const newTask = { name: taskName, id: this.getNewTaskId(), status: false };
    this.tasks.push(newTask);
  }
  
  renameTask(taskId, modifiedTaskName) {
    const matchedTask = this.findTaskById(taskId);
    matchedTask.name = modifiedTaskName;
  }

  toggleTaskStatus(taskId) {
    const matchedTask = this.findTaskById(taskId);
    matchedTask.status = !matchedTask.status;
  }
  
  deleteTask(taskId) {
    const matchedTask = this.findTaskById(taskId);
    const deletionIndex = this.tasks.indexOf(matchedTask);
    this.tasks.splice(deletionIndex, 1);
  }

  getMatched(subtaskTitle) {
    const requiredSubtasks = this.tasks.filter(task => {
      return task.name.includes(subtaskTitle);
    });
    return requiredSubtasks;
  }
}

module.exports = { Todo };
