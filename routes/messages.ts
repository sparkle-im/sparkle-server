// TODO: testing.
import {Router} from 'express';
const router = Router();
import {getDatabase} from '../models/index';
import {ObjectID} from 'mongodb';
const messageCollection = () => getDatabase().collection('messages');
const keyCollection = () => getDatabase().collection('keys');
// Sending new messages
// TODO: verify request.
router.post('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
    const receiver_id = (<string>req.params.receiver_id).toLowerCase();
    const sender_id = (<string>req.body.sender_id).toLowerCase();
    const messages = <string[]>req.body.messages;
    const timestamp = Date.now();
    keyCollection().findOne({ sha256sum: sender_id }, { fields: { key: 1 } }, (err, result) => { // Ensure sender key exist.
        if (err || result === undefined || result === null) {
            res.sendStatus(404);
        }
        else {
            keyCollection().findOne({ sha256sum: receiver_id }, { fields: { key: 1 } }, (err, result) => { // Ensure receiver key exist.
                if (err || result === undefined || result === null) {
                    res.sendStatus(404);
                }
                else {
                    const collection = messageCollection();
                    messages.forEach((message) => {
                        collection.insertOne({ sender_id: sender_id, receiver_id: receiver_id, data: message, timestamp: timestamp });
                        res.sendStatus(200);
                    });
                }
            });
        }
    });
});
// Getting new messages
router.get('/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
    const receiver_id = (<string>req.params.receiver_id).toLowerCase();
    const since_id = <string>req.query.since_id;
    const count = <string>req.query.count;
    const object_id_pattern = /^[0-9a-fA-F]+$/;
    const number_pattern = /^[0-9]+$/;
    let message_limit = 50;
    if (count != undefined && count != null && count.match(number_pattern) && parseInt(count) < 50) {
        message_limit = parseInt(count);
    }
    if (since_id != null && since_id != undefined && since_id.match(object_id_pattern)) {
        const since_object_id = ObjectID.createFromHexString(since_id);
        messageCollection().find({ _id: { $gt: since_object_id } }).limit(message_limit, (err, result) => {
            result = (<[{ id: string; _id: string }]>result).map((value) => { value.id = value._id; return value; });
            res.send(JSON.stringify(result));
        });
    }
    else {
        messageCollection().find().limit(message_limit, (err, result) => {
            result = (<[{ id: string; _id: string }]>result).map((value) => { value.id = value._id; return value; });
            res.send(JSON.stringify(result));
        });
    }
});





export = router;