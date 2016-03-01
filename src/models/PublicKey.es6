import mongoose from 'mongoose';
const publicKeySchema = new mongoose.Schema({
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

const PublicKey = mongoose.model('PublicKey', publicKeySchema);
export default PublicKey;
