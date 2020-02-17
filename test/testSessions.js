const assert = require('assert');
const sinon = require('sinon');
const sessions = require('../lib/sessions');

const testTime = new Date().getTime();
let clock;

describe('Sessions', function(){
  this.beforeAll(function(){
    clock = sinon.useFakeTimers(testTime);
  });
  this.afterAll(function(){
    clock.restore();
  });
  describe('addSession', function() {
    it('should add a session of the given userName and return uniq session ID', function() {
      assert(sessions.addSession('testUser'), `${testTime}`);
    });
  });

  describe('isValidSessionId', function() {
    it('should validate if a valid session id is given', function() {
      const id = sessions.addSession('testUser');
      assert.ok(sessions.isValidSId(id));
    });

    it('should invalidate if a invalid session id is given', function() {
      assert.ok(!sessions.isValidSId('invalidId'));
    });
  });

  describe('getSessionAttribute', function(){
    it('should give the requested attribute value if it is present', function(){
      const id = sessions.addSession('testUser');
      assert(sessions.getSessionAttribute(id, 'userName'), 'testUser');
    });

    it('should give false if it is not present', function(){
      const id = sessions.addSession('testUser');
      assert.ok(!sessions.getSessionAttribute(id, 'invalidAttribute'));
    });
  });
});
