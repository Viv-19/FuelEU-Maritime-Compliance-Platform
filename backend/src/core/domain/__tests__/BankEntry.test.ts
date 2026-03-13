import { BankEntry } from '../BankEntry';

describe('BankEntry', () => {
  it('should instantiate with positive amount', () => {
    const entry = new BankEntry('SHIP_001', 2024, 100);
    
    expect(entry.shipId).toBe('SHIP_001');
    expect(entry.year).toBe(2024);
    expect(entry.amount).toBe(100);
  });

  it('should throw error if amount is <= 0', () => {
    expect(() => {
      new BankEntry('SHIP_002', 2024, 0);
    }).toThrow('amount must be positive');

    expect(() => {
      new BankEntry('SHIP_003', 2024, -50);
    }).toThrow('amount must be positive');
  });
});
