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

  it('should return zero when fuel consumption is zero regardless of intensity', () => {
    const cb = computeComplianceBalance(120, 0);
    expect(cb).toBeCloseTo(0, 10);
  });

  it('should produce a large deficit for very high ghg intensity', () => {
    const cb = computeComplianceBalance(200, 10000);
    const expected = (TARGET_INTENSITY - 200) * 10000 * ENERGY_PER_TON_FUEL;
    expect(cb).toBeCloseTo(expected, 4);
    expect(cb).toBeLessThan(0);
  });

  it('should produce a large surplus for very low ghg intensity', () => {
    const cb = computeComplianceBalance(10, 10000);
    const expected = (TARGET_INTENSITY - 10) * 10000 * ENERGY_PER_TON_FUEL;
    expect(cb).toBeCloseTo(expected, 4);
    expect(cb).toBeGreaterThan(0);
  });
});
