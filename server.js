const app = require('./lib/app');
const {saveUsersData, saveAllTodoLists, loadSavedRecords, loadUsersInfo} = require('./lib/dataStore');

const main = function(){
  const port = process.env.PORT || 8000;
  loadSavedRecords(app);
  loadUsersInfo(app);
  app.locals.saveAllTodoLists = saveAllTodoLists;
  app.locals.saveUsersData = saveUsersData;
  app.listen(port, () => {
    console.log(`Started listening at ${port}`);
  });
};

main();
