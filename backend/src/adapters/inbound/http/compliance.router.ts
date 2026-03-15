import { Router } from 'express';
import { getAllCb, getCb, getAdjustedCb } from './compliance.controller';

const router = Router();

router.get('/cb', getCb);
router.get('/cb/all', getAllCb);
router.get('/adjusted-cb', getAdjustedCb);

export { router as complianceRouter };
