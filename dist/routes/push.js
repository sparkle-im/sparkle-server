'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _GCMToken = require('../models/GCMToken');

var _GCMToken2 = _interopRequireDefault(_GCMToken);

var _PublicKey = require('../models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();
const sendStatus = (res, status) => () => res.sendStatus(status);

// TODO: Verify signature before save token.
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  _PublicKey2.default.findById(receiver).then(key => {
    if (key && key.key && req.body.registration_id) {
      const token = new _GCMToken2.default({ _id: receiver, token: req.body.registration_id });
      token.save().then(sendStatus(res, 200)).catch(sendStatus(res, 404));
    } else {
      sendStatus(res, 404)();
    }
  }).catch(sendStatus(res, 404));
});

exports.default = router;