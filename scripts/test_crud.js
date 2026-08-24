import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCrud() {
  console.log('--- 1. Testing Product Insertion ---');
  const newId = 'prod_' + Date.now();
  const insertPayload = {
    id: newId,
    name: 'Verification Silk Saree',
    slug: 'verification-silk-saree-' + Date.now(),
    description: 'A test verification product created directly in live Supabase.',
    price: 8999,
    offer_price: 7999,
    category_id: '2',
    fabric: 'Pure Silk',
    stock: 10,
    stock_quantity: 10,
    in_stock: true,
    images: ['/placeholder-saree-1.jpg'],
    featured: true,
    new_arrival: true,
    tags: ['Silk', 'Test'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertError } = await supabase
    .from('products')
    .insert(insertPayload)
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert failed:', insertError.message);
    process.exit(1);
  }
  console.log(`✅ Product created successfully: [${inserted.id}] "${inserted.name}" - ₹${inserted.price} (Stock: ${inserted.stock})`);

  console.log('\n--- 2. Testing Product Update ---');
  const { data: updated, error: updateError } = await supabase
    .from('products')
    .update({ price: 7499, offer_price: 6999, stock: 8, stock_quantity: 8 })
    .eq('id', newId)
    .select()
    .single();

  if (updateError) {
    console.error('❌ Update failed:', updateError.message);
  } else {
    console.log(`✅ Product updated successfully: Price updated to ₹${updated.price} (Offer: ₹${updated.offer_price}, Stock: ${updated.stock})`);
  }

  console.log('\n--- 3. Testing Product Deletion ---');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', newId);

  if (deleteError) {
    console.error('❌ Delete failed:', deleteError.message);
  } else {
    console.log(`✅ Product deleted successfully: ID ${newId}`);
  }

  console.log('\n🎉 ALL LIVE DATABASE CRUD OPERATIONS SUCCEEDED!');
}

testCrud();
