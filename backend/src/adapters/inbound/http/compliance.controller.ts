import { Request, Response } from 'express';
import { z } from 'zod';
import { computeComplianceBalance } from '../../../core/application/ComputeCB';
import { SqlRouteRepository } from '../../outbound/db/SqlRouteRepository';
import { pool } from '../../../infrastructure/db/postgres';

const routeRepo = new SqlRouteRepository();

const YEAR_ONLY_SCHEMA = z.object({
  year: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 2000, "Year must be >= 2000"),
});

const COMPLIANCE_QUERY_SCHEMA = z.object({
  shipId: z.string().min(1),
  year: z.string().transform(val => parseInt(val, 10)).refine(val => val >= 2000, "Year must be >= 2000"),
});

export const getCb = async (req: Request, res: Response): Promise<void> => {
  const result = COMPLIANCE_QUERY_SCHEMA.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ success: false, error: 'Invalid config', details: result.error.errors });
    return;
  }
  
  try {
    const { shipId, year } = result.data;
    const allRoutes = await routeRepo.findAll();
    const shipRoutes = allRoutes.filter(r => r.shipId === shipId && r.year === year);
    
    let baseCb = 0;
    for (const route of shipRoutes) {
      baseCb += computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);
    }
    
    // We can just return the raw baseCb here or also do the DB queries for transfers/bank.
    // The previous implementation always returned a dummy or just the baseCb.
    res.status(200).json({
      success: true,
      data: { shipId, year, complianceBalance: baseCb }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAllCb = async (req: Request, res: Response): Promise<void> => {
  const result = YEAR_ONLY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
    });
    return;
  }

  try {
    const year = result.data.year;
    
    // 1. Get Base CBs from Routes
    const allRoutes = await routeRepo.findAll();
    const yearRoutes = allRoutes.filter(r => r.year === year);
    
    const shipMap = new Map<string, { baseCb: number, bankedAmount: number, transferredIn: number, transferredOut: number }>();
    
    const initializeShipIfMissing = (shipId: string) => {
      if (!shipMap.has(shipId)) {
        shipMap.set(shipId, { baseCb: 0, bankedAmount: 0, transferredIn: 0, transferredOut: 0 });
      }
    };

    for (const route of yearRoutes) {
      const cb = computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);
      initializeShipIfMissing(route.shipId);
      shipMap.get(route.shipId)!.baseCb += cb;
    }

    // 2. Get Bank Entries
    const bankEntriesRes = await pool.query(`SELECT ship_id, amount_gco2eq FROM bank_entries WHERE year = $1`, [year]);
    for (const row of bankEntriesRes.rows) {
      const sId = row.ship_id;
      initializeShipIfMissing(sId);
      shipMap.get(sId)!.bankedAmount += parseFloat(row.amount_gco2eq);
    }

    // 3. Get Transfers
    const transfersRes = await pool.query(`SELECT from_ship_id, to_ship_id, amount FROM transfers WHERE year = $1`, [year]);
    for (const row of transfersRes.rows) {
      const fromShip = row.from_ship_id;
      const toShip = row.to_ship_id;
      const amount = parseFloat(row.amount);
      
      initializeShipIfMissing(fromShip);
      shipMap.get(fromShip)!.transferredOut += amount;
      
      initializeShipIfMissing(toShip);
      shipMap.get(toShip)!.transferredIn += amount;
    }

    const data = Array.from(shipMap.entries()).map(([shipId, stats]) => {
      const totalCb = stats.baseCb - stats.bankedAmount - stats.transferredOut + stats.transferredIn;
      return {
        shipId,
        year,
        complianceBalance: totalCb,
        bankedAmount: stats.bankedAmount,
        baseCb: stats.baseCb
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAdjustedCb = async (req: Request, res: Response): Promise<void> => {
  const result = YEAR_ONLY_SCHEMA.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request parameters',
    });
    return;
  }

  try {
    const year = result.data.year;
    
    // 1. Get Base CBs from Routes
    const allRoutes = await routeRepo.findAll();
    const yearRoutes = allRoutes.filter(r => r.year === year);
    
    const shipMap = new Map<string, { baseCb: number, bankedAmount: number, transferredIn: number, transferredOut: number }>();
    
    const initializeShipIfMissing = (shipId: string) => {
      if (!shipMap.has(shipId)) {
        shipMap.set(shipId, { baseCb: 0, bankedAmount: 0, transferredIn: 0, transferredOut: 0 });
      }
    };

    for (const route of yearRoutes) {
      const cb = computeComplianceBalance(route.ghgIntensity, route.fuelConsumption);
      initializeShipIfMissing(route.shipId);
      shipMap.get(route.shipId)!.baseCb += cb;
    }

    // 2. Get Bank Entries
    const bankEntriesRes = await pool.query(`SELECT ship_id, amount_gco2eq FROM bank_entries WHERE year = $1`, [year]);
    for (const row of bankEntriesRes.rows) {
      const sId = row.ship_id;
      initializeShipIfMissing(sId);
      shipMap.get(sId)!.bankedAmount += parseFloat(row.amount_gco2eq);
    }

    // 3. Get Transfers
    const transfersRes = await pool.query(`SELECT from_ship_id, to_ship_id, amount FROM transfers WHERE year = $1`, [year]);
    for (const row of transfersRes.rows) {
      const fromShip = row.from_ship_id;
      const toShip = row.to_ship_id;
      const amount = parseFloat(row.amount);
      
      initializeShipIfMissing(fromShip);
      shipMap.get(fromShip)!.transferredOut += amount;
      
      initializeShipIfMissing(toShip);
      shipMap.get(toShip)!.transferredIn += amount;
    }

    const data = Array.from(shipMap.entries()).map(([shipId, stats]) => {
      const totalCb = stats.baseCb - stats.bankedAmount - stats.transferredOut + stats.transferredIn;
      return {
        shipId,
        cbBefore: totalCb
      };
    });

    // The assignment requires the direct array, not wrapped in data? 
    // Wait, typically express returns the array or object. The user said:
    // Example response: [ { shipId: "SHIP001", cbBefore: 7458963343 } ]
    res.status(200).json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
