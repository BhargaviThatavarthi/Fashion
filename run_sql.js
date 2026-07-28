import pg from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = 'postgresql://postgres:Bhargavi%40123@db.kmxsgomxxhwpmoayeqmj.supabase.co:5432/postgres';

const { Client } = pg;
const client = new Client({
  connectionString,
});

async function run() {
  console.log('Connecting to Supabase PostgreSQL database...');
  try {
    await client.connect();
    console.log('Connected successfully!');
    
    console.log('Reading supabase_schema.sql...');
    const schemaSql = fs.readFileSync('supabase_schema.sql', 'utf-8');
    
    console.log('Executing SQL schema... This may take a few seconds.');
    await client.query(schemaSql);
    console.log('SQL schema executed successfully! All tables and security policies created.');
  } catch (err) {
    console.error('Error executing SQL schema:', err.message);
  } finally {
    await client.end();
  }
}

run();
