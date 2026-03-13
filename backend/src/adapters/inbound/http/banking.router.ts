import { Router } from 'express';
import { bank, apply } from './banking.controller';

const router = Router();

router.post('/bank', bank);
router.post('/apply', apply);

export { router as bankingRouter };
