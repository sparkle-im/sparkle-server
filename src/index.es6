import mongoose from 'mongoose';
import app from './app';
import config from './config';
/**
 * Main: The entry point.
 */
class Main {
  static main() {
    mongoose.connect(config.mongodb).then(() => {
      console.log(`mongoose connected to ${config.mongodb}`);
      // Server should start after database connection established.
      app.listen(config.port, () => {
        console.log(`sparkle server listening on port ${config.port}.`);
      });
    });
  }
}

Main.main();
