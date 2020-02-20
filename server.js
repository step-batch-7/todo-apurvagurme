const app = require('./lib/app');
const {saveUsersData, saveAllTodoLists, allTodoLists, usersData} = require('./lib/dataStore');

const main = function(){
  const port = process.env.PORT || 8000;
  app.locals.allTodoLists = allTodoLists;
  app.locals.usersData = usersData;
  app.locals.saveAllTodoLists = saveAllTodoLists;
  app.locals.saveUsersData = saveUsersData;
  app.listen(port, () => {
    console.log(`Started listening at ${port}`);
  });
};

main();
