import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';
const app = express();
app.use(bodyParser.json());
app.use('/v1', routes);
export default app;
