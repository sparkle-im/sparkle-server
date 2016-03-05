import mongoose from 'mongoose';
import MessageCounter from './MessageCounter';
import { hexStringValidator, base64StringValidator } from '../utils';
const messageSchema = new mongoose.Schema({
  messageId: {
    type: Number,
    required: true,
    validate: {
      validator: n => Number.isInteger(n) && n >= 0,
      message: '{VALUE} is not a valid natural number!'
    }
  },
  receiver: {
    type: String,
    required: true,
    validate: {
      validator: s => s.length === (256 / 4) && hexStringValidator(s),
      message: '{VALUE} is not a valid hexstring!'
    },
    lowercase: true
  },
  message: {
    type: String,
    required: true,
    validate: {
      validator: base64StringValidator,
      message: '{VALUE} is not a valid base64 string!'
    }
  }

}, { id: false, timestamps: { createdAt: 'created_at' } });

messageSchema.pre('save', function preSaveHook(next) {
  MessageCounter.getNextMessageCountById(this.receiver).then(count => {
    this.messageId = count; // Add incremental id for message before save.
    next();
  }).catch(next);
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
