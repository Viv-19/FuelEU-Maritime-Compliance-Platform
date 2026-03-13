CREATE TABLE IF NOT EXISTS ship_compliance (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  cb_gco2eq NUMERIC(20,4) NOT NULL,
  CONSTRAINT ship_compliance_unique_ship_year UNIQUE(ship_id, year)
);
