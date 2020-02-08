const getSubTaskId = function(todoData) {
  const lastTask = todoData[0];
  let lastSubTaskId = 0;
  if (lastTask) {
    lastSubTaskId = lastTask.id;
  }
  return `${lastSubTaskId + 1}`;
};

const separateSubtasks = function(subTasks, todoList, status) {
  let count = 0;
  let id = `${getSubTaskId(todoList)}_${count}`;
  const subTask = subTasks;
  if (typeof subTasks === 'string') {
    return [{ id, subTask, status }];
  }
  const tasks = subTasks.map(subTask => {
    id = `${getSubTaskId(todoList)}_${count}`;
    count++;
    return { id, subTask, status };
  });
  return tasks;
};

class Todo {
  constructor({ title, tasks, id }) {
    this.title = title;
    this.tasks = tasks;
    this.id = id;
  }

  newSubtask(subTask, todoList) {
    const newSubtask = { subTask, id: getSubTaskId(todoList), status: false };
    this.tasks.push(newSubtask);
  }

  changeStateOf(id) {
    const subTaskID = `${id}`;
    const subTask = this.tasks.find(task => {
      return task.id === subTaskID;
    });
    subTask.status = !subTask.status;
  }

  editSubtask(id, title) {
    const subtask = this.tasks.find(task => {
      const taskId = `${task.id}`;
      return id === taskId;
    });
    subtask.subTask = title;
  }

  deleteSubtask(id) {
    const subTaskID = `${id}`;
    const subTaskIndex = this.tasks.findIndex(task => {
      return task.id === subTaskID;
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
