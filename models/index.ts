import {Db} from 'mongodb';
let database: Db;

export function setDatabase(db: Db) {
    database = db;
}

export function getDatabase(): Db {
    return database;
}