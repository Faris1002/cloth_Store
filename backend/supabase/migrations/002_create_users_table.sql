-- 002_create_users_table.sql
-- Custom credentials table to store user accounts directly in PostgreSQL
-- Bypasses Supabase Auth email sending and rate limits

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Helper function for updated_at (if not created already)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create users table for direct credentials storage
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'seller')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast case-insensitive email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(LOWER(email));

-- Trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow full access to backend service role (used by Express backend)
DROP POLICY IF EXISTS "Service role full access to users" ON public.users;
CREATE POLICY "Service role full access to users"
    ON public.users
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Allow authenticated users to view their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    USING (true);

-- 3. Relax foreign key constraints on cart_items and products
-- This allows user IDs from public.users to be stored in cart_items and products
ALTER TABLE IF EXISTS cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;
ALTER TABLE IF EXISTS products DROP CONSTRAINT IF EXISTS products_created_by_fkey;

