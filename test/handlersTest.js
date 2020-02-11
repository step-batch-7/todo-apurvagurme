const request = require('supertest');
const { app } = require('../lib/handlers');
const sinon = require('sinon');
const fs = require('fs');

describe('GET', function() {
  describe('URL: /', function() {
    it('should give status code 200', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect('Content-Type', 'text/html')
        .expect(200, done);
    });
  });

  describe('GET', () => {
    it('should give 404 statusCode if any one give absent file', done => {
      request(app.serve.bind(app))
        .get('/absentFile.js')
        .set('Accept', '*/*')
        .expect(404, done);
    });
  });

  describe('GET/getAllTodo', function() {
    it('should return all existing todoList', function(done) {
      request(app.serve.bind(app))
        .get('/todoList')
        .set('Accept', '*/*')
        .expect('Content-type', 'text/plain')
        .expect(200, done);
    });
  });

  describe('GET/dustbin.svg', function() {
    it('Checking the serveStaticPage handler', function(done) {
      request(app.serve.bind(app))
        .get('/images/dustbin.svg')
        .set('Accept', '*/*')
        .expect('Content-type', 'image/svg+xml')
        .expect(200, done);
    });
  });
});

describe('PUT/wrong method', function() {
  it('should tell wrong method', function(done) {
    request(app.serve.bind(app))
      .put('/wrongMethod')
      .set('Accept', '*/*')
      .expect(405, done);
  });
});

describe('POST', function() {
  before(sinon.replace(fs, 'writeFileSync', sinon.fake()));
  after(() => sinon.restore());

  describe('POST/toggleStatus', function() {
    it('should toggle the status of a particular subtask', function(done) {
      request(app.serve.bind(app))
        .post('/toggleTaskStatus')
        .set('Accept', '*/*')
        .send('id=3_1')
        .expect(200, done);
    });
  });

  describe('POST/deleteTask', function() {
    it('should delete subtask of given id', function(done) {
      request(app.serve.bind(app))
        .post('/deleteTask')
        .set('Accept', '*/*')
        .send('id=3_1')
        .expect(200, done);
    });
  });

  describe('POST/deleteTodo', function() {
    it('should delete todo of given id', function(done) {
      request(app.serve.bind(app))
        .post('/deleteTodo')
        .set('Accept', '*/*')
        .send('id=3')
        .expect(200, done);
    });
  });

  describe('POST/addTodo', function() {
    it('should add todo of given title', function(done) {
      request(app.serve.bind(app))
        .post('/addTodo')
        .set('Accept', '*/*')
        .send('title=hello')
        .expect(200, done);
    });
  });

  describe('POST/addTask', function() {
    it('should add todo of given title', function(done) {
      request(app.serve.bind(app))
        .post('/addTask')
        .set('Accept', '*/*')
        .send('subtask=hello&id=2')
        .expect(200, done);
    });
  });
});
