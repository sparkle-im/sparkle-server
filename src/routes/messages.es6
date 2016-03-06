import { Router } from 'express';
import Message from '../models/Message';
import PublicKey from '../models/PublicKey';
const router = new Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  const messages = req.body.messages;
  PublicKey.findById(receiver).then((key) => {
    if (key
      && key.key
      && messages
      && Array.isArray(messages)
      && messages.length >= 1) { // Receiver exist and messages exist.
      const messagePromises = messages.map(message => new Message({ receiver, message }).save());
      Promise.all(messagePromises).then(values => {
        const gcmSend = e => e; // TODO
        gcmSend(values);
        sendStatus(res, 200)();
      }).catch(sendStatus(res, 404));
    } else {
      sendStatus(res, 404)();
    }
  }).catch(sendStatus(res, 404));
});
router.get('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  PublicKey.findById(receiver)
    .then((key) => {
      if (key && key.key) {
        const since = req.query.since;
        const count = req.query.count;
        Message.getMessagesByReceiver(receiver, { since, count })
          .then(messages => {
            res.send(messages
              .map(message => ({
                id: message.messageId,
                message: message.message,
                timestamp: message.timestamp
              })));
          }).catch(sendStatus(res, 404));
      } else {
        sendStatus(res, 404)();
      }
    }).catch(sendStatus(res, 404));
});
export default router;
