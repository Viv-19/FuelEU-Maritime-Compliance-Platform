CREATE TABLE IF NOT EXISTS pool_members (
  id SERIAL PRIMARY KEY,
  pool_id INTEGER REFERENCES pools(id),
  ship_id VARCHAR(50) NOT NULL,
  cb_before NUMERIC(20,4) NOT NULL,
  cb_after NUMERIC(20,4) NOT NULL
);

CREATE INDEX IF NOT EXISTS index_pool_members_pool ON pool_members(pool_id);
