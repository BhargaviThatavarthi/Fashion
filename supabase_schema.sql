-- SQL Schema DDL for Sri Subhakari Fashions
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
