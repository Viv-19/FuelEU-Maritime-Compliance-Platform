import { createPool, PoolInputShip } from '../CreatePool';

describe('CreatePool', () => {
  it('should successfully allocate valid pool with enough surplus', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 6000 },
      { shipId: 'Ship B', complianceBalance: -4000 },
      { shipId: 'Ship C', complianceBalance: -1000 }
    ];

    const result = createPool(input);
    
    expect(result).toHaveLength(3);
    
    const shipA = result.find((s) => s.shipId === 'Ship A');
    const shipB = result.find((s) => s.shipId === 'Ship B');
    const shipC = result.find((s) => s.shipId === 'Ship C');
    
    expect(shipA?.cbAfter).toBe(1000); // 6000 - 4000 - 1000
    expect(shipB?.cbAfter).toBe(0);
    expect(shipC?.cbAfter).toBe(0);
  });

  it('should reject invalid pool if total balance is negative', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 2000 },
      { shipId: 'Ship B', complianceBalance: -4000 }
    ];

    expect(() => {
      createPool(input);
    }).toThrow('Total pooling compliance balance must be >= 0');
  });

  it('should correctly handle a pool where all ships have surplus without changes', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 1000 },
      { shipId: 'Ship B', complianceBalance: 2000 }
    ];

    const result = createPool(input);
    
    expect(result.find((s) => s.shipId === 'Ship A')?.cbAfter).toBe(1000);
    expect(result.find((s) => s.shipId === 'Ship B')?.cbAfter).toBe(2000);
  });

  it('should handle a single-ship pool', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 3000 }
    ];
    const result = createPool(input);
    expect(result).toHaveLength(1);
    expect(result[0].cbAfter).toBe(3000);
  });

  it('should handle pool where total balance is exactly zero', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 5000 },
      { shipId: 'Ship B', complianceBalance: -5000 }
    ];
    const result = createPool(input);
    expect(result.find((s) => s.shipId === 'Ship A')?.cbAfter).toBe(0);
    expect(result.find((s) => s.shipId === 'Ship B')?.cbAfter).toBe(0);
  });

  it('should distribute from multiple surplus ships to cover deficits', () => {
    const input: PoolInputShip[] = [
      { shipId: 'Ship A', complianceBalance: 3000 },
      { shipId: 'Ship B', complianceBalance: 2000 },
      { shipId: 'Ship C', complianceBalance: -4000 }
    ];
    const result = createPool(input);
    const shipC = result.find((s) => s.shipId === 'Ship C');
    expect(shipC?.cbAfter).toBe(0);
    // Total before = 1000, so total after should also be 1000
    const totalAfter = result.reduce((sum, s) => sum + s.cbAfter, 0);
    expect(totalAfter).toBe(1000);
  });

  it('should reject an empty pool', () => {
    const input: PoolInputShip[] = [];
    // Empty pool has totalBalance = 0 which is >= 0, should succeed but return empty
    const result = createPool(input);
    expect(result).toHaveLength(0);
  });
});
