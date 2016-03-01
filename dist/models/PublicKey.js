'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const publicKeySchema = new _mongoose2.default.Schema({
  sha256sum: {
    type: String,
    required: true,
    validate: {
      validator: s => /^[a-f0-9]+$/.test(s),
      message: '{VALUE} is not a valid hexstring!'
    }
  },
  key: {
    type: String,
    required: true,
    validate: {
      validator: s => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s),
      message: '{VALUE} is not a valid base64 string!'
    }
  },
  date: { type: Date, default: Date.now }
});

publicKeySchema.statics.findByHash = function findByHash(sha256sum) {
  return new Promise((resolve, reject) => {
    this.findOne({ sha256sum }, { key: 1, sha256sum: 1, date: 1 }, (err, publicKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(publicKey);
      }
    });
  });
};

const PublicKey = _mongoose2.default.model('PublicKey', publicKeySchema);
exports.default = PublicKey;