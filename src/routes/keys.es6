import { Router } from 'express';
import PublicKey from '../models/PublicKey';
import { sha256sum as computeHash } from '../utils';
const router = new Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
// Requesting a public key by its sha256sum.
router.get('/:sha256sum([0-9a-fA-F]{64})', (req, res) => {
  const sha256sum = req.params.sha256sum.toLowerCase();
  PublicKey.findById(sha256sum).then((key) => {
    if (key && key.key) {
      res.send({ key: key.key });
    } else {
      sendStatus(res, 404)();
    }
  }).catch(sendStatus(res, 404));
});
// Registering new public key.
router.post('/', (req, res) => {
  const key = req.body.key;
  const sha256sum = computeHash(new Buffer(key, 'base64'));
  PublicKey.findById(sha256sum).exec().then(doc => {
    if (doc && doc.key && doc._id) {
      res.send({ sha256sum: doc._id });
    } else {
      const publicKey = new PublicKey({ key });
      publicKey.save().then(saved => {
        res.send({ sha256sum: saved._id });
      }).catch(sendStatus(res, 404));
    }
  }).catch(sendStatus(res, 404));
});

export default router;
