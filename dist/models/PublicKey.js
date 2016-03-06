'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const publicKeySchema = new _mongoose2.default.Schema({
  _id: {
    type: String,
    required: true,
    validate: {
      validator: s => s.length === 256 / 4 && (0, _utils.hexStringValidator)(s),
      message: '{VALUE} is not a valid hexstring!'
    },
    lowercase: true,
    unique: true
  },
  key: {
    type: String,
    required: true,
    validate: {
      validator: _utils.base64StringValidator,
      message: '{VALUE} is not a valid base64 string!'
    },
    set: function keySetter(key) {
      // sha256sum should be computed automatically on key is set.
      this._id = (0, _utils.sha256sum)(new Buffer(key, 'base64'));
      return key;
    }
  }
});

const PublicKey = _mongoose2.default.model('PublicKey', publicKeySchema);
exports.default = PublicKey;