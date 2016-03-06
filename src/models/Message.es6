import mongoose from 'mongoose';
import MessageCounter from './MessageCounter';
import { hexStringValidator, base64StringValidator } from '../utils';
const messageSchema = new mongoose.Schema({
  messageId: {
    type: Number,
    required: true,
    default: 0,
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

}, { id: false, timestamps: { createdAt: 'timestamp' } });

messageSchema.pre('save', function preSaveHook(next) {
  MessageCounter.getNextMessageCountById(this.receiver).then(count => {
    this.messageId = count; // Add incremental id for message before save.
    next();
  }).catch(next);
});
/**
 * Get messages by receiver's id.
 * @param {string} receiver - sha256sum of receiver's public key.
 * @param {object} options - specify options for query.
 * @param {number} options.since - return messages with messageId >= since.
 * @param {number} options.count - maximum count of messages to return.
 * @return {Promise<Document, Error>} promise of messages
 */
messageSchema.statics.getMessagesByReceiver = function getMessagesByReceiver(receiver, options) {
  let since = 1;
  let count = 10;
  if (options) {
    since = options.since || since;
    count = options.count || count;
  }
  return this.where({ receiver })
    .where('messageId').gte(since)
    .limit(count).exec();
};
messageSchema.statics.getMessageCountByReceiver = function getMessageCountByReceiver(receiver) {
  return this.where({ receiver }).count().exec();
};

const Message = mongoose.model('Message', messageSchema);
export default Message;
