const app = require('./lib/app');
const {saveUsersData, saveAllTodoLists, allTodoLists, usersData} = require('./lib/dataStore');

const main = function(){
  app.locals.allTodoLists = allTodoLists;
  app.locals.usersData = usersData;
  app.locals.saveAllTodoLists = saveAllTodoLists;
  app.locals.saveUsersData = saveUsersData;
  app.listen(8000);
};

main();
