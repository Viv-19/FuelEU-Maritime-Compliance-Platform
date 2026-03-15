import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../../../infrastructure/db/postgres';

const BANK_SCHEMA = z.object({
  shipId: z.string().min(1),
  year: z.number().int().min(2000),
  amount: z.number().positive()
});

const APPLY_SCHEMA = z.object({
  fromShipId: z.string().min(1),
  toShipId: z.string().min(1),
  amount: z.number().positive()
});

export const bank = async (req: Request, res: Response): Promise<void> => {
  const result = BANK_SCHEMA.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: result.error.errors
    });
    return;
  }

  const { shipId, year, amount } = result.data;

  try {
    await pool.query(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq) VALUES ($1, $2, $3)`,
      [shipId, year, amount]
    );

    res.status(200).json({
      success: true,
      data: {
        shipId,
        bankedAmount: amount
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const apply = async (req: Request, res: Response): Promise<void> => {
  const result = APPLY_SCHEMA.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: result.error.errors
    });
    return;
  }

  const { fromShipId, toShipId, amount } = result.data;
  const year = 2024; // Defaulting to 2024 for this simple example application unless passed

  try {
    await pool.query(
      `INSERT INTO transfers (from_ship_id, to_ship_id, year, amount) VALUES ($1, $2, $3, $4)`,
      [fromShipId, toShipId, year, amount]
    );

    res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
