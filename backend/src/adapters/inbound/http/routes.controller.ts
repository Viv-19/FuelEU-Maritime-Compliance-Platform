import { Request, Response } from 'express';
import { z } from 'zod';
import { compareRoutes } from '../../../core/application/CompareRoutes';

// Hardcoded initial data store mock for demonstration purposes 
// (until repository layer is implemented in next phase)
const MOCK_ROUTES = [
  { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, isBaseline: true },
  { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, isBaseline: false },
];

export const getRoutes = (_req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: MOCK_ROUTES,
  });
};

export const setBaseline = (req: Request, res: Response): void => {
  const paramsSchema = z.object({
    id: z.string().min(1),
  });

  const parsedParams = paramsSchema.safeParse(req.params);

  if (!parsedParams.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request: route ID is required',
    });
    return;
  }

  // Purely mock response for setting baseline
  res.status(200).json({
    success: true,
    data: {
      message: 'Baseline route updated',
      routeId: parsedParams.data.id,
    },
  });
};

export const getComparison = (_req: Request, res: Response): void => {
  // We assume R001 is the baseline with 91.0
  const baselineIntensity = 91.0; 

  // Compute comparisons
  const comparisons = MOCK_ROUTES.filter(r => !r.isBaseline).map(route => {
    const result = compareRoutes(baselineIntensity, route.ghgIntensity);
    return {
      routeId: route.routeId,
      ...result,
    };
  });

  res.status(200).json({
    success: true,
    data: comparisons,
  });
};
