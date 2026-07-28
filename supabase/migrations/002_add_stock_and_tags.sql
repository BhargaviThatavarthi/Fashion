-- Migration: Add stock, tags, and in_stock columns to products table
-- Run this in your Supabase SQL Editor

-- 1. Add stock column with default value 0
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;

-- 2. Add tags column as text array with default empty array
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- 3. Add in_stock boolean column with default true
ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;
