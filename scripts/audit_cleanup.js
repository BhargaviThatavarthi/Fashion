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

async function inspectStorageAndProducts() {
  console.log('='.repeat(60));
  console.log('🔍 SUPABASE STORAGE & DATABASE IMAGE AUDIT');
  console.log('='.repeat(60));

  // 1. Inspect Storage bucket 'product-images' recursively
  console.log('\n📁 1. Scanning bucket `product-images`...');
  const bucketName = 'product-images';
  const allFiles = [];

  async function listRecursive(folder = '') {
    const { data, error } = await supabase.storage.from(bucketName).list(folder, {
      limit: 100,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      console.error(`Error listing folder "${folder}":`, error.message);
      return;
    }

    if (!data || data.length === 0) return;

    for (const item of data) {
      const fullPath = folder ? `${folder}/${item.name}` : item.name;
      if (item.id === null || !item.metadata) {
        // It's a directory/subfolder
        await listRecursive(fullPath);
      } else {
        // It's a file
        allFiles.push({
          name: item.name,
          path: fullPath,
          size: item.metadata?.size || 0,
          mimetype: item.metadata?.mimetype || 'unknown',
          created_at: item.created_at,
        });
      }
    }
  }

  await listRecursive('');

  console.log(`Total files found in \`${bucketName}\`: ${allFiles.length}`);
  allFiles.forEach((f, idx) => {
    console.log(`  [${idx + 1}] ${f.path} (${(f.size / 1024).toFixed(1)} KB, ${f.mimetype})`);
  });

  // 2. Inspect Database products table image fields
  console.log('\n🗄️ 2. Scanning `products` table in database...');
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, slug, images, category_id');

  if (prodErr) {
    console.error('Error fetching products:', prodErr.message);
  } else {
    console.log(`Total products in database: ${products?.length || 0}`);
    const affectedProducts = [];

    products?.forEach((p, idx) => {
      const hasImages = (Array.isArray(p.images) && p.images.length > 0) || Boolean(p.image_url);
      if (hasImages) {
        affectedProducts.push({
          id: p.id,
          name: p.name,
          image_url: p.image_url,
          images: p.images,
        });
      }
      console.log(`  [${idx + 1}] "${p.name}" (ID: ${p.id})`);
      console.log(`      image_url: ${p.image_url || 'null'}`);
      console.log(`      images: ${JSON.stringify(p.images || [])}`);
    });

    console.log(`\nProducts with image references that will be cleared: ${affectedProducts.length}`);
  }

  // 3. Inspect Media Assets table if exists
  console.log('\n🖼️ 3. Scanning `media_assets` table...');
  try {
    const { data: media, error: mediaErr } = await supabase.from('media_assets').select('*');
    if (!mediaErr && media) {
      console.log(`Total media asset records: ${media.length}`);
      media.forEach((m, idx) => {
        console.log(`  [${idx + 1}] ${m.file_path} -> ${m.public_url}`);
      });
    } else {
      console.log('No `media_assets` table records or table not queried.');
    }
  } catch (e) {}

  console.log('\n' + '='.repeat(60));
  console.log('AUDIT COMPLETED. Ready for confirmation report.');
  console.log('='.repeat(60));
}

inspectStorageAndProducts();
