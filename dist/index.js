'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Main: The entry point.
 */
class Main {
  static main() {
    _mongoose2.default.connect(_config2.default.mongodb).then(() => {
      console.log(`mongoose connected to ${ _config2.default.mongodb }`);
      // Server should start after database connection established.
      _app2.default.listen(_config2.default.port, () => {
        console.log(`sparkle server listening on port ${ _config2.default.port }.`);
      });
    });
  }
}

Main.main();