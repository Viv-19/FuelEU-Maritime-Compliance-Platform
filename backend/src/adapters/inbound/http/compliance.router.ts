import { Router } from 'express';
import { getCb, getAdjustedCb } from './compliance.controller';

const router = Router();

router.get('/cb', getCb);
router.get('/adjusted-cb', getAdjustedCb);

export { router as complianceRouter };
