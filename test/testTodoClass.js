const assert = require('assert');
const {Todo} = require('../lib/todo');

describe('Todo Class', function(){
  describe('#rename()', function() {
    it('should change the title of the todo to the given title', function() {
      const todo = new Todo('newTodo', '0');
      todo.rename('newName');
      assert.deepStrictEqual(todo.title, 'newName');
    });
  });

  describe('#addTask()', function() {
    it('should add a task to the todo', function() {
      const todo = new Todo('newTodo', '0');
      assert.deepStrictEqual(todo.addTask('task1'), '0_0');
      assert.deepStrictEqual(todo.addTask('task2'), '0_1');
    });
  });

  describe('#renameTask()', function() {
    it('should rename the task of valid id', function() {
      const todo = new Todo('newTodo', '0');
      const id = todo.addTask('newTask');
      assert.ok(todo.renameTask(id, 'newName'));
    });

    it('should not rename the task of invalid id', function() {
      const todo = new Todo('newTodo', '0');
      assert.ok(!todo.renameTask('0_0', 'newName'));
    });
  });

  describe('#toggleTaskStatus()', function() {
    it('should toggle the status of the task of a valid id', function() {
      const todo = new Todo('newTodo', '0');
      const id = todo.addTask('newTask');
      assert.ok(todo.toggleTaskStatus(id));
    });

    it('should not toggle the status of the task of a invalid id', function() {
      const todo = new Todo('newTodo', '0');
      assert.ok(!todo.toggleTaskStatus('0_0'));
    });
  });

  describe('#deleteTask()', function() {
    it('should delete the task of a valid id', function() {
      const todo = new Todo('newTodo', '0');
      const id = todo.addTask('newTask');
      assert.ok(todo.deleteTask(id));
    });

    it('should not delete the task of a invalid id', function() {
      const todo = new Todo('newTodo', '0');
      assert.ok(!todo.deleteTask('0_0'));
    });
  });

  describe('#isSameId()', function() {
    it('should validate if the asked id is same', function() {
      const todo = new Todo('newTodo', '0');
      assert.ok(todo.isSameId('0'));
    });

    it('should invalidate if the asked id is not same', function() {
      const todo = new Todo('newTodo', '0');
      assert.ok(!todo.isSameId('invalidId'));
    });
  });

  describe('#toJSON()', function() {
    it('should manipulate JSON string', function() {
      const todo = new Todo('newTodo', '0');
      const expectedValue = JSON.stringify({title: 'newTodo', id: '0', tasks: []});
      assert.deepStrictEqual(JSON.stringify(todo), expectedValue);
    });
  });
});
