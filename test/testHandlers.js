const fs = require('fs');
const request = require('supertest');
const sinon = require('sinon');
const session = require('../lib/sessionManager');

process.env.DATA_STORE_PATH = 'testDataPath';
process.env.USERS_INFO_PATH = 'testUsersInfo';

const {app} = require('../lib/handlers');

const testTodoData = {testUserName: [
  {
    'title': 'fruits',
    'id': '0',
    'tasks': [{ 'name': 'apple', 'id': '0_0', 'status': true }]
  }
]};

const testUserData = {userName: {password: 'password'}};

describe('handlers', function(){
  this.beforeAll(function(){
    const originalReader = fs.readFileSync;
    const mockedReader = sinon.stub();
    mockedReader.withArgs('testDataPath', 'UTF8').returns(JSON.stringify(testTodoData));
    mockedReader.withArgs('testUsersInfo', 'UTF8').returns(JSON.stringify(testUserData));
    mockedReader.callsFake(originalReader);
    sinon.replace(fs, 'readFileSync', mockedReader);
    const originalExists = fs.existsSync;
    const mockedExistChecker = sinon.stub();
    mockedExistChecker.withArgs('testDataPath').returns(true);
    mockedExistChecker.withArgs('testUsersInfo').returns(true);
    mockedExistChecker.callsFake(originalExists);
    sinon.replace(fs, 'existsSync', mockedExistChecker);
    sinon.replace(fs, 'statSync', sinon.stub().returns({isFile: () => true}));
    const isValidSIdStub = sinon.stub();
    isValidSIdStub.withArgs('testId').returns(true);
    const getSessionAttributeStub = sinon.stub();
    getSessionAttributeStub.withArgs('testId', 'userName').returns('testUserName');
    sinon.replace(session, 'addSession', sinon.stub().returns('testSId'));
    sinon.replace(session, 'isValidSId', isValidSIdStub);
    sinon.replace(session, 'getSessionAttribute', getSessionAttributeStub);
  });

  after(function(){
    sinon.restore();
  });

  describe('GET', function() {
    it('/<staticFilePath> should serve the static file', function(done) {
      request(app.serve.bind(app))
        .get('/login.html')
        .expect(/Login/)
        .expect('content-type', 'text/html')
        .expect('content-length', '459')
        .expect('date', /./)
        .expect(200, done);
    });

    it('/ should serve index.html', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('cookie', '_SID=testId')
        .expect(/TODO LIST/)
        .expect('content-type', 'text/html')
        .expect('content-length', '928')
        .expect('date', /./)
        .expect(200, done);
    });

    it('/ should redirect to login page', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .expect('')
        .expect('location', 'login.html')
        .expect('date', /./)
        .expect(302, done);
    });

    it('/todoList should serve saved todo list as JSON', function(done) {
      request(app.serve.bind(app))
        .get('/todoList')
        .set('cookie', '_SID=testId')
        .expect(JSON.stringify(testTodoData.testUserName))
        .expect('content-type', 'application/json')
        .expect('content-length', '81')
        .expect('date', /./)
        .expect(200, done);
    });

    it('/<invalidPath> should give 404 and not found message', function(done) {
      request(app.serve.bind(app))
        .get('/invalidPath')
        .expect('<html><body><h1>Not Found</h1></body></html>')
        .expect('content-type', 'text/html')
        .expect('content-length', '44')
        .expect('date', /./)
        .expect(404, done);
    });
  });

  describe('POST', function() {

    describe('addTodo', function() {
      it('should add the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/addTodo')
          .set('cookie', '_SID=testId')
          .send({todoTitle: 'newTodo'})
          .expect('[{"title":"newTodo","id":"1","tasks":[]},{"title":"fruits","id":"0","tasks":[{"name":"apple","id":"0_0","status":true}]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '121')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/addTodo')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('renameTodo', function() {
      it('should rename the todo title of the given id when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTodo')
          .set('cookie', '_SID=testId')
          .send({todoTitle: 'newName', todoId: '0'})
          .expect('[{"title":"newName","id":"0","tasks":[{"name":"apple","id":"0_0","status":true}]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '82')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTodo')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTodo')
          .set('cookie', '_SID=testId')
          .send({todoId: 'invalidId', todoTitle: 'name'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('deleteTodo', function() {
      it('should delete the todo of the given id when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTodo')
          .set('cookie', '_SID=testId')
          .send({ todoId: '0'})
          .expect('[]')
          .expect('content-type', 'application/json')
          .expect('content-length', '2')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTodo')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTodo')
          .set('cookie', '_SID=testId')
          .send({todoId: 'invalidId'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('addTask', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/addTask')
          .set('cookie', '_SID=testId')
          .send({taskName: 'newTask', todoId: '0'})
          .expect('[{"title":"fruits","id":"0","tasks":[{"name":"apple","id":"0_0","status":true},{"name":"newTask","id":"0_1","status":false}]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '126')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/addTask')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/addTask')
          .set('cookie', '_SID=testId')
          .send({taskName: 'newTask', todoId: 'invalidId'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('renameTask', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTask')
          .set('cookie', '_SID=testId')
          .send({newName: 'mango', taskId: '0_0', todoId: '0'})
          .expect('[{"title":"fruits","id":"0","tasks":[{"name":"mango","id":"0_0","status":true}]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '81')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTask')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTask')
          .set('cookie', '_SID=testId')
          .send({taskId: '0_0', todoId: 'invalidId', newName: 'name'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });

      it('should response "not found" when invalid taskId is given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTask')
          .set('cookie', '_SID=testId')
          .send({taskId: 'invalidId', todoId: '0', newName: 'name'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('toggleTaskStatus', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/toggleTaskStatus')
          .set('cookie', '_SID=testId')
          .send({taskId: '0_0', todoId: '0'})
          .expect('[{"title":"fruits","id":"0","tasks":[{"name":"apple","id":"0_0","status":false}]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '82')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/toggleTaskStatus')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/toggleTaskStatus')
          .set('cookie', '_SID=testId')
          .send({taskId: '0_0', todoId: 'invalidId'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });

      it('should response "not found" when invalid taskId is given', function(done) {
        request(app.serve.bind(app))
          .post('/toggleTaskStatus')
          .set('cookie', '_SID=testId')
          .send({taskId: 'invalidId', todoId: '0'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('deleteTask', function() {
      it('should delete specified task of the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTask')
          .set('cookie', '_SID=testId')
          .send({taskId: '0_0', todoId: '0'})
          .expect('[{"title":"fruits","id":"0","tasks":[]}]')
          .expect('content-type', 'application/json')
          .expect('content-length', '40')
          .expect('date', /./)
          .expect(200, done);
      });

      it('should response "bad request" when required fields are not given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTask')
          .set('cookie', '_SID=testId')
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "not found" when invalid todoId is given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTask')
          .set('cookie', '_SID=testId')
          .send({taskId: '0_0', todoId: 'invalidId'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });

      it('should response "not found" when invalid taskId is given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTask')
          .set('cookie', '_SID=testId')
          .send({taskId: 'invalidId', todoId: '0'})
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });
    });

    describe('signup', function() {
      it('should register new user and redirect to login page', function(done) {
        request(app.serve.bind(app))
          .post('/signUp')
          .send('userName=userName2&password=password')
          .expect('date', /./)
          .expect('location', 'login.html')
          .expect(302, done);
      });
    });

    describe('login', function() {
      it('should redirect to index.html if valid credentials are given', function(done) {
        request(app.serve.bind(app))
          .post('/login')
          .send('userName=userName&password=password')
          .expect('Set-Cookie', '_SID=testSId')
          .expect('date', /./)
          .expect('location', 'index.html')
          .expect(302, done);
      });

      it('should redirect to login.html if invalid password is given', function(done) {
        request(app.serve.bind(app))
          .post('/login')
          .send('userName=userName&password=invalid')
          .expect('date', /./)
          .expect('location', 'login.html')
          .expect(302, done);
      });

      it('should redirect to login.html if invalid username is given', function(done) {
        request(app.serve.bind(app))
          .post('/login')
          .send('userName=invalid&password=password')
          .expect('date', /./)
          .expect('location', 'login.html')
          .expect(302, done);
      });
    });

    describe('General', function(){
      it('/<invalidAction> should give 404 and not found message', function(done) {
        request(app.serve.bind(app))
          .post('/invalidAction')
          .expect('<html><body><h1>Not Found</h1></body></html>')
          .expect('content-type', 'text/html')
          .expect('content-length', '44')
          .expect('date', /./)
          .expect(404, done);
      });

      it('should response "bad request" when any JSON data sent without mentioning in header', function(done) {
        request(app.serve.bind(app))
          .post('/addTodo')
          .send('{}')
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });

      it('should response "bad request" when content-type is specified as json but given data is not a JSON string', function(done) {
        request(app.serve.bind(app))
          .post('/addTodo')
          .set('Content-Type', 'application/json')
          .send('abc')
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });
  });

  describe('<not-allowedMethod>', function() {
    it('/todoList should serve saved todo list as JSON', function(done) {
      request(app.serve.bind(app))
        .put('/path')
        .send({todoTitle: 'newTodo'})
        .expect('<html><body><h1>Method Not Allowed</h1></body></html>')
        .expect('content-type', 'text/html')
        .expect('content-length', '53')
        .expect('date', /./)
        .expect(405, done);
    });
  });
});
