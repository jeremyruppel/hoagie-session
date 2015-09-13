var fs = require('fs');

module.exports = function session(filename) {
  return function(req, res, next) {
    touch(filename);

    try {
      req.session = read(filename);
    } catch (err) {
      return next(err);
    }

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

};
