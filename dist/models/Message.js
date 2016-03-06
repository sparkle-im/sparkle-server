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
    default: 0,
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

}, { id: false });

messageSchema.pre('save', function preSaveHook(next) {
  _MessageCounter2.default.getNextMessageCountById(this.receiver).then(count => {
    this.messageId = count; // Add incremental id for message before save.
    next();
  }).catch(next);
});
/**
 * Get messages by receiver's id.
 * @param {string} receiver - sha256sum of receiver's public key.
 * @param {object} options - specify options for query.
 * @param {number} options.since - return messages with messageId >= since.
 * @param {number} options.count - maximum count of messages to return.
 * @return {Promise<Document, Error>} promise of messages
 */
messageSchema.statics.getMessagesByReceiver = function getMessagesByReceiver(receiver, options) {
  let since = 1;
  let count = 10;
  if (options) {
    since = options.since || since;
    count = options.count || count;
  }
  return this.where({ receiver }).where('messageId').gte(since).limit(count).exec();
};
messageSchema.statics.getMessageCountByReceiver = function getMessageCountByReceiver(receiver) {
  return this.where({ receiver }).count().exec();
};

const Message = _mongoose2.default.model('Message', messageSchema);
exports.default = Message;