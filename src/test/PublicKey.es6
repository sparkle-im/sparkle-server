/* eslint-env node, mocha */
import assert from 'assert';
import crypto from 'crypto';
import PublicKey from '../models/PublicKey';
function sha256sum(s) {
  return crypto.createHash('sha256').update(s).digest('hex');
}

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
    const publicKey = new PublicKey({ key: 'test', sha256sum: sha256sum('test') });
    publicKey.save().then(() => {
      PublicKey.count({}, (err, count) => {
        assert.ifError(err);
        assert.equal(count, 1);
        done();
      });
    });
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
      (new PublicKey({ key: `test${i}`, sha256sum: sha256sum(`test${i}`) }))
        .save().then(countedDone);
    }
  });

  it('PublicKey creation and retrieval', (done) => {
    const randomKey = crypto.randomBytes(1024).toString('base64');
    const randomKeyHash = sha256sum(randomKey);
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
