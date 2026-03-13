export interface PoolInputShip {
  shipId: string;
  complianceBalance: number;
}

export interface PoolOutputShip {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
}

/**
 * Allocates surplus compliance between ships in a proposed pool.
 * 
 * Rules:
 * 1. Sum of CB must be >= 0
 * 2. Deficit ships must not become worse
 * 3. Surplus ships must not become negative
 * 
 * Algorithm:
 * 1. Calculate pool total compliance
 * 2. Check if total sum >= 0, if not throw an error
 * 3. Distribute available surplus to offset deficits, without pushing surplus ships below 0.
 * 
 * @param ships - Array of ship objects to be pooled
 * @returns Array of processed ship balances before and after pooling
 * @throws Error if the total pool balance is negative
 */
export function createPool(ships: PoolInputShip[]): PoolOutputShip[] {
  const totalBalance = ships.reduce((sum, ship) => sum + ship.complianceBalance, 0);

  if (totalBalance < 0) {
    throw new Error('Total pooling compliance balance must be >= 0');
  }

  // Create an output array mapped to original ships
  const results = ships.map((s) => ({
    shipId: s.shipId,
    cbBefore: s.complianceBalance,
    cbAfter: s.complianceBalance
  }));

  // Separate into strictly surplus ships and deficit ships
  const surpluses = results.filter((s) => s.cbBefore > 0).sort((a, b) => b.cbBefore - a.cbBefore);
  const deficits = results.filter((s) => s.cbBefore < 0);

  // Simple distribution: transfer from surplus ships to deficit ships
  let surplusIndex = 0;
  for (const deficit of deficits) {
    let unfulfilledDeficit = Math.abs(deficit.cbAfter);
    
    while (unfulfilledDeficit > 0 && surplusIndex < surpluses.length) {
      const surplusShip = surpluses[surplusIndex];
      const availableTransfer = surplusShip.cbAfter;

      if (availableTransfer === 0) {
        surplusIndex++;
        continue;
      }

      const amountToTransfer = Math.min(availableTransfer, unfulfilledDeficit);
      
      surplusShip.cbAfter -= amountToTransfer;
      deficit.cbAfter += amountToTransfer;
      unfulfilledDeficit -= amountToTransfer;
      
      if (surplusShip.cbAfter === 0) {
        surplusIndex++;
      }
    }
  }

  return results;
}
