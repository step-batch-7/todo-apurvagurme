const request = require('supertest');
const { app } = require('../lib/handlers');

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
});

describe('GET', () => {
  it('should give 404 statusCode if any one give absent file', done => {
    request(app.serve.bind(app))
      .get('/absentFile.js')
      .expect(404, done);
  });
});

describe('GET/getAllTodo', function() {
  it('should return all existing todoList', function(done) {
    request(app.serve.bind(app))
      .get('/todoList')
      .expect('Content-type', 'text/plain')
      .expect(200, done);
  });
});

describe('GET/dustbin.svg', function() {
  it('Checking the serveStaticPage handler', function(done) {
    request(app.serve.bind(app))
      .get('/images/dustbin.svg')
      .expect('Content-type', 'image/svg+xml')
      .expect(200, done);
  });
});

describe('POST/dustbin.svg', function() {
  it('Checking the serveStaticPage handler', function(done) {
    request(app.serve.bind(app))
      .post('/dustbin.svg')
      .expect(404, done);
  });
});
