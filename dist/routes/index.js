'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _keys = require('./keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as messages from './messages';
// import * as push from './push';
const router = new _express.Router();

router.use('/keys', _keys2.default);
// router.use('/messages', messages);
// router.use('/push', push);

exports.default = router;