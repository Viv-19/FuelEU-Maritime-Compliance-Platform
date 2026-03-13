CREATE TABLE IF NOT EXISTS routes (
  id SERIAL PRIMARY KEY,
  route_id VARCHAR(20) UNIQUE NOT NULL,
  vessel_type VARCHAR(100) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  ghg_intensity NUMERIC(10,4) NOT NULL,
  fuel_consumption NUMERIC(12,2) NOT NULL,
  distance NUMERIC(12,2) NOT NULL,
  total_emissions NUMERIC(12,2) NOT NULL,
  is_baseline BOOLEAN DEFAULT FALSE,
  CONSTRAINT routes_ghg_intensity_check CHECK (ghg_intensity > 0),
  CONSTRAINT routes_fuel_consumption_check CHECK (fuel_consumption > 0),
  CONSTRAINT routes_distance_check CHECK (distance > 0),
  CONSTRAINT routes_year_check CHECK (year >= 2000)
);

CREATE INDEX IF NOT EXISTS index_routes_year ON routes(year);
CREATE INDEX IF NOT EXISTS index_routes_vessel ON routes(vessel_type);
