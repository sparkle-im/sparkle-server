import mongoose from 'mongoose';
import { hexStringValidator, base64StringValidator, sha256sum as computeHash } from '../utils';
const publicKeySchema = new mongoose.Schema({
  sha256sum: {
    type: String,
    required: true,
    validate: {
      validator: s => s.length === (256 / 4) && hexStringValidator(s),
      message: '{VALUE} is not a valid hexstring!'
    },
    lowercase: true,
    unique: true
  },
  key: {
    type: String,
    required: true,
    validate: {
      validator: base64StringValidator,
      message: '{VALUE} is not a valid base64 string!'
    },
    set: function keySetter(key) { // sha256sum should be computed automatically on key is set.
      this.sha256sum = computeHash(new Buffer(key, 'base64'));
      return key;
    }
  }
}, { id: false, timestamps: { createdAt: 'created_at' } });

publicKeySchema.statics.findByHash = function findByHash(sha256sum) {
  return new Promise((resolve, reject) => {
    this.findOne({ sha256sum }, { key: 1, sha256sum: 1, created_at: 1 }, (err, publicKey) => {
      if (err) {
        reject(err);
      } else {
        resolve(publicKey);
      }
    });
  });
};

const PublicKey = mongoose.model('PublicKey', publicKeySchema);
export default PublicKey;
