const assert = require('assert');
const {TodoList} = require('../lib/todoList');

describe('TodoList Class', function() {
  describe('#addTodo()', function() {
    it('should add a todo to the todoList when no previous todo', function() {
      const todoListData = [];
      const todoList = TodoList.load(todoListData);
      todoList.addTodo('firstTodo');
      todoListData.push({title: 'firstTodo', id: '0', tasks: []});
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });

    it('should add a todo to the todoList when there is a previous todo', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: []}];
      const todoList = TodoList.load(todoListData);
      todoList.addTodo('secondTodo');
      todoListData.unshift({title: 'secondTodo', id: '1', tasks: []});
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#renameTodo()', function() {
    it('should rename todo of the given id', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: []}];
      const todoList = TodoList.load(todoListData);
      todoList.renameTodo('0', 'newName');
      todoListData[0].title = 'newName';
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#deleteTodo()', function() {
    it('should delete todo of the given id', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: []}];
      const todoList = TodoList.load(todoListData);
      todoList.deleteTodo('0');
      todoListData.pop();
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#addTask()', function() {
    it('should add task to the todo whose id is given', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: []}];
      const todoList = TodoList.load(todoListData);
      todoList.addTask('0', 'NewTask');
      todoListData[0].tasks.push({name: 'NewTask', id: '0_0', status: false});
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#renameTask()', function() {
    it('should rename the task of the specified todo', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: [{name: 'task', id: '0_0', status: true}]}];
      const todoList = TodoList.load(todoListData);
      todoList.renameTask('0_0', 'newName', '0');
      todoListData[0].tasks[0].name = 'newName';
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#toggleTaskStatus()', function() {
    it('should toggle status of task of the specified todo', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: [{name: 'task', id: '0_0', status: true}]}];
      const todoList = TodoList.load(todoListData);
      todoList.toggleTaskStatus('0_0', '0');
      todoListData[0].tasks[0].status = false;
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#deleteTask()', function() {
    it('should delete specified task of the specified todo', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: [{name: 'task', id: '0_0', status: true}]}];
      const todoList = TodoList.load(todoListData);
      todoList.deleteTask('0_0', '0');
      todoListData[0].tasks.pop();
      assert.deepStrictEqual(todoList, TodoList.load(todoListData));
    });
  });

  describe('#toJSON()', function() {
    it('should manipulate JSON string', function() {
      const todoListData = [{title: 'firstTodo', id: '0', tasks: [{name: 'task', id: '0_0', status: true}]}];
      const todoList = TodoList.load(todoListData);
      assert.deepStrictEqual(JSON.stringify(todoList), JSON.stringify(todoListData));
    });
  });
});
