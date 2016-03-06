import { Router } from 'express';
import keys from './keys';
// import * as messages from './messages';
// import * as push from './push';
const router = new Router();

router.use('/keys', keys);
// router.use('/messages', messages);
// router.use('/push', push);

export default router;
