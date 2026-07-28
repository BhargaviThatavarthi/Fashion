import pg from 'pg';
import fs from 'fs';

const connectionString = 'postgresql://postgres:Bhargavi%40123@[2406:da1a:314:7102:28a9:fc9f:5d8e:b446]:5432/postgres';

const { Client } = pg;
const schemaSql = fs.readFileSync('supabase_schema.sql', 'utf-8');

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function run() {
  console.log('Connecting directly to Supabase via IPv6 address...');
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('Executing SQL schema...');
    await client.query(schemaSql);
    console.log('🎉 SQL schema executed successfully! All tables created.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

run();
