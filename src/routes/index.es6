import { Router } from 'express';
import keys from './keys';
import messages from './messages';
const router = new Router();

router.use('/keys', keys);
router.use('/messages', messages);
// router.use('/push', push);

export default router;
