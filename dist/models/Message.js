'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _MessageCounter = require('./MessageCounter');

var _MessageCounter2 = _interopRequireDefault(_MessageCounter);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messageSchema = new _mongoose2.default.Schema({
  messageId: {
    type: Number,
    required: true,
    validate: {
      validator: n => Number.isInteger(n) && n >= 0,
      message: '{VALUE} is not a valid natural number!'
    }
  },
  receiver: {
    type: String,
    required: true,
    validate: {
      validator: s => s.length === 256 / 4 && (0, _utils.hexStringValidator)(s),
      message: '{VALUE} is not a valid hexstring!'
    },
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    validate: {
      validator: _utils.base64StringValidator,
      message: '{VALUE} is not a valid base64 string!'
    }
  }

}, { id: false, timestamps: { createdAt: 'created_at' } });

messageSchema.pre('save', function preSaveHook(next) {
  _MessageCounter2.default.getNextMessageCountById(this.receiver).then(count => {
    this.messageId = count; // Add incremental id for message before save.
    next();
  }).catch(next);
});

const Message = _mongoose2.default.model('Message', messageSchema);
exports.default = Message;