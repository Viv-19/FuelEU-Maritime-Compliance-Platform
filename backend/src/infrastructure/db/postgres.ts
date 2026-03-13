import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env if present
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
