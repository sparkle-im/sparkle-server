'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _PublicKey = require('./models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
  static main() {
    _mongoose2.default.connect(_config2.default.mongodb).then(() => {
      console.log(`mongoose connected to ${ _config2.default.mongodb }`);

      const testKey = new _PublicKey2.default({ sha256sum: 'Hellod', key: 'World' });
      testKey.save(err => {
        if (err) {
          console.log(err);
        } else {
          _PublicKey2.default.findByHash('Hellod').then(key => {
            console.log(key.key);
          });
        }
      });
      // Server should start after database connection established.
      _app2.default.listen(_config2.default.port, () => {
        console.log(`sparkle server listening on port ${ _config2.default.port }.`);
      });
    });
  }
}

Main.main();