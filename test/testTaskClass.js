const assert = require('assert');
const Task = require('../lib/task');

describe('Task Class', function(){
  describe('#toggleStatus()', function() {
    it('should turn a undone task into done task', function() {
      const task = new Task('newTask', '0_0');
      task.toggleStatus();
      assert.ok(task.status);
    });

    it('should turn a done task into undone task', function() {
      const taskData = {id: '0_0', name: 'Task Name', status: true};
      const task = Task.load(taskData);
      task.toggleStatus();
      assert.ok(!task.status);
    });
  });

  describe('#rename()', function() {
    it('should change the name of the task to the given name', function() {
      const task = new Task('newTask', '0_0');
      task.rename('newName');
      assert.deepStrictEqual(task.name, 'newName');
    });
  });

  describe('#isSameId()', function() {
    it('should validate if the asked id is same', function() {
      const task = new Task('newTask', '0_0');
      assert.ok(task.isSameId('0_0'));
    });

    it('should invalidate if the asked id is not same', function() {
      const task = new Task('newTask', '0_0');
      assert.ok(!task.isSameId('invalidId'));
    });
  });
});
