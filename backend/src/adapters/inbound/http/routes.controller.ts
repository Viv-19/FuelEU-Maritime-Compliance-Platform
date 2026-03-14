import { Request, Response } from 'express';
import { z } from 'zod';
import { SqlRouteRepository } from '../../outbound/db/SqlRouteRepository';
import { CreateRoute } from '../../../core/application/CreateRoute';
import { GetAllRoutes } from '../../../core/application/GetAllRoutes';
import { Route } from '../../../core/domain/Route';

const routeRepo = new SqlRouteRepository();
const createRouteUseCase = new CreateRoute(routeRepo);
const getAllRoutesUseCase = new GetAllRoutes(routeRepo);

export const getRoutes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const routes = await getAllRoutesUseCase.execute();
    res.status(200).json({
      success: true,
      data: routes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const setBaseline = async (req: Request, res: Response): Promise<void> => {
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

  const routeId = parsedParams.data.id;

  try {
    await routeRepo.setBaseline(routeId);
    const routes = await getAllRoutesUseCase.execute();
    res.status(200).json({
      success: true,
      data: routes,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getComparison = async (_req: Request, res: Response): Promise<void> => {
  try {
    const routes = await getAllRoutesUseCase.execute();
    const data = routes.map((route: Route) => ({
      routeId: route.routeId,
      ghgIntensity: route.ghgIntensity,
      isBaseline: route.isBaseline,
    }));

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addRoute = async (req: Request, res: Response): Promise<void> => {
  const routeSchema = z.object({
    routeId: z.string().min(1),
    vesselType: z.enum(['Container', 'BulkCarrier', 'Tanker', 'RoRo']),
    fuelType: z.enum(['HFO', 'LNG', 'MGO', 'VLSFO']),
    year: z.number().int().min(2000),
    ghgIntensity: z.number().positive(),
    fuelConsumption: z.number().positive(),
    distance: z.number().positive(),
  });

  const parsed = routeSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request data',
      details: parsed.error.errors,
    });
    return;
  }

  try {
    const newRoute = await createRouteUseCase.execute({
      routeId: parsed.data.routeId,
      vesselType: parsed.data.vesselType,
      fuelType: parsed.data.fuelType,
      year: parsed.data.year,
      ghgIntensity: parsed.data.ghgIntensity,
      fuelConsumption: parsed.data.fuelConsumption,
      distance: parsed.data.distance,
    });

    res.status(201).json({
      success: true,
      data: newRoute,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message || 'Failed to add route',
    });
  }
};
