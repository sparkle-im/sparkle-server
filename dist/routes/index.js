'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

var _messages = require('./messages');

var _messages2 = _interopRequireDefault(_messages);

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = new _express.Router();

router.use('/keys', _keys2.default);
router.use('/messages', _messages2.default);
router.use('/push', _push2.default);

exports.default = router;