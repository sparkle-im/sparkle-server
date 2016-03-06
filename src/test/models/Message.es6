/* eslint-env node, mocha */
import assert from 'assert';
import Message from '../../models/Message';
import MessageCounter from '../../models/MessageCounter';
import { sha256sum } from '../../utils';
const clearCollections = (done) => {
  Message.remove({}).then(() => {
    Message.count({}).then(messageCount => {
      assert.equal(messageCount, 0);
      MessageCounter.remove({}).then(() => {
        MessageCounter.count({}).then(messageCounterCount => {
          assert.equal(messageCounterCount, 0);
          done();
        }).catch(done);
      }).catch(done);
    }).catch(done);
  }).catch(done);
};

describe('Message Model', () => {
  beforeEach('Clear Message collection', clearCollections);
  afterEach('Clear Message collection', clearCollections);

  it('Messages save and retrive', (done) => {
    const TEST_COUNT = 16;
    const receiver = sha256sum('TEST_RECEIVER');
    const messages = [...Array(TEST_COUNT).keys()].map(n => new Message({
      receiver,
      message: new Buffer(`Message No.${n}`).toString('base64')
    }));
    const messagePromises = messages.map(message => message.save());
    Promise.all(messagePromises).then(values => {
      Message.getMessageCountByReceiver(receiver)
        .then(count => {
          assert.equal(values.length, TEST_COUNT);
          assert.equal(count, TEST_COUNT);
          const QUERY_SIZE = Math.floor(TEST_COUNT / 2);
          Message.getMessagesByReceiver(receiver, { since: 0, count: QUERY_SIZE })
            .then(ms => {
              assert.equal(ms.length, QUERY_SIZE);
              done();
            }).catch(done);
        }).catch(done);
    }).catch(done);
  });
});
