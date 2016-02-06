import * as crypto from 'crypto';
import {Router} from 'express';
import {getDatabase} from '../models/index';
const router = Router();
const keyCollection = () => getDatabase().collection('keys');

// Requesting a public key by its sha256sum.
router.get('/:sha256sum([0-9a-fA-F]{64})', (req, res) => {
    const sha256sum: string = (<string>req.params.sha256sum).toLowerCase();;
    keyCollection().findOne({ sha256sum: sha256sum }, { fields: { key: 1 } }, (err, result) => {
        if (err || result === undefined || result === null) {
            res.sendStatus(404);
        }
        else {
            res.send({ key: result.key });
        }
    });


});
// Registering new public key.
// TODO: report 404 for malformed public key.
router.post('/', (req, res) => {
    const key = <string>req.body.key;
    const hash = crypto.createHash('sha256');
    const keyBuffer = new Buffer(key, 'base64');
    const sha256sum: string = hash.update(keyBuffer).digest('hex');
    keyCollection().findOne({ sha256sum: sha256sum }, { fields: { key: 1 } }, (err, result) => {
        if (result === undefined || result === null) {
            keyCollection().insertOne({ sha256sum: sha256sum, key: key }, (err, result) => {
                res.send({ sha256sum: sha256sum });
            });
        }
        else {
            res.sendStatus(409);
        }
    });
});


// Registering new shared secret
// TODO: verify request.
router.post('/:sender_id([0-9a-fA-F]{64})/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
    const combined_id = (<string>req.params.sender_id).toLowerCase() + (<string>req.params.receiver_id).toLowerCase();
    const secret = <string>req.body.secret;
    keyCollection().updateOne({ combined_id: combined_id }, { $set: {secret: secret}}, { upsert: true }, (err, result) => {
        if (err) {
            res.sendStatus(415);
        }
        else {
            res.sendStatus(200);
        }
    });
});

// Getting shared secret
router.get('/:sender_id([0-9a-fA-F]{64})/:receiver_id([0-9a-fA-F]{64})', (req, res) => {
    const combined_id = (<string>req.params.sender_id).toLowerCase() + (<string>req.params.receiver_id).toLowerCase();
    keyCollection().findOne({ combined_id: combined_id }, { fields: { secret: 1 } }, (err, result) => {
        if (result === undefined || result === null) {
            res.sendStatus(404);
        }
        else {
            res.send({ secret: result.secret });
        }
    });
});



export = router;