import { Router } from 'express';
import GCMToken from '../models/GCMToken';
import PublicKey from '../models/PublicKey';
const router = new Router();
const sendStatus = (res, status) => () => res.sendStatus(status);

// TODO: Verify signature before save token.
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  PublicKey.findById(receiver)
    .then((key) => {
      if (key && key.key && req.body.registration_id) {
        const token = new GCMToken({ _id: receiver, token: req.body.registration_id });
        token.save()
          .then(sendStatus(res, 200))
          .catch(sendStatus(res, 404));
      } else {
        sendStatus(res, 404)();
      }
    }).catch(sendStatus(res, 404));
});

export default router;
