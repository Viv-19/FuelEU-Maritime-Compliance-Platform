import { Request, Response } from 'express';
import { z } from 'zod';
import { bankSurplus } from '../../../core/application/BankSurplus';
import { applyBanked } from '../../../core/application/ApplyBanked';

const BANKING_SCHEMA = z.object({
  shipId: z.string().min(1),
  year: z.number().int().min(2000),
  amount: z.number()
});

export const bank = (req: Request, res: Response): void => {
  const result = BANKING_SCHEMA.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: result.error.errors
    });
    return;
  }

  const { shipId, amount } = result.data;
  const currentBankedAmount = 0; // Mock current bank in DB

  try {
    const newBankedAmount = bankSurplus(amount, currentBankedAmount);
    res.status(200).json({
      success: true,
      data: {
        shipId,
        bankedAmount: newBankedAmount
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const apply = (req: Request, res: Response): void => {
  const result = BANKING_SCHEMA.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: result.error.errors
    });
    return;
  }

  const { amount } = result.data;
  const currentBankedAmount = 5000; // Mock available banked amount

  try {
    // applyBanked expects a negative deficitCB, frontend sends positive amount
    const applyResult = applyBanked(-Math.abs(amount), currentBankedAmount);
    res.status(200).json({
      success: true,
      data: {
        applied: applyResult.applied,
        newCB: applyResult.newCB,
        remainingBank: applyResult.remainingBank
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
