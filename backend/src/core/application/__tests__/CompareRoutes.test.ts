import { compareRoutes } from '../CompareRoutes';

describe('CompareRoutes', () => {
  it('should calculate correct percentage difference and return compliant=true if under target', () => {
    const baseline = 95.0;
    const comparison = 85.0; // Under TARGET_INTENSITY (89.3368)

    const result = compareRoutes(baseline, comparison);

    expect(result.comparisonIntensity).toBe(85.0);
    expect(result.compliant).toBe(true);
    
    // expected % diff = (85 / 95 - 1) * 100 = -10.526...
    const expectedDiff = ((85.0 / 95.0) - 1) * 100;
    expect(result.percentDiff).toBeCloseTo(expectedDiff, 5);
  });

  it('should calculate correct percentage difference and return compliant=false if over target', () => {
    const baseline = 91.0;
    const comparison = 95.0; // Over TARGET_INTENSITY (89.3368)

    const result = compareRoutes(baseline, comparison);

    expect(result.comparisonIntensity).toBe(95.0);
    expect(result.compliant).toBe(false);
    
    // expected % diff = (95 / 91 - 1) * 100
    const expectedDiff = ((95.0 / 91.0) - 1) * 100;
    expect(result.percentDiff).toBeCloseTo(expectedDiff, 5);
  });

  it('should return compliant=true when comparison equals exactly the target intensity', () => {
    const result = compareRoutes(91.0, 89.3368);
    expect(result.compliant).toBe(true);
  });

  it('should return compliant=false when comparison is just above the target', () => {
    const result = compareRoutes(91.0, 89.34);
    expect(result.compliant).toBe(false);
  });

  it('should return zero percentDiff when baseline and comparison are equal', () => {
    const result = compareRoutes(88.0, 88.0);
    expect(result.percentDiff).toBeCloseTo(0, 5);
    expect(result.compliant).toBe(true);
  });
});
