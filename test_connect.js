import pg from 'pg';
import fs from 'fs';

const regions = [
  'ap-south-1',
  'ap-southeast-1',
  'us-east-1',
  'us-west-1',
  'eu-central-1',
  'eu-west-1',
  'ap-northeast-1',
  'sa-east-1',
  'us-east-2',
  'us-west-2',
  'ap-east-1',
  'ap-northeast-3',
  'ap-northeast-2',
  'ap-southeast-2',
  'ca-central-1',
  'eu-west-2',
  'eu-south-1',
  'eu-west-3',
  'eu-north-1',
  'me-south-1'
];

const ports = [5432, 6543];

const { Client } = pg;
const schemaSql = fs.readFileSync('supabase_schema.sql', 'utf-8');

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    
    for (const port of ports) {
      const connectionString = `postgresql://postgres.kmxsgomxxhwpmoayeqmj:Bhargavi%40123@${host}:${port}/postgres`;
      
      console.log(`Trying region ${region} via pooler: ${host} on port ${port}...`);
      const client = new Client({
        connectionString,
        ssl: {
          rejectUnauthorized: false
        }
      });
      
      try {
        await client.connect();
        console.log(`✅ SUCCESS! Connected to ${region} on port ${port}`);
        
        console.log('Executing SQL schema from supabase_schema.sql...');
        await client.query(schemaSql);
        console.log('🎉 Database tables and RLS policies created successfully on Supabase!');
        
        await client.end();
        process.exit(0);
      } catch (err) {
        console.log(`❌ FAILED for ${region} (port ${port}): ${err.message}`);
        try {
          await client.end();
        } catch (e) {}
      }
    }
  }
  console.log('All regions and ports failed.');
  process.exit(1);
}

testRegions();
