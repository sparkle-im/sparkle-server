'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _PublicKey = require('../models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  const messages = req.body.messages;
  _PublicKey2.default.findById(receiver).then(key => {
    if (key && key.key && messages && Array.isArray(messages) && messages.length >= 1) {
      // Receiver exist and messages exist.
      const messagePromises = messages.map(message => new _Message2.default({ receiver, message }).save());
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
  _PublicKey2.default.findById(receiver).then(key => {
    if (key && key.key) {
      const since = req.query.since;
      const count = req.query.count;
      _Message2.default.getMessagesByReceiver(receiver, { since, count }).then(messages => {
        res.send(messages.map(message => ({
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
exports.default = router;