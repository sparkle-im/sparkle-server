'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _nodeGcm = require('node-gcm');

var _nodeGcm2 = _interopRequireDefault(_nodeGcm);

var _Message = require('../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _PublicKey = require('../models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

var _GCMToken = require('../models/GCMToken');

var _GCMToken2 = _interopRequireDefault(_GCMToken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();
const sendStatus = (res, status) => () => res.sendStatus(status);
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
  const receiver = req.params.receiver_id.toLowerCase();
  const message = req.body.message;
  _PublicKey2.default.findById(receiver).then(key => {
    if (key && key.key && message) {
      // Receiver exist and message exist.
      new _Message2.default({ receiver, message }).save().then(m => {
        _GCMToken2.default.findById(receiver).then(doc => {
          if (doc && doc.token) {
            const token = doc.token;
            const sender = new _nodeGcm2.default.Sender(_config2.default.GCM_API_KEY);
            const gcmMessage = new _nodeGcm2.default.Message();
            gcmMessage.addData('id', m.messageId);
            gcmMessage.addData('message', m.message);
            gcmMessage.addData('timestamp', m.timestamp);
            sender.send(gcmMessage, { registrationTokens: token }, (err, response) => {
              if (err) {
                console.error(`GCM Error: ${ err }`);
              } else {
                console.log(`GCM Sent: ${ response }`);
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
  _PublicKey2.default.findById(receiver).then(key => {
    if (key && key.key) {
      const since = req.query.since;
      const count = req.query.count;
      _Message2.default.getMessagesByReceiver(receiver, { since, count }).then(messages => {
        res.send({
          messages: messages.map(message => ({
            id: message.messageId,
            message: message.message,
            timestamp: message.timestamp
          }))
        });
      }).catch(sendStatus(res, 404));
    } else {
      sendStatus(res, 404)();
    }
  }).catch(sendStatus(res, 404));
});
exports.default = router;