const assert = require('assert');
const Task = require('../lib/task');

describe('Task Class', function(){
  describe('#toggleStatus()', function() {
    it('should turn a undone task into done task', function() {
      const taskData = {id: '0_0', name: 'Task Name', status: false};
      const task = Task.load(taskData);
      task.toggleStatus();
      taskData.status = true;
      assert.deepStrictEqual(task, Task.load(taskData));
    });

    it('should turn a done task into undone task', function() {
      const taskData = {id: '0_0', name: 'Task Name', status: true};
      const task = Task.load(taskData);
      task.toggleStatus();
      taskData.status = false;
      assert.deepStrictEqual(task, Task.load(taskData));
    });
  });

  describe('#rename()', function() {
    it('should change the name of the task to the given name', function() {
      const taskData = {id: '0_0', name: 'Task Name', status: false};
      const task = Task.load(taskData);
      task.rename('new name');
      taskData.name = 'new name';
      assert.deepStrictEqual(task, Task.load(taskData));
    });
  });
});
