var subject = require(__dirname);
var hoagie = require('hoagie');
var assert = require('assert');
var mock = require('mock-fs');
var fs = require('fs');

describe('hoagie-session', function() {
  beforeEach(function() {
    mock({});
  });
  afterEach(function() {
    mock.restore();
  });
  it('creates the session file', function(done) {
    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(/* req, res, next */) {
      try {
        fs.statSync('store.json');
        done();
      } catch (err) {
        done(err);
      }
    });

    app.run([]);
  });
  it('exposes the session on the request', function(done) {
    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(req /*, res, next */) {
      assert.deepEqual(req.session, {});
      done();
    });

    app.run([]);
  });
  it('reads from the session file');
  it('writes to the session file');
});
