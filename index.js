var fs = require('fs');

module.exports = function session(filename) {
  return function(req, res, next) {
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

  function touch(filename) {
    try {
      fs.statSync(filename);
    } catch (err) {
      fs.writeFileSync(filename, '{}');
    }
  }

  function read(filename) {
    return JSON.parse(fs.readFileSync(filename, 'utf8'));
  }

  function write(filename, data) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  }

};
