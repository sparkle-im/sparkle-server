'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gcmTokenSchema = new _mongoose2.default.Schema({
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
  token: {
    type: String,
    required: true
  }
});

const GCMToken = _mongoose2.default.model('GCMToken', gcmTokenSchema);
exports.default = GCMToken;