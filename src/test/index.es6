/* eslint-env node, mocha */
import mongoose from 'mongoose';
import config from '../config';
before('Connect to MongoDB', (done) => {
  mongoose.connect(config.mongodb).then(() => {
    done();
  });
});

after('Disconnect from MongoDB', (done) => {
  mongoose.disconnect().then(() => {
    done();
  });
});
