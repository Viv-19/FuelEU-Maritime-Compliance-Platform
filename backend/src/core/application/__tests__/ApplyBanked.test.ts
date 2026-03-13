import { applyBanked } from '../ApplyBanked';

describe('ApplyBanked', () => {
  it('should apply full banked amount when deficit is strictly greater than banked', () => {
    const deficitCB = -5000;
    const bankedAmount = 2000;
    
    const result = applyBanked(deficitCB, bankedAmount);
    
    expect(result.applied).toBe(2000);
    expect(result.newCB).toBe(-3000);
    expect(result.remainingBank).toBe(0);
  });

  it('should apply partial banked amount when banked is greater than deficit', () => {
    const deficitCB = -1000;
    const bankedAmount = 5000;
    
    const result = applyBanked(deficitCB, bankedAmount);
    
    expect(result.applied).toBe(1000);
    expect(result.newCB).toBe(0);
    expect(result.remainingBank).toBe(4000);
  });

  it('should throw an error if deficitCB is positive', () => {
    const deficitCB = 1000;
    const bankedAmount = 5000;
    
    expect(() => {
      applyBanked(deficitCB, bankedAmount);
    }).toThrow('Deficit CB must be negative to apply banked compliance');
  });

  it('should throw an error if deficitCB is equal to zero', () => {
    const deficitCB = 0;
    const bankedAmount = 5000;
    
    expect(() => {
      applyBanked(deficitCB, bankedAmount);
    }).toThrow('Deficit CB must be negative to apply banked compliance');
  });
});
