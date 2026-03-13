import { Router } from 'express';
import { routesRouter } from './routes.router';
import { complianceRouter } from './compliance.router';
import { bankingRouter } from './banking.router';
import { poolsRouter } from './pools.router';

const apiRouter = Router();

apiRouter.use('/routes', routesRouter);
apiRouter.use('/compliance', complianceRouter);
apiRouter.use('/banking', bankingRouter);
apiRouter.use('/pools', poolsRouter);

export { apiRouter };
