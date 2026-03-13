import * as fs from 'fs';
import * as path from 'path';
import { pool } from './postgres';

async function runMigrations() {
  const migrationsDir = path.join(__dirname, 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`Migrations directory not found: ${migrationsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(migrationsDir).sort();
  const sqlFiles = files.filter(f => f.endsWith('.sql'));

  const client = await pool.connect();
  let hasError = false;

  try {
    for (const file of sqlFiles) {
      console.log(`Running migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      
      console.log(`Successfully applied: ${file}`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    hasError = true;
  } finally {
    client.release();
    if (hasError) {
      process.exit(1);
    } else {
      console.log('All migrations executed successfully.');
      process.exit(0);
    }
  }
}

runMigrations();
