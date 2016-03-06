import mongoose from 'mongoose';
import { hexStringValidator } from '../utils';
const gcmTokenSchema = new mongoose.Schema({
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
  token: {
    type: String,
    required: true
  }
});

const GCMToken = mongoose.model('GCMToken', gcmTokenSchema);
export default GCMToken;
