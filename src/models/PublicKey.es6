import mongoose from 'mongoose';
import { hexStringValidator, base64StringValidator } from '../utils';
const publicKeySchema = new mongoose.Schema({
  sha256sum: {
    type: String,
    required: true,
    validate: {
      validator: hexStringValidator,
      message: '{VALUE} is not a valid hexstring!'
    }
  },
  key: {
    type: String,
    required: true,
    validate: {
      validator: base64StringValidator,
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

const PublicKey = mongoose.model('PublicKey', publicKeySchema);
export default PublicKey;
