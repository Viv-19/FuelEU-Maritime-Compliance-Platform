import { Request, Response } from 'express';
import { z } from 'zod';
import { createPool } from '../../../core/application/CreatePool';

const POOL_SCHEMA = z.object({
  year: z.number().int().min(2000),
  members: z.array(
    z.object({
      shipId: z.string().min(1),
      cb_before: z.number().optional(),
      cb: z.number().optional(),
    }).refine(data => data.cb_before !== undefined || data.cb !== undefined, {
      message: 'Either cb_before or cb must be provided'
    })
  ).min(1, 'Pool must contain at least one member')
});

export const pool = (req: Request, res: Response): void => {
  const result = POOL_SCHEMA.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      error: 'Invalid request body',
      details: result.error.errors
    });
    return;
  }

  const { members } = result.data;

  // Map into the format expected by CreatePool application logic
  const formattedMembers = members.map((m) => ({
    shipId: m.shipId,
    complianceBalance: m.cb_before ?? m.cb ?? 0
  }));

  try {
    const pooledMembers = createPool(formattedMembers);
    
    // Convert output back to the REST response contract expected
    const responseData = pooledMembers.map(m => ({
      shipId: m.shipId,
      cb_before: m.cbBefore,
      cb_after: m.cbAfter
    }));

    res.status(200).json({
      success: true,
      data: responseData
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
