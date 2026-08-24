import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Simple .env reader
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
    } else if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) {
      supabaseAnonKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {}

console.log('='.repeat(60));
console.log('🔍 SUPABASE INTEGRATION VERIFICATION');
console.log('='.repeat(60));
console.log(`URL: ${supabaseUrl || '(not configured)'}`);
console.log(`Anon Key: ${supabaseAnonKey ? supabaseAnonKey.slice(0, 16) + '...' : '(not configured)'}`);
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.error('❌ Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be provided in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runVerification() {
  let allPass = true;

  // 1. Test Project Connection & Products Table
  console.log('\n[1/5] Testing Database Connection & `products` Table...');
  try {
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      console.error(`❌ Products Table Error: ${error.message} (Code: ${error.code})`);
      allPass = false;
    } else {
      console.log(`✅ Connection OK! Total products in database: ${count ?? (data ? data.length : 0)}`);
      if (data && data.length > 0) {
        data.forEach((p, i) => {
          console.log(`   [${i+1}] "${p.name}" - ₹${p.price} (Status: ${p.status}, Stock: ${p.stock_quantity}, Images: ${p.images?.length || (p.image_url ? 1 : 0)})`);
        });
      }
    }
  } catch (err) {
    console.error(`❌ Network / Connection failed: ${err.message}`);
    allPass = false;
  }

  // 2. Test Categories Table
  console.log('\n[2/5] Testing `categories` Table...');
  try {
    const { data, error } = await supabase.from('categories').select('id, name, slug').limit(5);
    if (error) {
      console.warn(`⚠️ Categories Table Warning: ${error.message}`);
    } else {
      console.log(`✅ Categories OK! Total returned: ${data?.length || 0}`);
      if (data && data.length > 0) {
        console.log(`   Categories: ${data.map(c => c.name).join(', ')}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Categories query error: ${err.message}`);
  }

  // 3. Test Storage Bucket 'product-images'
  console.log('\n[3/5] Testing Storage Bucket `product-images`...');
  try {
    const { data: buckets, error: bucketErr } = await supabase.storage.listBuckets();
    if (bucketErr) {
      console.error(`❌ Storage Buckets Error: ${bucketErr.message}`);
      allPass = false;
    } else {
      const imgBucket = buckets.find((b) => b.name === 'product-images' || b.id === 'product-images');
      if (imgBucket) {
        console.log(`✅ Bucket \`product-images\` exists! (Public: ${imgBucket.public})`);
      } else {
        console.error('❌ Bucket `product-images` not found in storage.buckets.');
        console.log('   Available buckets:', buckets.map((b) => b.name).join(', ') || 'None');
        allPass = false;
      }
    }
  } catch (err) {
    console.error(`❌ Storage Error: ${err.message}`);
    allPass = false;
  }

  // 4. Test Public Read Access on Storage
  console.log('\n[4/5] Testing Public Image Read Access...');
  try {
    const { data: files, error: listErr } = await supabase.storage.from('product-images').list('', { limit: 5 });
    if (listErr) {
      console.warn(`⚠️ Storage List Warning (may require authenticated user): ${listErr.message}`);
    } else {
      console.log(`✅ Storage listing OK! Files/folders found in root: ${files?.length || 0}`);
      if (files && files.length > 0) {
        console.log(`   Items: ${files.map(f => f.name).join(', ')}`);
      }
    }
  } catch (err) {
    console.warn(`⚠️ Storage listing error: ${err.message}`);
  }

  // 5. Test Customer Leads Table
  console.log('\n[5/5] Testing `customer_leads` Table...');
  try {
    const { data, error } = await supabase.from('customer_leads').select('id, customer_name').limit(5);
    if (error) {
      console.warn(`⚠️ Customer Leads Table Warning: ${error.message}`);
    } else {
      console.log(`✅ Customer Leads OK! Total returned: ${data?.length || 0}`);
    }
  } catch (err) {
    console.warn(`⚠️ Customer Leads error: ${err.message}`);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  if (allPass) {
    console.log('🎉 SUPABASE VERIFICATION PASSED! Everything is connected & ready.');
  } else {
    console.log('⚠️ Verification completed with notices. See details above.');
  }
  console.log('='.repeat(60));
}

runVerification();
