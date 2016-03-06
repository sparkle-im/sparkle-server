'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _Message = require('../../models/Message');

var _Message2 = _interopRequireDefault(_Message);

var _MessageCounter = require('../../models/MessageCounter');

var _MessageCounter2 = _interopRequireDefault(_MessageCounter);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } } /* eslint-env node, mocha */


const clearCollections = done => {
  _Message2.default.remove({}).then(() => {
    _Message2.default.count({}).then(messageCount => {
      _assert2.default.equal(messageCount, 0);
      _MessageCounter2.default.remove({}).then(() => {
        _MessageCounter2.default.count({}).then(messageCounterCount => {
          _assert2.default.equal(messageCounterCount, 0);
          done();
        }).catch(done);
      }).catch(done);
    }).catch(done);
  }).catch(done);
};

describe('Message Model', () => {
  beforeEach('Clear Message collection', clearCollections);
  afterEach('Clear Message collection', clearCollections);

  it('Messages save and retrive', done => {
    const TEST_COUNT = 16;
    const receiver = (0, _utils.sha256sum)('TEST_RECEIVER');
    const messages = [].concat(_toConsumableArray(Array(TEST_COUNT).keys())).map(n => new _Message2.default({
      receiver,
      message: new Buffer(`Message No.${ n }`).toString('base64')
    }));
    const messagePromises = messages.map(message => message.save());
    Promise.all(messagePromises).then(values => {
      _Message2.default.getMessageCountByReceiver(receiver).then(count => {
        _assert2.default.equal(values.length, TEST_COUNT);
        _assert2.default.equal(count, TEST_COUNT);
        const QUERY_SIZE = Math.floor(TEST_COUNT / 2);
        _Message2.default.getMessagesByReceiver(receiver, { since: 0, count: QUERY_SIZE }).then(ms => {
          _assert2.default.equal(ms.length, QUERY_SIZE);
          done();
        }).catch(done);
      }).catch(done);
    }).catch(done);
  });
});