import { Request, Response } from 'express';
import { z } from 'zod';
import { computeComplianceBalance } from '../../../core/application/ComputeCB';

// Mock DB data lookup
const MOCK_ROUTES = [
  { shipId: 'SHIP123', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000 },
];

const COMPLIANCE_QUERY_SCHEMA = z.object({
  shipId: z.string().min(1),
  year: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 2000, "Year must be >= 2000"),
});

export const getCb = (req: Request, res: Response): void => {
  const result = COMPLIANCE_QUERY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
      details: result.error.errors
    });
    return;
  }

  const { shipId, year } = result.data;

  // Mock lookup
  const route = MOCK_ROUTES.find(r => r.shipId === shipId && r.year === year);
  
  if (!route) {
    res.status(404).json({
      success: false,
      error: 'Ship route data not found',
    });
    return;
  }

  const complianceBalance = computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);

  res.status(200).json({
    success: true,
    data: {
      shipId,
      year,
      complianceBalance
    }
  });
};

export const getAdjustedCb = (req: Request, res: Response): void => {
  const result = COMPLIANCE_QUERY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
    });
    return;
  }

  // Purely a mocked response demonstrating the endpoint
  // A real implementation would involve db lookup of sum of banked + pools + current
  res.status(200).json({
    success: true,
    data: {
      shipId: result.data.shipId,
      year: result.data.year,
      adjustedCB: 2000 // Mock adjusted value
    }
  });
};
