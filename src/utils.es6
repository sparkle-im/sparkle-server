import crypto from 'crypto';
export function sha256sum(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function hexStringValidator(s) {
  return /^[a-f0-9]+$/.test(s);
}

export function base64StringValidator(s) {
  return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(s);
}
