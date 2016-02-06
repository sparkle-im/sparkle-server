import * as assert from 'assert';
import {MongoClient} from 'mongodb';
import * as config from './config';
import {setDatabase, getDatabase} from './models/index';
import * as app from './app';
import * as http from 'http';
class Main {
    public static main(args?: string[]): number {
        MongoClient.connect(config.mongodb, (error, db) => {
            assert.ifError(error);
            assert.notEqual(db, undefined);
            assert.notEqual(db, null);
            // Share database connection among app.
            setDatabase(db);
            assert.equal(db, getDatabase());
            const server = http.createServer(app);
            server.listen(config.port); // fire up!
            console.log('listening on: ' + config.port);
        });
        return 0;
    }
}

Main.main();