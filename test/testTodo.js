const assert = require('assert');
const {Todo} = require('../lib/todo');
0;

describe('Todo Class', function(){
  describe('#rename()', function() {
    it('should change the title of the todo to the given title', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: [{name: 'task', id: '2_0', status: false}]};
      const todo = Todo.load(todoData);
      todo.rename('newTodo');
      todoData.title = 'newTodo';
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });
  });

  describe('#addTask()', function() {
    it('should add a task to the todo when there is no previous task', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: []};
      const todo = Todo.load(todoData);
      todo.addTask('task');
      todoData.tasks.push({name: 'task', id: '2_0', status: false});
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });

    it('should add a task to the todo when there is a previous task', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: [{name: 'task', id: '2_0', status: false}]};
      const todo = Todo.load(todoData);
      todo.addTask('task2');
      todoData.tasks.push({name: 'task2', id: '2_1', status: false});
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });
  });

  describe('#renameTask()', function() {
    it('should rename the task of the given task id', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: [{name: 'task', id: '2_0', status: false}]};
      const todo = Todo.load(todoData);
      todo.renameTask('2_0', 'newName');
      todoData.tasks[0].name = 'newName';
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });
  });

  describe('#toggleTaskStatus()', function() {
    it('should toggle the status of the task of the given id', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: [{name: 'task', id: '2_0', status: false}]};
      const todo = Todo.load(todoData);
      todo.toggleTaskStatus('2_0');
      todoData.tasks[0].status = true;
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });
  });

  describe('#deleteTask()', function() {
    it('should delete the task of the given id', function() {
      const todoData = {title: 'New Todo', id: '2', tasks: [{name: 'task', id: '2_0', status: false}]};
      const todo = Todo.load(todoData);
      todo.deleteTask('2_0');
      todoData.tasks.pop();
      assert.deepStrictEqual(todo, Todo.load(todoData));
    });
  });
});
