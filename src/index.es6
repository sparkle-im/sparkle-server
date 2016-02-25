import mongoose from 'mongoose';
import app from './app';
import config from './config';
class Main {
    static main(args) {
        mongoose.connection.on('connected', () => {
            console.log(`mongoose connected to ${config.mongodb}`);
            // Server should start after database connection established.
            app.listen(config.port, () => {
                console.log(`sparkle server listening on port ${config.port}.`);
            });
        });
        mongoose.connect(config.mongodb);
    }
}

Main.main(process.argv);