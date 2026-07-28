import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

function loadEnv() {
  const env = {};
  if (fs.existsSync('.env')) {
    const content = fs.readFileSync('.env', 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        env[match[1]] = value.trim();
      }
    });
  }
  return env;
}

const env = loadEnv();
const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY']);

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'srisubhakari@gmail.com',
    password: 'Bhargavi@123'
  });
  if (error) {
    console.error('❌ Signin failed:', error.message);
  } else {
    console.log('✅ Signin Succeeded!', data.user.email);
  }
}

run();
