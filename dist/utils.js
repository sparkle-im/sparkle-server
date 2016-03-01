'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sha256sum = sha256sum;
exports.hexStringValidator = hexStringValidator;
exports.base64StringValidator = base64StringValidator;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha256sum(buffer) {
  return _crypto2.default.createHash('sha256').update(buffer).digest('hex');
}

function hexStringValidator(s) {
  return (/^[a-f0-9]+$/.test(s)
  );
}

function base64StringValidator(s) {
  return (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)
  );
}