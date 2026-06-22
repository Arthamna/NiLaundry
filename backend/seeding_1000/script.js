import fs from 'fs';
import { Client } from 'pg';
import 'dotenv/config';
const sql = fs.readFileSync('./seed_2.sql', 'utf8');

// console.log('DATABASE_URL =', process.env.DATABASE_URL);

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(Boolean);

await client.query('BEGIN');
try {
  for (const stmt of statements) {
    await client.query(stmt);
  }
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
}