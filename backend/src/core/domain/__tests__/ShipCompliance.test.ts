import { ShipCompliance } from '../ShipCompliance';

describe('ShipCompliance', () => {
  it('should instantiate and correctly identify surplus', () => {
    const compliance = new ShipCompliance('SHIP_123', 2024, 500);
    
    expect(compliance.shipId).toBe('SHIP_123');
    expect(compliance.year).toBe(2024);
    expect(compliance.complianceBalance).toBe(500);
    
    expect(compliance.isSurplus()).toBe(true);
    expect(compliance.isDeficit()).toBe(false);
  });

  it('should correctly identify deficit', () => {
    const compliance = new ShipCompliance('SHIP_124', 2024, -200);
    
    expect(compliance.isSurplus()).toBe(false);
    expect(compliance.isDeficit()).toBe(true);
  });

  it('should correctly identify zero balance as neither surplus nor deficit', () => {
    const compliance = new ShipCompliance('SHIP_125', 2024, 0);
    
    expect(compliance.isSurplus()).toBe(false);
    expect(compliance.isDeficit()).toBe(false);
  });
});
