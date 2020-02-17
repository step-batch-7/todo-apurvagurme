const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { validateFields,
  needsAuthentication,
  serveSavedTodoList,
  registerNewUser,
  login,
  addTodo,
  renameTodo,
  deleteTodo,
  addTask,
  renameTask,
  toggleTaskStatus,
  deleteTask,
  authorize,
  logout,
  isUserNameUniq} = require('./handlers');

const app = express();

const userRoutes = express.Router();

userRoutes.use(authorize);
userRoutes.get('/todoList', serveSavedTodoList);
userRoutes.post('/addTodo', validateFields('todoTitle'), addTodo);
userRoutes.post('/renameTodo', validateFields('todoId', 'todoTitle'), renameTodo);
userRoutes.post('/deleteTodo', validateFields('todoId'), deleteTodo);
userRoutes.post('/addTask', validateFields('todoId', 'taskName'), addTask);
userRoutes.post('/renameTask', validateFields('todoId', 'taskId', 'newName'), renameTask);
userRoutes.post('/toggleTaskStatus', validateFields('todoId', 'taskId'), toggleTaskStatus);
userRoutes.post('/deleteTask', validateFields('todoId', 'taskId'), deleteTask);

app.use(morgan('tiny'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user', userRoutes);

app.get('/', (req, res) => res.redirect('/index.html'));
app.get('/index.html', needsAuthentication);
app.get('/*', express.static('public'));

app.post('/userNameAvailability', isUserNameUniq);
app.post('/signUp', validateFields('userName', 'password'), registerNewUser);
app.post('/login', validateFields('userName', 'password'), login);
app.post('/logout', logout);

module.exports = app;
