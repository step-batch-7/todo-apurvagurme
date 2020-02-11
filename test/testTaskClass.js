const assert = require('assert');
const Task = require('../lib/task');

const testData = {id: '0_0', name: 'Task Name', status: false};

describe('Task Class', function(){
  describe('#toggleStatus()', function() {
    it('should turn a undone task into done task', function() {
      const task = Task.load({id: '0_0', name: 'Task Name', status: false});
      task.toggleStatus();
      const expectedValue = Task.load({id: '0_0', name: 'Task Name', status: true});
      assert.deepStrictEqual(task, expectedValue);
    });

    it('should turn a done task into undone task', function() {
      const task = Task.load({id: '0_0', name: 'Task Name', status: true});
      task.toggleStatus();
      const expectedValue = Task.load({id: '0_0', name: 'Task Name', status: false});
      assert.deepStrictEqual(task, expectedValue);
    });
  });

  describe('#rename()', function() {
    it('should change the name of the task to the given name', function() {
      const task = Task.load({id: '0_0', name: 'Task Name', status: false});
      task.rename('new name');
      const expectedValue = Task.load({id: '0_0', name: 'new name', status: false});
      assert.deepStrictEqual(task, expectedValue);
    });
  });
});
