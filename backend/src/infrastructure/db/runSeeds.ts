import * as fs from 'fs';
import * as path from 'path';
import { pool } from './postgres';

async function runSeeds() {
  const seedsDir = path.join(__dirname, 'seeds');
  
  if (!fs.existsSync(seedsDir)) {
    console.error(`Seeds directory not found: ${seedsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(seedsDir).sort();
  const sqlFiles = files.filter(f => f.endsWith('.sql'));

  const client = await pool.connect();
  let hasError = false;

  try {
    for (const file of sqlFiles) {
      console.log(`Running seed: ${file}`);
      const filePath = path.join(seedsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await client.query('BEGIN');
      await client.query(sql);
      await client.query('COMMIT');
      
      console.log(`Successfully seeded: ${file}`);
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seeding failed:', error);
    hasError = true;
  } finally {
    client.release();
    if (hasError) {
      process.exit(1);
    } else {
      console.log('All seeds executed successfully.');
      process.exit(0);
    }
  }
}

runSeeds();
