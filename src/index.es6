import mongoose from 'mongoose';
import app from './app';
import config from './config';
import PublicKey from './models/PublicKey';
class Main {
  static main() {
    mongoose.connect(config.mongodb).then(() => {
      console.log(`mongoose connected to ${config.mongodb}`);

      const testKey = new PublicKey({ sha256sum: 'Hellod', key: 'World' });
      testKey.save((err) => {
        if (err) {
          console.log(err);
        } else {
          PublicKey.findByHash('Hellod').then((key) => { console.log(key.key); });
        }
      });
      // Server should start after database connection established.
      app.listen(config.port, () => {
        console.log(`sparkle server listening on port ${config.port}.`);
      });
    });
  }
}

Main.main();
