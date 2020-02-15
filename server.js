const fs = require('fs');
const app = require('./lib/app');
const { DATA_STORE_PATH, USERS_INFO_PATH } = require('./config');
const { TodoList } = require('./lib/todoList');

const isValidFile = path => fs.existsSync(path) && fs.statSync(path).isFile();

const loadUsersInfo = function(){
  if(!isValidFile(USERS_INFO_PATH)){
    return {};
  }
  return JSON.parse(fs.readFileSync(USERS_INFO_PATH, 'UTF8'));
};

const usersData = loadUsersInfo();

const saveUsersInfo = function(){
  fs.writeFileSync(USERS_INFO_PATH, JSON.stringify(usersData));
};

const loadSavedRecords = function() {
  if(!isValidFile(DATA_STORE_PATH)){
    return {};
  }
  const records = JSON.parse(fs.readFileSync(DATA_STORE_PATH, 'UTF8'));
  Object.entries(records).forEach(([user, todoList]) => {
    records[user] = TodoList.load(todoList);
  });
  return records;
};

const allTodoData = loadSavedRecords();

const saveAllTodoData = function() {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(allTodoData, null, 2));
};

const main = function(){
  app.locals.allTodoData = allTodoData;
  app.locals.usersData = usersData;
  app.locals.saveAllTodoData = saveAllTodoData;
  app.locals.saveUsersInfo = saveUsersInfo;
  app.listen(8000);
};

main();
