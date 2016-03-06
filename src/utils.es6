import crypto from 'crypto';
/**
 * Compute sha256sum for given buffer.
 * @param {Buffer|string} buffer - A Buffer, however string is acceptable too.
 * @return {string} sha256sum for buffer in hexstring.
 */
export function sha256sum(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}
/**
 * Validate string with hexstring pattern.
 * @param {string} s
 * @return {boolean}
 */
export function hexStringValidator(s) {
  return /^[0-9a-fA-F]+$/.test(s);
}
/**
 * Validate string with base64 pattern.
 * @param {string} s
 * @return {boolean}
 */
export function base64StringValidator(s) {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s);
}
