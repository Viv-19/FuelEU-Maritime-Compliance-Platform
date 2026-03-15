import { Router } from 'express';
import { getAllCb, getCb } from './compliance.controller';

const router = Router();

router.get('/cb', getCb);
router.get('/cb/all', getAllCb);

export { router as complianceRouter };
