import { Route } from '../domain/Route';

export interface RouteRepository {
  save(route: Route): Promise<Route>;
  findAll(): Promise<Route[]>;
  findByRouteId(routeId: string): Promise<Route | null>;
  setBaseline(routeId: string): Promise<void>;
  getBaseline(): Promise<Route | null>;
}
