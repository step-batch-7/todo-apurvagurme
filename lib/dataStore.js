const fs = require('fs');
const { DATA_STORE_PATH, USERS_INFO_PATH } = require('../config');
const { TodoList } = require('./todoList');

const isValidFile = path => fs.existsSync(path) && fs.statSync(path).isFile();

const loadUsersInfo = function(){
  if(!isValidFile(USERS_INFO_PATH)){
    return {};
  }
  return JSON.parse(fs.readFileSync(USERS_INFO_PATH, 'UTF8'));
};

const usersData = loadUsersInfo();

const saveUsersData = function(){
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

const allTodoLists = loadSavedRecords();

const saveAllTodoLists = function() {
  fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(allTodoLists, null, 2));
};

module.exports = {saveUsersData, saveAllTodoLists, allTodoLists, usersData};
