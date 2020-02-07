const fs = require('fs');
const queryString = require('querystring');

const { App } = require('./app');
const { Todo } = require('./todo');
const { TodoList } = require('./todoList');

const STATUS_CODE = require('./statusCode');
const CONTENT_TYPES = require('./contentType');
const STATIC_FOLDER = `${__dirname}/../public`;
const DATA_STORE = `${__dirname}/../todoData.json`;

const getStatus = path => fs.existsSync(path) && fs.statSync(path);

const getContentType = function(url) {
  const [, extension] = url.split('.');
  return CONTENT_TYPES[extension];
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', text => {
    data += text;
  });
  req.on('end', () => {
    req.body = queryString.parse(data);
    next();
  });
};

const serveAddTodoPage = function(req, res) {
  let id = 0;
  if (todoData[0]) {
    id = todoData[0].id;
  }
  const todo = Todo.getTodo(req.body, todoData, id);
  todoList.addTodo(todo);
  const newTodo = JSON.stringify(todoList.todoRecords);
  fs.writeFileSync(DATA_STORE, newTodo, 'utf8');
  res.writeHead(STATUS_CODE.redirection, { location: '/' });
  res.end();
};

const sendResponse = function(res, content, contentType, statusCode) {
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': content.length
  });
  res.end(content);
};

const getFileContent = function(path) {
  let content = [];
  if (fs.existsSync(path)) {
    content = JSON.parse(fs.readFileSync(path));
  }
  return content;
};

const todoData = getFileContent(DATA_STORE, 'utf8');
const todoList = TodoList.load(todoData);

const serveStaticPage = function(req, res, next) {
  let path = `${STATIC_FOLDER}${req.url}`;
  if (req.url === '/') {
    path = `${STATIC_FOLDER}/index.html`;
    req.url = '/index.html';
  }
  const status = getStatus(path);
  if (!status || !status.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const contentType = getContentType(req.url);
  sendResponse(res, content, contentType, STATUS_CODE.ok);
};

const serveTodo = function(req, res) {
  res.writeHead(STATUS_CODE.ok, {
    'Content-Type': CONTENT_TYPES.plain
  });
  res.end(JSON.stringify(todoList));
};

const sendResAfterChange = function(res) {
  const records = JSON.stringify(todoList.todoRecords);
  fs.writeFileSync(DATA_STORE, records, 'utf8');
  res.writeHead(STATUS_CODE.ok);
  res.end();
};

const toggleTaskStatus = function(req, res) {
  todoList.getMatchedIdTodo(req.body.id);
  sendResAfterChange(res);
};

const deleteSubtask = function(req, res) {
  todoList.getIdOfDeletedTodo(req.body.id);
  sendResAfterChange(res);
};

const deleteTodo = function(req, res) {
  todoList.deleteTodo(req.body.id);
  sendResAfterChange(res);
};

const notFound = function(req, res) {
  res.writeHead(STATUS_CODE.notFound);
  res.end('Not Found');
};

const saveNewTitle = function(req, res) {
  const [, id] = req.body.id.split('_');
  const todoId = todoList.todoRecords.findIndex(todo => {
    const todoid = `${todo.id}`;
    return id === todoid;
  });
  todoList.todoRecords[todoId].title = req.body.title;
  res.writeHead(STATUS_CODE.ok);
  res.end();
};

const app = new App();

app.use(readBody);

app.get('', serveStaticPage);
app.get('/todoList', serveTodo);
app.get('', notFound);

app.post('/toggleTaskStatus', toggleTaskStatus);
app.post('/deleteSubtask', deleteSubtask);
app.post('/deleteTodo', deleteTodo);
app.post('/addTodo', serveAddTodoPage);
app.post('/saveNewTitle', saveNewTitle);
app.post('', notFound);
module.exports = { app };
