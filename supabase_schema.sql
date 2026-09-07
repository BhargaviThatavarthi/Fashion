-- =========================================================
-- SRI SUBHAKARI FASHIONS - SUPABASE DATABASE & STORAGE SCHEMA
-- Execute this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql/new
-- =========================================================

-- Enable pgcrypto / uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 1. PRODUCTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    offer_price NUMERIC(10, 2),
    category TEXT,
    category_id UUID,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'out_of_stock', 'draft', 'archived')),
    image_url TEXT,
    images TEXT[] DEFAULT '{}',
    fabric TEXT,
    color TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    sku TEXT,
    wash_care TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT false,
    best_seller BOOLEAN DEFAULT false,
    new_arrival BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_stock_quantity ON public.products(stock_quantity);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_new_arrival ON public.products(new_arrival);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);

-- Auto-update updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    -- Automatically sync status with stock_quantity
    IF NEW.stock_quantity <= 0 THEN
        NEW.status = 'out_of_stock';
    ELSIF NEW.status = 'out_of_stock' AND NEW.stock_quantity > 0 THEN
        NEW.status = 'active';
    END IF;
    -- Synchronize primary image_url if images array is provided
    IF NEW.image_url IS NULL OR NEW.image_url = '' THEN
        IF array_length(NEW.images, 1) > 0 THEN
            NEW.image_url = NEW.images[1];
        END IF;
    ELSIF array_length(NEW.images, 1) IS NULL OR array_length(NEW.images, 1) = 0 THEN
        NEW.images = ARRAY[NEW.image_url];
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_products_updated_at ON public.products;
CREATE TRIGGER trigger_products_updated_at
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS for products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Product Policies:
-- 1. Public can view all products
CREATE POLICY "Allow public read access on products"
ON public.products FOR SELECT
USING (true);

-- 2. Authenticated users / Admins can insert products
CREATE POLICY "Allow public/admin insert on products"
ON public.products FOR INSERT
WITH CHECK (true);

-- 3. Authenticated users / Admins can update products
CREATE POLICY "Allow public/admin update on products"
ON public.products FOR UPDATE
USING (true);

-- 4. Authenticated users / Admins can delete products
CREATE POLICY "Allow public/admin delete on products"
ON public.products FOR DELETE
USING (true);


-- =========================================================
-- 2. CATEGORIES TABLE (Optional relational mapping)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    image TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories"
ON public.categories FOR SELECT
USING (true);

CREATE POLICY "Allow public insert on categories"
ON public.categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public update on categories"
ON public.categories FOR UPDATE
USING (true);

CREATE POLICY "Allow public delete on categories"
ON public.categories FOR DELETE
USING (true);


-- =========================================================
-- 3. MEDIA ASSETS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON public.media_assets(created_at DESC);

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on media_assets" 
ON public.media_assets FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on media_assets" 
ON public.media_assets FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public delete on media_assets" 
ON public.media_assets FOR DELETE 
USING (true);


-- =========================================================
-- 4. CUSTOMER LEADS / ENQUIRIES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.customer_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    source TEXT DEFAULT 'Website Inquiry',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Converted', 'Closed')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_leads_created_at ON public.customer_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_leads_status ON public.customer_leads(status);

ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on customer_leads" 
ON public.customer_leads FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on customer_leads" 
ON public.customer_leads FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update on customer_leads" 
ON public.customer_leads FOR UPDATE 
USING (true);

CREATE POLICY "Allow public delete on customer_leads" 
ON public.customer_leads FOR DELETE 
USING (true);


-- =========================================================
-- 5. STORAGE BUCKET CONFIGURATION (product-images)
-- =========================================================
-- Ensure bucket 'product-images' exists and is publicly readable
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5 MB limit per image
    ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

-- Storage Policies for product-images bucket:
-- 1. Public Read: Any customer can view product images
DROP POLICY IF EXISTS "Public Read Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read for product-images" ON storage.objects;
CREATE POLICY "Allow public read for product-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- 2. Upload Access for product-images
DROP POLICY IF EXISTS "Public Upload Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload for product-images" ON storage.objects;
CREATE POLICY "Allow upload for product-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

-- 3. Update Access for product-images
DROP POLICY IF EXISTS "Public Update Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow update for product-images" ON storage.objects;
CREATE POLICY "Allow update for product-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'product-images');

-- 4. Delete Access for product-images
DROP POLICY IF EXISTS "Public Delete Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete for product-images" ON storage.objects;
CREATE POLICY "Allow delete for product-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');
