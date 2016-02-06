import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as routes from './routes/index';
const app = express();
app.use(bodyParser.json());
app.use('/v0', routes);









export = app;