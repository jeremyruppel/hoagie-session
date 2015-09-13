var path = require('path');
var fs = require('fs');
var debug = require('debug')('hoagie:session');

module.exports = function session(filename) {
  return function(req, res, next) {
    filename = filename || rcfile(req);

    touch(filename);

    try {
      req.session = read(filename);
    } catch (err) {
      return next(err);
    }

    res.on('finish', function() {
      write(filename, req.session);
    });

    next();
  };

  function rcfile(req) {
    return path.join(process.env.HOME, '.' + req.app.get('program'));
  }

  function touch(filename) {
    debug('touch', filename);

    try {
      fs.statSync(filename);
    } catch (err) {
      fs.writeFileSync(filename, '{}');
    }
  }

  function read(filename) {
    debug('read', filename);

    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  function write(filename, data) {
    debug('write', filename);

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }

};
