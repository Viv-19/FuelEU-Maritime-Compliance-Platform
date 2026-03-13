import { Router } from 'express';
import { pool } from './pools.controller';

const router = Router();

router.post('/', pool);

export { router as poolsRouter };
