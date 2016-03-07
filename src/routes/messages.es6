import { Router } from 'express';
import gcm from 'node-gcm';
import Message from '../models/Message';
import PublicKey from '../models/PublicKey';
import GCMToken from '../models/GCMToken';
import config from '../config';
const router = new Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  const message = req.body.message;
  PublicKey.findById(receiver).then((key) => {
    if (key
      && key.key
      && message) { // Receiver exist and message exist.
      new Message({ receiver, message }).save().then(m => {
        GCMToken.findById(receiver).then(doc => {
          if (doc && doc.token) {
            const token = doc.token;
            const sender = new gcm.Sender(config.GCM_API_KEY);
            const gcmMessage = new gcm.Message();
            gcmMessage.addData('id', m.messageId);
            gcmMessage.addData('message', m.message);
            gcmMessage.addData('timestamp', m.timestamp);
            sender.send(gcmMessage, { registrationTokens: token }, (err, response) => {
              if (err) {
                console.error(`GCM Error: ${err}`);
              } else {
                console.log(`GCM Sent: ${response}`);
              }
            });
          }
        });
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
            res.send({
              messages: messages
                .map(message => ({
                  id: message.messageId,
                  message: message.message,
                  timestamp: message.timestamp
                }
              ))
            });
          }).catch(sendStatus(res, 404));
      } else {
        sendStatus(res, 404)();
      }
    }).catch(sendStatus(res, 404));
});
export default router;
