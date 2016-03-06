'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _PublicKey = require('../models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
// Requesting a public key by its sha256sum.
router.get('/:sha256sum([0-9a-fA-F]{64})', (req, res) => {
  const sha256sum = req.params.sha256sum.toLowerCase();
  _PublicKey2.default.findById(sha256sum).then(key => {
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
  const sha256sum = (0, _utils.sha256sum)(new Buffer(key, 'base64'));
  _PublicKey2.default.findById(sha256sum).exec().then(doc => {
    if (doc && doc.key && doc._id) {
      res.send({ sha256sum: doc._id });
    } else {
      const publicKey = new _PublicKey2.default({ key });
      publicKey.save().then(saved => {
        res.send({ sha256sum: saved._id });
      }).catch(sendStatus(res, 404));
    }
  }).catch(sendStatus(res, 404));
});

exports.default = router;