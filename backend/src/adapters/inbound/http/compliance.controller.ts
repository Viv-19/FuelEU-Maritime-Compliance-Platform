import { Request, Response } from 'express';
import { z } from 'zod';
import { computeComplianceBalance } from '../../../core/application/ComputeCB';

// Mock ship compliance data — aligned with frontend expectations
const MOCK_SHIPS = [
  { shipId: 'SHIP001', year: 2024, ghgIntensity: 88.0, fuelConsumption: 5000 },
  { shipId: 'SHIP002', year: 2024, ghgIntensity: 91.0, fuelConsumption: 4200 },
  { shipId: 'SHIP003', year: 2024, ghgIntensity: 95.5, fuelConsumption: 6100 },
];

const COMPLIANCE_QUERY_SCHEMA = z.object({
  shipId: z.string().min(1),
  year: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 2000, "Year must be >= 2000"),
});

const YEAR_ONLY_SCHEMA = z.object({
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

  const ship = MOCK_SHIPS.find(r => r.shipId === shipId && r.year === year);
  
  if (!ship) {
    // Return a default positive CB for demo purposes
    res.status(200).json({
      success: true,
      data: {
        shipId,
        year,
        complianceBalance: 4500
      }
    });
    return;
  }

  const complianceBalance = computeComplianceBalance(ship.ghgIntensity, ship.fuelConsumption);

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
  const result = YEAR_ONLY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
    });
    return;
  }

  // Return array of ships with cb_before for pooling module
  const data = MOCK_SHIPS.map(ship => {
    const cb = computeComplianceBalance(ship.ghgIntensity, ship.fuelConsumption);
    return {
      shipId: ship.shipId,
      cb_before: cb
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
};
