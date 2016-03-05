'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const messageCounterSchema = new _mongoose2.default.Schema({
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
  count: {
    type: Number,
    required: true,
    validate: {
      validator: n => Number.isInteger(n) && n >= 0,
      message: '{VALUE} is not a valid natural number!'
    },
    default: 0
  }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

messageCounterSchema.statics.getNextMessageCountById = function getMessageCountById(id) {
  return new Promise((resolve, reject) => {
    this.findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true, upsert: true }).exec().then(counter => resolve(counter.count)).catch(reject);
  });
};

const MessageCounter = _mongoose2.default.model('MessageCounter', messageCounterSchema);
exports.default = MessageCounter;