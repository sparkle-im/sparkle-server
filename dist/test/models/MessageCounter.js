'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _MessageCounter = require('../../models/MessageCounter');

var _MessageCounter2 = _interopRequireDefault(_MessageCounter);

var _utils = require('../../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const clearCollection = done => {
  _MessageCounter2.default.remove({}).then(() => {
    _MessageCounter2.default.count({}, (err, count) => {
      _assert2.default.ifError(err);
      _assert2.default.equal(count, 0);
      done();
    });
  }).catch(done);
}; /* eslint-env node, mocha */


describe('MessageCounter Model', () => {
  beforeEach('Clear MessageCounter collection', clearCollection);
  afterEach('Clear MessageCounter collection', clearCollection);

  it('MessageCounter increment', done => {
    const testId = (0, _utils.sha256sum)('TEST');
    _MessageCounter2.default.getNextMessageCountById(testId).then(one => {
      _assert2.default.equal(one, 1);
      _MessageCounter2.default.getNextMessageCountById(testId).then(two => {
        _assert2.default.equal(two, 2);
        _MessageCounter2.default.getNextMessageCountById(testId).then(three => {
          _assert2.default.equal(three, 3);
          done();
        }).catch(done);
      }).catch(done);
    }).catch(done);
  });

  it('MessageCounter increment: 16 times', done => {
    const testId = (0, _utils.sha256sum)('TEST');
    const incrementUntil100 = promise => {
      if (promise) {
        promise.then(count => {
          if (count < 16) {
            incrementUntil100(_MessageCounter2.default.getNextMessageCountById(testId));
          } else {
            done();
          }
        }).catch(done);
      } else {
        incrementUntil100(_MessageCounter2.default.getNextMessageCountById(testId));
      }
    };
    incrementUntil100();
  });
});