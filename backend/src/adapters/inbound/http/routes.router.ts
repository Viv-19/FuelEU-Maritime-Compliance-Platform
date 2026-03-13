import { Router } from 'express';
import { getRoutes, setBaseline, getComparison } from './routes.controller';

const router = Router();

router.get('/', getRoutes);
router.post('/:id/baseline', setBaseline);
router.get('/comparison', getComparison);

export { router as routesRouter };
