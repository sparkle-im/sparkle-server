/* eslint-env node, mocha */
import assert from 'assert';
import MessageCounter from '../../models/MessageCounter';
import { sha256sum } from '../../utils';
const clearCollection = (done) => {
  MessageCounter.remove({}).then(() => {
    MessageCounter.count({}).then(count => {
      assert.equal(count, 0);
      done();
    }).catch(done);
  }).catch(done);
};

describe('MessageCounter Model', () => {
  beforeEach('Clear MessageCounter collection', clearCollection);
  afterEach('Clear MessageCounter collection', clearCollection);

  it('MessageCounter increment', (done) => {
    const testId = sha256sum('TEST');
    MessageCounter.getNextMessageCountById(testId).then(one => {
      assert.equal(one, 1);
      MessageCounter.getNextMessageCountById(testId).then(two => {
        assert.equal(two, 2);
        MessageCounter.getNextMessageCountById(testId).then(three => {
          assert.equal(three, 3);
          done();
        }).catch(done);
      }).catch(done);
    }).catch(done);
  });

  it('MessageCounter increment: 16 times', (done) => {
    const testId = sha256sum('TEST');
    const incrementUntil100 = promise => {
      if (promise) {
        promise.then(count => {
          if (count < 16) {
            incrementUntil100(MessageCounter.getNextMessageCountById(testId));
          } else {
            done();
          }
        }).catch(done);
      } else {
        incrementUntil100(MessageCounter.getNextMessageCountById(testId));
      }
    };
    incrementUntil100();
  });
});
