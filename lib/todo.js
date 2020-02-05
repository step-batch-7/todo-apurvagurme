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

  changeStateOf(id) {
    const subTaskID = `${id}`;
    const subTask = this.tasks.find(task => {
      return task.id === subTaskID;
    });
    subTask.status = !subTask.status;
  }

  static getTodo(body, todoData) {
    const id = getNextId(todoData);
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

const getNextId = function(todoData) {
  return todoData.length + 1;
};

module.exports = { Todo };
