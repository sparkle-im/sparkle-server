import mongoose from 'mongoose';
const publicKeySchema = new mongoose.Schema({
  sha256sum: { type: String, required: true },
  key: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

publicKeySchema.statics.findByHash = function findByHash(sha256sum) {
  return new Promise((resolve, reject) => {
    this.findOne({ sha256sum }, { key: 1 }, (err, publicKey) => {
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
