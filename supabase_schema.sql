-- =========================================================
-- SRI SUBHAKARI FASHIONS - SUPABASE DATABASE & STORAGE SCHEMA
-- Execute this script in your Supabase SQL Editor:
-- https://app.supabase.com/project/_/sql/new
-- =========================================================

-- 1. MEDIA ASSETS TABLE
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL,
    file_type TEXT,
    file_size BIGINT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for media query performance
CREATE INDEX IF NOT EXISTS idx_media_assets_created_at ON public.media_assets(created_at DESC);

-- Enable RLS for media_assets
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Allow public read access to media_assets
CREATE POLICY "Allow public read access on media_assets" 
ON public.media_assets FOR SELECT 
USING (true);

-- Allow public insert on media_assets
CREATE POLICY "Allow public insert on media_assets" 
ON public.media_assets FOR INSERT 
WITH CHECK (true);

-- Allow public delete on media_assets
CREATE POLICY "Allow public delete on media_assets" 
ON public.media_assets FOR DELETE 
USING (true);


-- 2. CUSTOMER LEADS TABLE
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

-- Index for lead queries
CREATE INDEX IF NOT EXISTS idx_customer_leads_created_at ON public.customer_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_leads_status ON public.customer_leads(status);

-- Enable RLS for customer_leads
ALTER TABLE public.customer_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_leads
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


-- 3. STORAGE BUCKET CONFIGURATION (product-images)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policies for product-images bucket
CREATE POLICY "Public Read Access for product-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

CREATE POLICY "Public Upload Access for product-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Delete Access for product-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');
