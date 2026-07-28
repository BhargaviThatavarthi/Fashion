import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env file
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

// Robust CSV Parser
function parseCSV(content) {
  const lines = [];
  let currentLine = [];
  let currentToken = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentLine.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentLine.push(currentToken.trim());
      if (currentLine.length > 1 || currentLine[0] !== '') {
        lines.push(currentLine);
      }
      currentLine = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }
  if (currentToken !== '' || currentLine.length > 0) {
    currentLine.push(currentToken.trim());
    lines.push(currentLine);
  }
  return lines;
}

const env = loadEnv();
const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseAnonKey = env['VITE_SUPABASE_ANON_KEY'];

const csvPath = 'C:\\Users\\New User\\Downloads\\ssf_products.csv';

if (!fs.existsSync(csvPath)) {
  console.error(`Error: CSV file not found at ${csvPath}`);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const parsedData = parseCSV(csvContent);

if (parsedData.length <= 1) {
  console.error('Error: CSV file is empty or only contains headers.');
  process.exit(1);
}

const headers = parsedData[0];
const rows = parsedData.slice(1);

// Helper to map category names to IDs
// Categories mapping from categories.json:
// 1: Sarees
// 2: Silk Sarees
// 3: Cotton Sarees
// 4: Designer Sarees
// 5: Lehengas
// 6: Kurtis
// 7: Dress Materials
// 8: Ethnic Wear
function mapCategory(name, fabric) {
  const n = name.toLowerCase();
  const f = fabric ? fabric.toLowerCase() : '';
  
  if (n.includes('kanjivaram') || n.includes('silk') || f.includes('silk')) {
    return '2'; // Silk Sarees
  }
  if (n.includes('lehenga') || n.includes('choli')) {
    return '5'; // Lehengas
  }
  if (n.includes('kurti') || n.includes('anarkali') || f.includes('rayon')) {
    return '6'; // Kurtis
  }
  if (n.includes('pochampally') || n.includes('ikat') || f.includes('cotton') || f.includes('handloom')) {
    return '3'; // Cotton Sarees
  }
  if (n.includes('designer') || n.includes('georgette') || f.includes('georgette') || f.includes('chiffon') || n.includes('crepe')) {
    return '4'; // Designer Sarees
  }
  if (n.includes('saree')) {
    return '1'; // Sarees
  }
  return '8'; // Ethnic Wear
}

// Parse products from CSV
const products = rows.map((row, idx) => {
  const productObj = {};
  headers.forEach((header, colIdx) => {
    const val = row[colIdx];
    const key = header.toLowerCase();
    
    if (key === 'price' || key === 'offer_price' || key === 'stock') {
      productObj[key] = val ? parseFloat(val) : 0;
    } else if (key === 'featured' || key === 'best_seller' || key === 'new_arrival' || key === 'in_stock') {
      productObj[key] = val ? val.toUpperCase() === 'TRUE' : false;
    } else {
      productObj[key] = val || '';
    }
  });

  // Calculate fields not present in CSV
  const categoryId = mapCategory(productObj.name, productObj.fabric);
  
  // Set default placeholders for images
  let imagePlaceholder = '/placeholder-saree-1.jpg';
  if (categoryId === '5') imagePlaceholder = '/placeholder-lehenga.jpg';
  else if (idx % 2 === 1) imagePlaceholder = '/placeholder-saree-2.jpg';

  return {
    id: (idx + 1).toString(),
    name: productObj.name || '',
    slug: productObj.slug || '',
    description: productObj.description || '',
    category_id: categoryId,
    fabric: productObj.fabric || '',
    color: productObj.name.includes('Red') ? ['Red', 'Gold'] : 
           productObj.name.includes('Blue') ? ['Blue', 'White'] : 
           productObj.name.includes('Pink') ? ['Rose Pink', 'Gold'] : ['Teal', 'Gold'],
    sizes: categoryId === '5' || categoryId === '6' ? ['XS', 'S', 'M', 'L', 'XL'] : ['Free Size'],
    price: productObj.price || 0,
    offer_price: productObj.offer_price || null,
    images: [imagePlaceholder],
    sku: productObj.sku || '',
    wash_care: productObj.wash_care || '',
    rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
    review_count: Math.floor(10 + Math.random() * 200),
    featured: productObj.featured || false,
    best_seller: productObj.best_seller || false,
    new_arrival: productObj.new_arrival || false,
    stock: productObj.stock || 0,
    tags: categoryId === '2' ? ['Silk', 'Wedding', 'Traditional'] :
          categoryId === '5' ? ['Lehenga', 'Bridal', 'Embroidery'] :
          categoryId === '6' ? ['Anarkali', 'Kurti', 'Chikankari'] : ['Traditional', 'New'],
    in_stock: productObj.in_stock || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
});

// Update products.json for local/demo mode
const productsJsonPath = path.join('src', 'server', 'data', 'products.json');
fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf-8');
console.log(`Successfully updated local database: ${productsJsonPath} with ${products.length} products.`);

// Generate the SQL schema file in case tables need to be created in Supabase
const sqlSchema = `-- SQL Schema DDL for Sri Subhakari Fashions
-- Run this in your Supabase SQL Editor to create the required tables

-- 1. Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  fabric TEXT,
  color TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  price NUMERIC NOT NULL,
  offer_price NUMERIC,
  images TEXT[] DEFAULT '{}',
  sku TEXT,
  wash_care TEXT,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  best_seller BOOLEAN DEFAULT FALSE,
  new_arrival BOOLEAN DEFAULT FALSE,
  stock INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  instagram TEXT,
  youtube TEXT,
  facebook TEXT,
  linkedin TEXT,
  whatsapp TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Create homepage_banner table
CREATE TABLE IF NOT EXISTS homepage_banner (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image TEXT,
  button_text TEXT,
  button_link TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 7. Create contact_enquiries table
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  product_name TEXT,
  product_id TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 8. Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS) policies or bypass for simple apps
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_banner ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active display tables
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access on social_links" ON social_links FOR SELECT USING (true);
CREATE POLICY "Allow public read access on homepage_banner" ON homepage_banner FOR SELECT USING (true);

-- Allow public insert access on enquiries & subscribers
CREATE POLICY "Allow public inserts on contact_enquiries" ON contact_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public inserts on newsletter_subscribers" ON newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Full access for authenticated administrators
CREATE POLICY "Allow all admin access on categories" ON categories TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on products" ON products TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on testimonials" ON testimonials TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on social_links" ON social_links TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on homepage_banner" ON homepage_banner TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on contact_enquiries" ON contact_enquiries TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all admin access on newsletter_subscribers" ON newsletter_subscribers TO authenticated USING (true) WITH CHECK (true);
`;

fs.writeFileSync('supabase_schema.sql', sqlSchema, 'utf-8');
console.log('Successfully wrote Supabase schema DDL to: supabase_schema.sql');

// Try uploading to Supabase
if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'placeholder' && supabaseUrl !== 'your_supabase_url') {
  console.log('\nChecking Supabase connection...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // 1. Check if categories table exists
    const { data: catData, error: catError } = await supabase.from('categories').select('id');
    
    if (catError) {
      console.log('⚠️ Supabase tables do not exist yet. Please run the SQL schema file (supabase_schema.sql) in your Supabase SQL Editor first!');
      console.log('You can find the schema file in the root directory: supabase_schema.sql');
      process.exit(0);
    }
    
    console.log('Supabase connection verified. Categories table is present.');
    
    // 2. Seed Categories first (if empty)
    if (catData.length === 0) {
      console.log('Seeding categories...');
      const categoriesJsonPath = path.join('src', 'server', 'data', 'categories.json');
      const categories = JSON.parse(fs.readFileSync(categoriesJsonPath, 'utf-8'));
      const { error: insertCatError } = await supabase.from('categories').insert(categories);
      if (insertCatError) {
        console.error('Error inserting categories:', insertCatError.message);
      } else {
        console.log('Categories seeded successfully.');
      }
    } else {
      console.log('Categories already present in database. Skipping category seed.');
    }
    
    // 3. Insert/Upsert products
    console.log('Uploading products to Supabase...');
    
    // Prepare products for Supabase (remove category object just in case)
    const supabaseProducts = products.map(({ category, ...p }) => p);
    
    const { error: insertProdError } = await supabase.from('products').upsert(supabaseProducts);
    
    if (insertProdError) {
      console.error('Error uploading products:', insertProdError.message);
    } else {
      console.log(`Successfully uploaded ${products.length} products to Supabase!`);
    }
  } catch (err) {
    console.error('An error occurred while uploading to Supabase:', err.message);
  }
} else {
  console.log('\nSupabase not configured in .env. Running in Local/Demo mode (using products.json).');
}
