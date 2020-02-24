const client = require('redis').createClient(process.env.REDIS_URL || 'redis://localhost:6379');
const { TodoList } = require('./todoList');

let usersData;
let allTodoLists;

const loadUsersInfo = function(app){
  client.get('userData', (err, data) => {
    !err && (usersData = data ? JSON.parse(data) : {});
    app.locals.usersData = usersData;
  });
};

const saveUsersData = function(){
  client.set('userData', JSON.stringify(usersData));
};

const loadSavedRecords = function(app) {
  client.get('todoData', (err, data) => {
    !err && (allTodoLists = data ? JSON.parse(data) : {});
    Object.entries(allTodoLists).forEach(([user, todoList]) => {
      allTodoLists[user] = TodoList.load(todoList);
    });
    app.locals.allTodoLists = allTodoLists;
  });
};

const saveAllTodoLists = function() {
  client.set('todoData', JSON.stringify(allTodoLists));
};

module.exports = {saveUsersData, saveAllTodoLists, loadUsersInfo, loadSavedRecords};
