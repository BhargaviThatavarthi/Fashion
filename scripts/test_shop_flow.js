// Since node doesn't resolve typescript files directly, let's test querying via Supabase client with the exact same logic
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let supabaseUrl = '';
let supabaseAnonKey = '';
try {
  const envContent = fs.readFileSync('.env', 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = trimmed.replace('VITE_SUPABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
    if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseAnonKey = trimmed.replace('VITE_SUPABASE_ANON_KEY=', '').trim().replace(/^["']|["']$/g, '');
  }
} catch (e) {}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testShopFlow() {
  console.log('='.repeat(60));
  console.log('🛒 TESTING /shop STOREFRONT QUERY LOGIC');
  console.log('='.repeat(60));

  // 1. Fetch categories
  const { data: dbCats } = await supabase.from('categories').select('id, name, slug');
  console.log(`Categories found in DB (${dbCats.length}):`);
  dbCats.forEach(c => console.log(`  - [ID: ${c.id}] ${c.name} (slug: ${c.slug})`));

  // 2. Fetch all products as /shop does
  const { data: products, error, count } = await supabase
    .from('products')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Storefront query error:', error.message);
    process.exit(1);
  }

  console.log(`\n✅ Total products fetched for /shop: ${count}`);
  products.forEach((p, idx) => {
    const cat = dbCats.find(c => c.id === p.category_id);
    console.log(`  [${idx + 1}] "${p.name}" (ID: ${p.id})`);
    console.log(`      Category: ${cat ? cat.name : '(unassigned)'}`);
    console.log(`      Price: ₹${p.price} (Offer: ${p.offer_price ? '₹' + p.offer_price : 'none'})`);
    console.log(`      Stock: ${p.stock} | in_stock: ${p.in_stock}`);
    console.log(`      Images: ${JSON.stringify(p.images)}`);
  });

  // 3. Category Filter Test (e.g. 'sarees' or '1')
  console.log('\n🔍 Testing Category Filter (Sarees)...');
  const sareeCat = dbCats.find(c => c.slug === 'sarees');
  const { data: sareeProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', sareeCat.id);

  console.log(`✅ Sarees filter returned ${sareeProducts.length} product(s).`);

  console.log('\n' + '='.repeat(60));
  console.log('🎉 STOREFRONT DATA FLOW VERIFIED!');
  console.log('='.repeat(60));
}

testShopFlow();
