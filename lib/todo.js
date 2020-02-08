class Todo {
  constructor({ title, tasks = [], id }) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
  }

  newSubtask(subTask, todoList) {
    let subtaskId = 0;
    if (this.tasks.length != 0) {
      [, subtaskId] = this.tasks[0].subtaskID.split('_');
      subtaskId = +subtaskId + 1;
    }
    const subtaskID = `${this.id}_${subtaskId}`;
    const newSubtask = { subTask, subtaskID, status: false };
    this.tasks.unshift(newSubtask);
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

  static getTodo(body, todoData, todoID) {
    const id = getNextId(todoID);
    const title = body.title;
    const status = false;
    let tasks;
    if (body.task) {
      tasks = separateSubtasks(body.task, todoData, status);
    }
    const todoInstance = new Todo({ id, title, status, tasks });
    return todoInstance;
  }
}

const getNextId = function(todoID) {
  return todoID + 1;
};

module.exports = { Todo };
