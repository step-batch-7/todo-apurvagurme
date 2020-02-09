class Todo {
  constructor({ title, id, tasks = [] }) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
  }

  newSubtask(subTask) {
    let subtaskId = 0;
    if (this.tasks.length !== 0) {
      const indexOfLastTodo = this.tasks.length - 1;
      [, subtaskId] = this.tasks[indexOfLastTodo].subtaskID.split('_');
      subtaskId = +subtaskId + 1;
    }
    const subtaskID = `${this.id}_${subtaskId}`;
    const newSubtask = { subTask, subtaskID, status: false };
    this.tasks.push(newSubtask);
  }

  changeStateOf(id) {
    const subTaskID = `${id}`;
    const subTask = this.tasks.find(task => {
      return task.subtaskID === subTaskID;
    });
    subTask.status = !subTask.status;
  }

  editSubtask(id, title) {
    const subtask = this.tasks.find(task => {
      const taskId = `${task.subtaskID}`;
      return id === taskId;
    });
    subtask.subTask = title;
  }

  deleteSubtask(id) {
    const subTaskID = `${id}`;
    const subTaskIndex = this.tasks.findIndex(task => {
      return task.subtaskID === subTaskID;
    });
    this.tasks.splice(subTaskIndex, 1);
  }

  static getTodo(body, todoID) {
    const id = getNextId(todoID);
    const title = body.title;
    let tasks;
    const todoInstance = new Todo({ id, title, tasks });
    return todoInstance;
  }
}

const getNextId = function(todoID) {
  return todoID + 1;
};

module.exports = { Todo };
