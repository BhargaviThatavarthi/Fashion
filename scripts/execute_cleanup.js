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

export async function performCleanup() {
  console.log('='.repeat(60));
  console.log('🚀 EXECUTING STORAGE & DATABASE IMAGE CLEANUP');
  console.log('='.repeat(60));

  const bucketName = 'product-images';
  const allFilePaths = [];

  // 1. Gather all files in product-images recursively
  async function listRecursive(folder = '') {
    const { data, error } = await supabase.storage.from(bucketName).list(folder, {
      limit: 100,
    });
    if (error) {
      console.warn(`Error scanning "${folder}":`, error.message);
      return;
    }
    if (!data || data.length === 0) return;

    for (const item of data) {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      if (item.id === null || !item.metadata) {
        await listRecursive(fullPath);
      } else {
        allFilePaths.push(fullPath);
      }
    }
  }

  console.log('\n[1/3] Scanning `product-images` bucket...');
  await listRecursive('');

  if (allFilePaths.length > 0) {
    console.log(`Deleting ${allFilePaths.length} file(s) from \`${bucketName}\` bucket:`);
    allFilePaths.forEach((p) => console.log(`  - ${p}`));
    const { error: delErr } = await supabase.storage.from(bucketName).remove(allFilePaths);
    if (delErr) {
      console.error('❌ Failed to delete storage files:', delErr.message);
    } else {
      console.log('✅ Storage files deleted successfully.');
    }
  } else {
    console.log('No files to delete in `product-images`.');
  }

  // 2. Clear image references from existing products table
  console.log('\n[2/3] Resetting image arrays in `products` table...');
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name');

  if (prodErr) {
    console.error('❌ Error reading products:', prodErr.message);
  } else if (products) {
    for (const p of products) {
      const { error: updateErr } = await supabase
        .from('products')
        .update({ images: [] })
        .eq('id', p.id);

      if (updateErr) {
        console.warn(`Failed to reset images for "${p.name}" (${p.id}):`, updateErr.message);
      } else {
        console.log(`  - Cleared image references for: "${p.name}"`);
      }
    }
    console.log(`✅ Cleared image references for ${products.length} product(s).`);
  }

  // 3. Clear media_assets table records if table exists
  console.log('\n[3/3] Clearing `media_assets` table records...');
  try {
    const { error: mediaDelErr } = await supabase
      .from('media_assets')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // match all

    if (mediaDelErr) {
      console.warn('Notice clearing media_assets:', mediaDelErr.message);
    } else {
      console.log('✅ Cleared media_assets records.');
    }
  } catch (e) {}

  console.log('\n' + '='.repeat(60));
  console.log('🎉 CLEANUP COMPLETED! Bucket and product records are fresh.');
  console.log('='.repeat(60));
}

// Run if called directly
if (process.argv[1]?.endsWith('execute_cleanup.js')) {
  performCleanup();
}
