import { computeComplianceBalance } from '../ComputeCB';
import { TARGET_INTENSITY, ENERGY_PER_TON_FUEL } from '../constants';

describe('ComputeCB', () => {
  it('should compute a positive surplus when ghgIntensity is less than target', () => {
    const ghgIntensity = TARGET_INTENSITY - 1.0;
    const fuelConsumption = 5000;
    
    const cb = computeComplianceBalance(ghgIntensity, fuelConsumption);
    
    // Energy = 5000 * 41000
    // Target - Actual = 1.0
    // Result = 5000 * 41000 * 1.0 = 205000000
    expect(cb).toBe(205000000);
    expect(cb).toBeGreaterThan(0);
  });

  it('should compute a negative deficit when ghgIntensity is greater than target', () => {
    const ghgIntensity = 91; // greater than 89.3368
    const fuelConsumption = 5000;
    
    const cb = computeComplianceBalance(ghgIntensity, fuelConsumption);
    
    const expectedEnergy = 5000 * ENERGY_PER_TON_FUEL;
    const expectedCB = (TARGET_INTENSITY - 91) * expectedEnergy;
    
    expect(cb).toBeCloseTo(expectedCB, 4);
    expect(cb).toBeLessThan(0);
  });

  it('should be zero when actual intensity perfectly matches the target', () => {
    const cb = computeComplianceBalance(TARGET_INTENSITY, 1000);
    expect(cb).toBe(0);
  });
});
