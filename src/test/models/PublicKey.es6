/* eslint-env node, mocha */
import assert from 'assert';
import crypto from 'crypto';
import PublicKey from '../../models/PublicKey';
import { sha256sum } from '../../utils';

describe('PublicKey Model', () => {
  beforeEach('Clear PublicKey collection', (done) => {
    PublicKey.remove({}).then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 0);
        done();
      });
    }).catch(done);
  });

  it('PublicKey creation', (done) => {
    const testString = (new Buffer('test')).toString('base64');
    const publicKey = new PublicKey({
      key: testString
    });
    publicKey.save().then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 1);
        done();
      });
    }).catch(done);
  });

  it('Multiple PublicKey creation', (done) => {
    const TESTCASE_SIZE = 16;
    let completedPromises = 0;
    const countedDone = () => {
      if (++completedPromises === TESTCASE_SIZE) {
        PublicKey.count({}, (err, count) => {
          assert.ifError(err);
          assert.equal(count, TESTCASE_SIZE);
          done();
        });
      }
    };
    for (let i = 0; i < TESTCASE_SIZE; i++) {
      const testString = (new Buffer(`test${i}`)).toString('base64');
      (new PublicKey({
        key: testString
      })).save().then(countedDone).catch(done);
    }
  });

  it('PublicKey creation and retrieval', (done) => {
    const randomKey = crypto.randomBytes(1024).toString('base64');
    const randomKeyHash = sha256sum(new Buffer(randomKey, 'base64'));
    const publicKey = new PublicKey({ key: randomKey });
    publicKey.save().then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 1);
        PublicKey.findById(randomKeyHash).then((key) => {
          assert.equal(key.key, randomKey);
          done();
        }).catch(done);
      });
    }).catch(done);
  });

  it('Fail on key is not base64 format', (done) => {
    const testString = new Buffer('test$$$$$$$');
    const publicKey = new PublicKey({
      key: testString
    });
    publicKey.save().catch(e => {
      if (e.name === 'ValidationError' && e.message === 'PublicKey validation failed') {
        done();
      } else {
        done(e);
      }
    });
  });
});
