import { RouteRepository } from '../ports/RouteRepository';
import { Route } from '../domain/Route';

export class CreateRoute {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(dto: {
    routeId: string;
    shipId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
  }): Promise<Route> {
    const existingRoute = await this.routeRepository.findByRouteId(dto.routeId.toUpperCase());
    if (existingRoute) {
      throw new Error('Route ID already exists');
    }

    const totalEmissions = dto.ghgIntensity * dto.fuelConsumption;
    
    const route = new Route(
      dto.routeId,
      dto.shipId,
      dto.vesselType,
      dto.fuelType,
      dto.year,
      dto.ghgIntensity,
      dto.fuelConsumption,
      dto.distance,
      totalEmissions,
      false
    );

    return this.routeRepository.save(route);
  }
}
