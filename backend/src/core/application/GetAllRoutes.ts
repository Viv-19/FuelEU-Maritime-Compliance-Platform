import { RouteRepository } from '../ports/RouteRepository';
import { Route } from '../domain/Route';

export class GetAllRoutes {
  constructor(private readonly routeRepository: RouteRepository) {}

  async execute(): Promise<Route[]> {
    return this.routeRepository.findAll();
  }
}
