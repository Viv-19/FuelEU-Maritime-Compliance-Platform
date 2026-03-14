import { Route } from '../Route';

describe('Route', () => {
  it('should instantiate with valid data', () => {
    const route = new Route('R001', 'Container', 'LNG', 2024, 78.5, 1000, 5000, 3000, false);
    
    expect(route.routeId).toBe('R001');
    expect(route.vesselType).toBe('Container');
    expect(route.fuelType).toBe('LNG');
    expect(route.year).toBe(2024);
    expect(route.ghgIntensity).toBe(78.5);
    expect(route.fuelConsumption).toBe(1000);
    expect(route.distance).toBe(5000);
    expect(route.totalEmissions).toBe(3000);
    expect(route.isBaseline).toBe(false);
  });

  it('should throw error if routeId is empty or wrong format', () => {
    expect(() => {
      new Route('', 'Container', 'LNG', 2024, 78.5, 1000, 5000, 3000, false);
    }).toThrow('routeId must not be empty');

    expect(() => {
      new Route('ABC', 'Container', 'LNG', 2024, 78.5, 1000, 5000, 3000, false);
    }).toThrow('Route ID must follow format R001');

    expect(() => {
      new Route('R12', 'Container', 'LNG', 2024, 78.5, 1000, 5000, 3000, false);
    }).toThrow('Route ID must follow format R001');
  });

  it('should auto-uppercase routeId', () => {
    const route = new Route('r002', 'Container', 'LNG', 2024, 78.5, 1000, 5000, 3000, false);
    expect(route.routeId).toBe('R002');
  });

  it('should throw error if year is < 2000', () => {
    expect(() => {
      new Route('R001', 'Container', 'LNG', 1999, 78.5, 1000, 5000, 3000, false);
    }).toThrow('year must be >= 2000');
  });

  it('should throw error if ghgIntensity is not positive', () => {
    expect(() => {
      new Route('R001', 'Container', 'LNG', 2024, 0, 1000, 5000, 3000, false);
    }).toThrow('ghgIntensity must be positive');
    
    expect(() => {
      new Route('R001', 'Container', 'LNG', 2024, -10, 1000, 5000, 3000, false);
    }).toThrow('ghgIntensity must be positive');
  });

  it('should throw error if fuelConsumption is not positive', () => {
    expect(() => {
      new Route('R001', 'Container', 'LNG', 2024, 78.5, 0, 5000, 3000, false);
    }).toThrow('fuelConsumption must be positive');
  });

  it('should throw error if distance is not positive', () => {
    expect(() => {
      new Route('R001', 'Container', 'LNG', 2024, 78.5, 1000, 0, 3000, false);
    }).toThrow('distance must be positive');
  });
});
