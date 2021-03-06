var subject = require(__dirname);
var hoagie = require('hoagie');
var assert = require('assert');
var mock = require('mock-fs');
var fs = require('fs');

/* jshint mocha:true */

describe('hoagie-session', function() {

  before(function () {
    // FIXME only need this because we're running multiple
    // tests in the same process
    process.stdout.setMaxListeners(0);
  });

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
      assert(fs.existsSync('store.json'));
      done();
    });

    app.run([]);
  });

  it('infers the filename from the program name', function(done) {
    var app = hoagie();

    app.set('program', 'session');

    app.use(subject());
    app.use(function(/* req, res, next */) {
      assert(fs.existsSync(process.env.HOME + '/.session'));
      done();
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

  it('reads from the session file', function(done) {
    mock({ 'store.json': '{"foo":"bar"}' });

    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(req /*, res, next */) {
      assert.equal(req.session.foo, 'bar');
      done();
    });

    app.run([]);
  });

  it('yields an error if the session cannot be parsed', function(done) {
    mock({ 'store.json': '{"foo":' });

    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(err, req, res, next) { // jshint ignore:line
      assert.equal(err.name, 'SyntaxError');
      assert.equal(err.message, 'Unexpected end of input');
      done();
    });

    app.run([]);
  });

  it('writes to the session file', function(done) {
    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(req, res, next) {
      req.session.foo = 'bar';
      next();
    });

    app.run([]).once('exit', function() {
      var json = fs.readFileSync('store.json', 'utf8');
      var data = JSON.parse(json);

      assert.deepEqual(data, {
        foo: 'bar'
      });

      done();
    });
  });

  it('does not write to the session file on a nonzero exit', function(done) {
    var app = hoagie();

    app.use(subject('store.json'));
    app.use(function(req, res, next) {
      req.session.foo = 'bar';
      next(new Error('boom'));
    });

    app.run([]).once('exit', function() {
      var json = fs.readFileSync('store.json', 'utf8');
      var data = JSON.parse(json);

      assert.deepEqual(data, {});

      done();
    });
  });

});
