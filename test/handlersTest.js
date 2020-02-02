const request = require('supertest');
const { app } = require('../lib/handlers');

describe('GET', function() {
  describe('URL: /', function() {
    it('should give status code 200', function(done) {
      request(app.serve.bind(app))
        .get('/')
        .set('Accept', '*/*')
        .expect('Content-Type', 'text/html')
        .expect('Content-Length', '327')
        .expect(200, done);
    });
  });
});
