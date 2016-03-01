'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env node, mocha */

before('Connect to MongoDB', done => {
  _mongoose2.default.connect(_config2.default.mongodb).then(() => {
    done();
  });
});

after('Disconnect from MongoDB', done => {
  _mongoose2.default.disconnect().then(() => {
    done();
  });
});