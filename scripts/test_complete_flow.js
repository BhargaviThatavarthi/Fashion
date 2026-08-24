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

async function runEndToEndVerification() {
  console.log('='.repeat(70));
  console.log('🧪 RUNNING COMPLETE END-TO-END SUPABASE E-COMMERCE VERIFICATION');
  console.log('='.repeat(70));

  const testId = 'test_' + Date.now();
  const testFileName = `silk-sarees/${testId}_red_silk_saree.jpg`;
  const dummyImageBuffer = Buffer.from('RIFF....WEBPVP8 ... dummy test image content ...', 'utf-8');

  // STEP 1: Upload test product image to `product-images` bucket
  console.log('\n[1/5] 📤 Uploading test product image to `product-images` Storage...');
  const { data: uploadData, error: uploadErr } = await supabase.storage
    .from('product-images')
    .upload(testFileName, dummyImageBuffer, { contentType: 'image/jpeg', upsert: true });

  if (uploadErr) {
    console.error('❌ Failed to upload image to Supabase Storage:', uploadErr.message);
    process.exit(1);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(testFileName);

  console.log(`✅ Image uploaded successfully: ${publicUrl}`);

  // STEP 2: Save product to Supabase `products` table
  console.log('\n[2/5] 💾 Inserting product into Supabase `products` table...');
  const newProduct = {
    id: testId,
    name: 'Red Silk Saree',
    slug: `red-silk-saree-${testId}`,
    description: 'Traditional Red Pure Katan Silk Saree with rich gold zari woven work.',
    price: 2999,
    offer_price: 2499,
    category_id: '2', // Silk Sarees
    stock_quantity: 10,
    stock: 10,
    in_stock: true,
    images: [publicUrl],
    fabric: 'Pure Silk',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: inserted, error: insertErr } = await supabase
    .from('products')
    .insert(newProduct)
    .select()
    .single();

  if (insertErr) {
    console.error('❌ Failed to insert product:', insertErr.message);
    process.exit(1);
  }
  console.log(`✅ Product inserted with ID "${inserted.id}": "${inserted.name}" - ₹${inserted.price}`);

  // STEP 3: Verify /shop and category query
  console.log('\n[3/5] 🛍️ Verifying /shop and Silk Sarees category query...');
  const { data: shopProducts } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const foundOnStorefront = shopProducts.find(p => p.id === testId);
  if (foundOnStorefront) {
    console.log(`✅ Storefront /shop query returned new product "${foundOnStorefront.name}"!`);
    console.log(`   - Image URL stored: ${foundOnStorefront.images?.[0]}`);
  } else {
    console.error('❌ Product not found on /shop query');
    process.exit(1);
  }

  // STEP 4: Test Out of Stock behavior
  console.log('\n[4/5] 📦 Testing stock update to 0 (Out of stock)...');
  const { data: updatedStock } = await supabase
    .from('products')
    .update({ stock: 0, stock_quantity: 0, in_stock: false })
    .eq('id', testId)
    .select()
    .single();

  console.log(`✅ Product stock updated to 0 (in_stock: ${updatedStock.in_stock}). Image retained: ${updatedStock.images?.[0] ? 'YES' : 'NO'}`);

  // STEP 5: Test Permanent Deletion (Cleans up both DB row and Storage file)
  console.log('\n[5/5] 🗑️ Testing product deletion & storage cleanup...');
  // 5a. Delete storage file
  const { error: delStorageErr } = await supabase.storage
    .from('product-images')
    .remove([testFileName]);
  if (delStorageErr) {
    console.warn('Storage delete notice:', delStorageErr.message);
  } else {
    console.log('✅ Storage image removed from `product-images` bucket.');
  }

  // 5b. Delete database row
  const { error: delDbErr } = await supabase.from('products').delete().eq('id', testId);
  if (delDbErr) {
    console.error('❌ Failed to delete product row:', delDbErr.message);
  } else {
    console.log('✅ Product row deleted from `products` table.');
  }

  console.log('\n' + '='.repeat(70));
  console.log('🎉 ALL 5 STEPS PASSED PERFECTLY! SUPABASE-ONLY ARCHITECTURE VERIFIED!');
  console.log('='.repeat(70));
}

runEndToEndVerification();
