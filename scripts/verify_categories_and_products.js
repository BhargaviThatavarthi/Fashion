import http from 'http';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.readFileSync('.env', 'utf-8');
let supabaseUrl = '', supabaseAnonKey = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = trimmed.slice('VITE_SUPABASE_URL='.length).replace(/^['"]|['"]$/g, '');
  if (trimmed.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseAnonKey = trimmed.slice('VITE_SUPABASE_ANON_KEY='.length).replace(/^['"]|['"]$/g, '');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CATEGORIES = [
  { name: 'Sarees', slug: 'sarees', id: '1' },
  { name: 'Silk Sarees', slug: 'silk-sarees', id: '2' },
  { name: 'Cotton Sarees', slug: 'cotton-sarees', id: '3' },
  { name: 'Designer Sarees', slug: 'designer-sarees', id: '4' },
  { name: 'Lehengas', slug: 'lehengas', id: '5' },
  { name: 'Kurtis', slug: 'kurtis', id: '6' },
  { name: 'Dress Materials', slug: 'dress-materials', id: '7' },
  { name: 'Ethnic Wear', slug: 'ethnic-wear', id: '8' },
];

async function verifyAll() {
  console.log('='.repeat(60));
  console.log('🧪 CATEGORY & PRODUCT IMAGE BEHAVIOR VERIFICATION');
  console.log('='.repeat(60));

  // 1. Verify 8 static category assets exist in filesystem
  console.log('\n[1] Verifying 8 Static Category Display Assets:');
  const assetFiles = [
    'sarees.jpg',
    'silk-sarees.jpg',
    'cotton-sarees.jpg',
    'designer-sarees.jpg',
    'lehengas.jpg',
    'kurtis.jpg',
    'dress-materials.jpg',
    'ethnic-wear.jpg',
  ];
  assetFiles.forEach(file => {
    const srcPath = `src/assets/categories/${file}`;
    const pubPath = `public/images/categories/${file}`;
    const existsSrc = fs.existsSync(srcPath);
    const existsPub = fs.existsSync(pubPath);
    console.log(`   ${existsSrc && existsPub ? '✅' : '❌'} ${file} -> src: ${existsSrc}, public: ${existsPub}`);
  });

  // 2. Test Supabase Product Fetching per Category
  console.log('\n[2] Testing Dynamic Product Retrieval from Supabase:');
  for (const cat of CATEGORIES) {
    const ids = [cat.id, cat.slug, cat.name];
    const orCond = ids.map(id => `category_id.eq.${id}`).join(',');
    const { data, error } = await supabase.from('products').select('id, name, category_id, images').or(orCond);
    if (error) {
      console.log(`   ❌ ${cat.name}: Error - ${error.message}`);
    } else {
      console.log(`   ✅ Category "${cat.name}" (Slug: "${cat.slug}", ID: "${cat.id}") -> Found ${data.length} dynamic products in DB:`);
      data.forEach(p => {
        const img = p.images?.[0] || '(no image attached)';
        console.log(`      • [${p.id}] ${p.name} | Image: ${img}`);
      });
    }
  }

  // 3. Test HTTP routes on Dev Server
  console.log('\n[3] Testing Dev Server HTTP Endpoints:');
  const routes = ['/', '/shop', '/shop?category=silk-sarees', '/shop?category=cotton-sarees', '/admin', '/admin/products', '/admin/products/new'];
  for (const route of routes) {
    await new Promise((resolve) => {
      http.get(`http://localhost:8001${route}`, (res) => {
        console.log(`   ${res.statusCode === 200 ? '✅' : '⚠️'} ${route} -> Status ${res.statusCode}`);
        resolve();
      }).on('error', (err) => {
        console.log(`   ⚠️ ${route} -> Error: ${err.message}`);
        resolve();
      });
    });
  }

  console.log('\n='.repeat(60));
  console.log('🎉 ALL CHECKS COMPLETED!');
  console.log('='.repeat(60));
}

verifyAll();
