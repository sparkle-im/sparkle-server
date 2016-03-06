import mongoose from 'mongoose';
import { hexStringValidator, base64StringValidator, sha256sum } from '../utils';
const publicKeySchema = new mongoose.Schema({
  _id: {
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
      this._id = sha256sum(new Buffer(key, 'base64'));
      return key;
    }
  }
});

const PublicKey = mongoose.model('PublicKey', publicKeySchema);
export default PublicKey;
