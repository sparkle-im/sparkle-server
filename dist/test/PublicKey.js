'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _PublicKey = require('../models/PublicKey');

var _PublicKey2 = _interopRequireDefault(_PublicKey);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha256sum(s) {
  return _crypto2.default.createHash('sha256').update(s).digest('hex');
} /* eslint-env node, mocha */


describe('PublicKey Model', () => {
  beforeEach('Clear PublicKey collection', done => {
    _PublicKey2.default.remove({}).then(() => {
      _PublicKey2.default.count({}, (err, count) => {
        _assert2.default.ifError(err);
        _assert2.default.equal(count, 0);
        done();
      });
    });
  });

  it('PublicKey creation', done => {
    const publicKey = new _PublicKey2.default({ key: 'test', sha256sum: sha256sum('test') });
    publicKey.save().then(() => {
      _PublicKey2.default.count({}, (err, count) => {
        _assert2.default.ifError(err);
        _assert2.default.equal(count, 1);
        done();
      });
    });
  });

  it('Multiple PublicKey creation', done => {
    const TESTCASE_SIZE = 16;
    let completedPromises = 0;
    const countedDone = () => {
      if (++completedPromises === TESTCASE_SIZE) {
        _PublicKey2.default.count({}, (err, count) => {
          _assert2.default.ifError(err);
          _assert2.default.equal(count, TESTCASE_SIZE);
          done();
        });
      }
    };
    for (let i = 0; i < TESTCASE_SIZE; i++) {
      new _PublicKey2.default({ key: `test${ i }`, sha256sum: sha256sum(`test${ i }`) }).save().then(countedDone);
    }
  });

  it('PublicKey creation and retrieval', done => {
    const randomKey = _crypto2.default.randomBytes(1024).toString('base64');
    const randomKeyHash = sha256sum(randomKey);
    const publicKey = new _PublicKey2.default({ key: randomKey, sha256sum: randomKeyHash });
    publicKey.save().then(() => {
      _PublicKey2.default.count({}, (err, count) => {
        _assert2.default.ifError(err);
        _assert2.default.equal(count, 1);
        _PublicKey2.default.findByHash(randomKeyHash).then(key => {
          _assert2.default.equal(key.key, randomKey);
          done();
        }).catch(_assert2.default.ifError(err));
      });
    });
  });
});