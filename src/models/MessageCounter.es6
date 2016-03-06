import mongoose from 'mongoose';
import { hexStringValidator } from '../utils';
const messageCounterSchema = new mongoose.Schema({
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
  count: {
    type: Number,
    required: true,
    validate: {
      validator: n => Number.isInteger(n) && n >= 0,
      message: '{VALUE} is not a valid natural number!'
    },
    default: 0
  }
});

messageCounterSchema.statics.getNextMessageCountById = function getMessageCountById(id) {
  return new Promise((resolve, reject) => {
    this.findByIdAndUpdate(id, { $inc: { count: 1 } }, { new: true, upsert: true })
      .exec()
      .then(counter => resolve(counter.count)).catch(reject);
  });
};


const MessageCounter = mongoose.model('MessageCounter', messageCounterSchema);
export default MessageCounter;
