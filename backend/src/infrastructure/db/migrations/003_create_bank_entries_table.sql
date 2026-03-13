CREATE TABLE IF NOT EXISTS bank_entries (
  id SERIAL PRIMARY KEY,
  ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount_gco2eq NUMERIC(20,4) NOT NULL,
  CONSTRAINT bank_entries_amount_check CHECK (amount_gco2eq > 0)
);
