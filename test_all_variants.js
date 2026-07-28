import pg from 'pg';

const host = 'aws-0-ap-south-1.pooler.supabase.com';
const password = 'Bhargavi@123';
const encodedPassword = encodeURIComponent(password);

const variants = [
  // Variant 1: standard user with project ref, standard db
  { user: 'postgres.kmxsgomxxhwpmoayeqmj', db: 'postgres', port: 6543 },
  { user: 'postgres.kmxsgomxxhwpmoayeqmj', db: 'postgres', port: 5432 },
  
  // Variant 2: standard user with project ref, db with project ref
  { user: 'postgres.kmxsgomxxhwpmoayeqmj', db: 'postgres.kmxsgomxxhwpmoayeqmj', port: 6543 },
  { user: 'postgres.kmxsgomxxhwpmoayeqmj', db: 'postgres.kmxsgomxxhwpmoayeqmj', port: 5432 },
  
  // Variant 3: simple user, standard db (routes by SNI or TLS hostname, though unlikely without project ref)
  { user: 'postgres', db: 'postgres', port: 6543 },
  { user: 'postgres', db: 'postgres', port: 5432 }
];

const { Client } = pg;

async function run() {
  for (const v of variants) {
    const connectionString = `postgresql://${v.user}:${encodedPassword}@${host}:${v.port}/${v.db}`;
    console.log(`Trying variant: User=${v.user}, DB=${v.db}, Port=${v.port}...`);
    
    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    try {
      await client.connect();
      console.log('✅ CONNECTED SUCCESSFULY!');
      console.log('Parameters worked:', v);
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log(`❌ Failed: ${err.message}`);
      try {
        await client.end();
      } catch (e) {}
    }
  }
  console.log('All variants failed.');
}

run();
