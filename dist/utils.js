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

/**
 * Compute sha256sum for given buffer.
 * @param {Buffer|string} - A Buffer, however string is acceptable too.
 * @return {string} sha256sum for buffer in hexstring.
 */
function sha256sum(buffer) {
  return _crypto2.default.createHash('sha256').update(buffer).digest('hex');
}
/**
 * Validate string with hexstring pattern.
 * @param {string} s
 * @return {boolean}
 */
function hexStringValidator(s) {
  return (/^[0-9a-fA-F]+$/.test(s)
  );
}
/**
 * Validate string with base64 pattern.
 * @param {string} s
 * @return {boolean}
 */
function base64StringValidator(s) {
  return (/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s)
  );
}