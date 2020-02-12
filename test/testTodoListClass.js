const assert = require('assert');
const {TodoList} = require('../lib/todoList');

describe('TodoList Class', function() {
  describe('#addTodo()', function() {
    it('should add a todo to the todoList', function() {
      const todoList = new TodoList('newTodoList');
      assert.deepStrictEqual(todoList.addTodo('firstTodo'), '0');
      assert.deepStrictEqual(todoList.addTodo('secondTodo'), '1');
    });
  });

  describe('#renameTodo()', function() {
    it('should rename todo of valid id', function() {
      const todoList = new TodoList('newTodo');
      const id = todoList.addTodo('todo');
      assert.ok(todoList.renameTodo(id, 'newName'));
    });

    it('should not rename todo of invalid id', function() {
      const todoList = new TodoList('newTodo');
      assert.ok(!todoList.renameTodo('invalidId', 'newName'));
    });
  });

  describe('#deleteTodo()', function() {
    it('should delete todo of valid id', function() {
      const todoList = new TodoList('newTodo');
      const id = todoList.addTodo('todo');
      assert.ok(todoList.deleteTodo(id));
    });

    it('should not delete todo of invalid id', function() {
      const todoList = new TodoList('newTodo');
      assert.ok(!todoList.deleteTodo('invalidId'));
    });
  });

  describe('#addTask()', function() {
    it('should add task to todo if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const id = todoList.addTodo('todo');
      assert.ok(todoList.addTask(id, 'newTask'));
    });

    it('should not add task if todoId is invalid', function() {
      const todoList = new TodoList('newTodo');
      assert.ok(!todoList.deleteTodo('invalidId', 'newTask'));
    });
  });

  describe('#renameTask()', function() {
    it('should rename task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(todoList.renameTask(taskId, 'newName', todoId));
    });

    it('should not rename task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.renameTask(taskId, 'newName', 'invalidId'));
    });

    it('should not rename task if taskId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.renameTask('invalidId', 'newName', todoId));
    });
  });

  describe('#toggleTaskStatus()', function() {
    it('should toggle Status of task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(todoList.toggleTaskStatus(taskId, todoId));
    });

    it('should not toggle Status of task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.toggleTaskStatus(taskId, 'invalidId'));
    });

    it('should not toggle Status of task if taskId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.toggleTaskStatus('invalidId', todoId));
    });
  });

  describe('#deleteTask()', function() {
    it('should delete task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(todoList.deleteTask(taskId, todoId));
    });

    it('should not delete task if todoId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      const taskId = todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.deleteTask(taskId, 'invalidId'));
    });

    it('should not delete task if taskId is valid', function() {
      const todoList = new TodoList('newTodo');
      const todoId = todoList.addTodo('todo');
      todoList.addTask(todoId, 'newTask');
      assert.ok(!todoList.deleteTask('invalidId', todoId));
    });
  });

  describe('#toJSON()', function() {
    it('should manipulate JSON string', function() {
      const todoList = new TodoList([]);
      assert.deepStrictEqual(JSON.stringify(todoList), JSON.stringify([]));
    });
  });
});
