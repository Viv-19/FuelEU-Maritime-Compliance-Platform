import { Request, Response } from 'express';
import { z } from 'zod';

// Demo data store — 5 routes matching seed data
const MOCK_ROUTES = [
  { routeId: 'R001', vesselType: 'Container',   fuelType: 'HFO',   year: 2024, ghgIntensity: 91.2,  fuelConsumption: 5000, distance: 12000, totalEmissions: 45600, isBaseline: true },
  { routeId: 'R002', vesselType: 'BulkCarrier',  fuelType: 'LNG',   year: 2024, ghgIntensity: 88.0,  fuelConsumption: 4200, distance: 9500,  totalEmissions: 36960, isBaseline: false },
  { routeId: 'R003', vesselType: 'Tanker',       fuelType: 'VLSFO', year: 2024, ghgIntensity: 95.5,  fuelConsumption: 6100, distance: 15000, totalEmissions: 58255, isBaseline: false },
  { routeId: 'R004', vesselType: 'Container',    fuelType: 'LNG',   year: 2024, ghgIntensity: 85.0,  fuelConsumption: 3800, distance: 8000,  totalEmissions: 32300, isBaseline: false },
  { routeId: 'R005', vesselType: 'BulkCarrier',  fuelType: 'HFO',   year: 2023, ghgIntensity: 92.0,  fuelConsumption: 5500, distance: 14000, totalEmissions: 50600, isBaseline: false },
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

  const routeId = parsedParams.data.id;

  // Toggle baseline: clear all, then set target
  MOCK_ROUTES.forEach(r => r.isBaseline = false);
  const route = MOCK_ROUTES.find(r => r.routeId === routeId);
  if (route) {
    route.isBaseline = true;
  }

  res.status(200).json({
    success: true,
    data: MOCK_ROUTES,
  });
};

export const getComparison = (_req: Request, res: Response): void => {
  const baseline = MOCK_ROUTES.find(r => r.isBaseline);

  if (!baseline) {
    res.status(200).json({
      success: true,
      data: MOCK_ROUTES.map(r => ({
        routeId: r.routeId,
        ghgIntensity: r.ghgIntensity,
        isBaseline: r.isBaseline,
      })),
    });
    return;
  }

  const data = MOCK_ROUTES.map(route => ({
    routeId: route.routeId,
    ghgIntensity: route.ghgIntensity,
    isBaseline: route.isBaseline,
  }));

  res.status(200).json({
    success: true,
    data,
  });
};

export const addRoute = (req: Request, res: Response): void => {
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

  // Check for duplicate routeId
  if (MOCK_ROUTES.some(r => r.routeId === parsed.data.routeId)) {
    res.status(400).json({
      success: false,
      error: 'Route ID already exists',
    });
    return;
  }

  const newRoute = {
    ...parsed.data,
    totalEmissions: parsed.data.ghgIntensity * parsed.data.fuelConsumption, // Mock calculation
    isBaseline: false,
  };

  MOCK_ROUTES.push(newRoute);

  res.status(201).json({
    success: true,
    data: newRoute,
  });
};
