# hoagie-session

"Session" storage for [hoagie][hoagie] applications.

> [![NPM version][npm-badge]][npm]
> [![Build Status][travis-badge]][travis-ci]

## Install

``` bash
$ npm install hoagie hoagie-session --save
```

## Usage

``` js
var hoagie = require('hoagie');
var session = require('hoagie-session');

var app = hoagie();

// On the first request, this will write a JSON file
// in the user's HOME directory named after the program.
// For example, if the program name is `math`, the file
// name is `~/.math` by default. You may specify another
// filename to session() if you like;

app.use(session());

app.use(function(req, res, next) {

  // The contents of the session file will be read, parsed,
  // and assigned to `req.session`.
  req.session; // {}

  // You may mutate req.session during the request and the
  // changes will be saved to the file.
  req.session.username = req.get('LOGNAME');

  next();
});

app.run(process.argv.slice(2));
```

## License

[ISC License][LICENSE]

[hoagie]: https://github.com/jeremyruppel/hoagie
[npm]: http://badge.fury.io/js/hoagie-session
[npm-badge]: https://badge.fury.io/js/hoagie-session.svg
[travis-ci]: https://travis-ci.org/jeremyruppel/hoagie-session
[travis-badge]: https://travis-ci.org/jeremyruppel/hoagie-session.svg?branch=master
[LICENSE]: https://github.com/jeremyruppel/hoagie-session/blob/master/LICENSE
