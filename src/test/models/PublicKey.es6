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
    });
  });

  it('PublicKey creation', (done) => {
    const testString = (new Buffer('test')).toString('base64');
    const publicKey = new PublicKey({
      key: testString,
      sha256sum: sha256sum(new Buffer(testString, 'base64'))
    });
    publicKey.save().then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 1);
        done();
      });
    }).catch(err => assert.ifError(err));
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
        key: testString,
        sha256sum: sha256sum(new Buffer(testString, 'base64'))
      })).save().then(countedDone);
    }
  });

  it('PublicKey creation and retrieval', (done) => {
    const randomKey = crypto.randomBytes(1024).toString('base64');
    const randomKeyHash = sha256sum(new Buffer(randomKey, 'base64'));
    const publicKey = new PublicKey({ key: randomKey, sha256sum: randomKeyHash });
    publicKey.save().then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 1);
        PublicKey.findByHash(randomKeyHash).then((key) => {
          assert.equal(key.key, randomKey);
          done();
        }).catch(assert.ifError(err));
      });
    });
  });
});
