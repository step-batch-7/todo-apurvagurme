const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');

const {app} = require('../lib/handlers');

const testData = [
  {
    'title': 'fruits',
    'id': '0',
    'tasks': [{ 'name': 'apple', 'id': '0_0', 'status': true }]
  }
];

describe('handlers', function(){
  describe('GET', function() {
    it('/<staticFilePath> should serve the static file', function(done) {
      request(app.serve.bind(app))
        .get('/index.html')
        .expect(/TODO LIST/)
        .expect('content-type', 'text/html')
        .expect('content-length', '928')
        .expect('date', /./)
        .expect(200, done);
    });

    it('/ should serve index.html', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .expect(/TODO LIST/)
        .expect('content-type', 'text/html')
        .expect('content-length', '928')
        .expect('date', /./)
        .expect(200, done);
    });

    it('/todoList should serve saved todo list as JSON', function(done) {
      const stubbedReader = sinon.stub().returns(JSON.stringify(testData));
      sinon.replace(fs, 'readFileSync', stubbedReader);
      request(app.serve.bind(app))
        .get('/todoList')
        .expect(JSON.stringify(testData))
        .expect('content-type', 'application/json')
        .expect('content-length', '81')
        .expect('date', /./)
        .expect(200, () => {
          sinon.restore();
          done();
        });
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
    this.beforeAll(function(){
      const stubbedReader = sinon.stub().returns(JSON.stringify(testData));
      sinon.replace(fs, 'readFileSync', stubbedReader);
      sinon.replace(fs, 'writeFileSync', () => {});
    });

    this.afterAll(function(){
      sinon.restore();
    });

    describe('addTodo', function() {
      it('should add the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/addTodo')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('deleteTodo', function() {
      it('should delete the todo of the given id when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTodo')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('addTask', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/addTask')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('renameTask', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/renameTask')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('toggleTaskStatus', function() {
      it('should add task to the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/toggleTaskStatus')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
      });
    });

    describe('deleteTask', function() {
      it('should delete specified task of the specified todo when required fields are given', function(done) {
        request(app.serve.bind(app))
          .post('/deleteTask')
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
          .send({})
          .expect('')
          .expect('content-length', '0')
          .expect('date', /./)
          .expect(400, done);
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
