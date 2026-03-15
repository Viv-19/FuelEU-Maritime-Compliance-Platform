CREATE TABLE IF NOT EXISTS transfers (
  id SERIAL PRIMARY KEY,
  from_ship_id VARCHAR(50) NOT NULL,
  to_ship_id VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  amount NUMERIC(20,4) NOT NULL,
  CONSTRAINT transfers_amount_check CHECK (amount > 0)
);
