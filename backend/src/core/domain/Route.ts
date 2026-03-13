export class Route {
  constructor(
    public readonly routeId: string,
    public readonly vesselType: string,
    public readonly fuelType: string,
    public readonly year: number,
    public readonly ghgIntensity: number,
    public readonly fuelConsumption: number,
    public readonly distance: number,
    public readonly totalEmissions: number,
    public readonly isBaseline: boolean
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.routeId || this.routeId.trim() === '') {
      throw new Error('routeId must not be empty');
    }
    if (this.year < 2000) {
      throw new Error('year must be >= 2000');
    }
    if (this.ghgIntensity <= 0) {
      throw new Error('ghgIntensity must be positive');
    }
    if (this.fuelConsumption <= 0) {
      throw new Error('fuelConsumption must be positive');
    }
    if (this.distance <= 0) {
      throw new Error('distance must be positive');
    }
  }
}
