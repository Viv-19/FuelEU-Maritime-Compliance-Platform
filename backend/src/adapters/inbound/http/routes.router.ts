import { Router } from 'express';
import { getRoutes, setBaseline, getComparison, addRoute } from './routes.controller';

const router = Router();

router.get('/', getRoutes);
router.post('/:id/baseline', setBaseline);
router.get('/comparison', getComparison);
router.post('/', addRoute);

export { router as routesRouter };
