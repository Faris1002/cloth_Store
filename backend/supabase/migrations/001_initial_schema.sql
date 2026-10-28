-- 001_initial_schema.sql
-- Production schema for Clothing Store E-Commerce Application

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================================
-- 1. Helper Functions & Triggers
-- ==========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 2. Products Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12,2) NOT NULL CHECK (price > 0),
    category TEXT NOT NULL CHECK (category IN ('Men', 'Women', 'Kids', 'Accessories', 'Footwear')),
    image_url TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop triggers if exist before creating
DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- ==========================================================
-- 3. Cart Items Table
-- ==========================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_product UNIQUE (user_id, product_id)
);

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS set_cart_items_updated_at ON cart_items;
CREATE TRIGGER set_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for cart
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- ==========================================================
-- 4. Row Level Security (RLS) Policies
-- ==========================================================

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products Policies
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
CREATE POLICY "Products are publicly readable"
    ON products FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can create products" ON products;
CREATE POLICY "Authenticated users can create products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can update their own products" ON products;
CREATE POLICY "Users can update their own products"
    ON products FOR UPDATE
    TO authenticated
    USING (created_by = auth.uid())
    WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own products" ON products;
CREATE POLICY "Users can delete their own products"
    ON products FOR DELETE
    TO authenticated
    USING (created_by = auth.uid());

-- Cart Items Policies
DROP POLICY IF EXISTS "Users can view their own cart items" ON cart_items;
CREATE POLICY "Users can view their own cart items"
    ON cart_items FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can add items to their own cart" ON cart_items;
CREATE POLICY "Users can add items to their own cart"
    ON cart_items FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own cart items" ON cart_items;
CREATE POLICY "Users can update their own cart items"
    ON cart_items FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own cart items" ON cart_items;
CREATE POLICY "Users can delete their own cart items"
    ON cart_items FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ==========================================================
-- 5. Seed Catalog Products (Initial Data)
-- ==========================================================
INSERT INTO products (name, description, price, category, image_url, stock_quantity)
VALUES
    (
        'Classic Oxford Cotton Shirt',
        'Tailored from breathable 100% organic cotton with button-down collar and regular fit. Perfect for business casual or weekend wear.',
        49.99,
        'Men',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
        35
    ),
    (
        'Slim-Fit Chino Trousers',
        'Modern cut stretch-cotton chinos featuring angled front pockets and welt back pockets. Versatile and durable everyday staple.',
        59.50,
        'Men',
        'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
        25
    ),
    (
        'Floral Silk Midi Wrap Dress',
        'Graceful silhouette crafted in lightweight crepe silk with a flattering V-neckline, flutter sleeves, and waist tie sash.',
        89.00,
        'Women',
        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
        18
    ),
    (
        'Ribbed Cashmere Turtleneck',
        'Sumptuously soft Grade-A cashmere knit sweater with refined ribbing at cuffs and hem. Designed for pure comfort and timeless elegance.',
        129.00,
        'Women',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
        14
    ),
    (
        'Cozy Denim Jacket for Kids',
        'Durable cotton denim jacket with soft sherpa lining, snap-button closure, and deep pockets. Ideal for all outdoor adventures.',
        39.99,
        'Kids',
        'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80',
        30
    ),
    (
        'Striped Organic Cotton T-Shirt Set',
        'Pack of 2 ultra-soft combed cotton tees designed with hypoallergenic seams and vibrant nautical stripes.',
        24.99,
        'Kids',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
        50
    ),
    (
        'Full-Grain Leather Crossbody Bag',
        'Handcrafted vegetable-tanned genuine leather with brass hardware, adjustable strap, and dedicated smartphone sleeve.',
        110.00,
        'Accessories',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
        12
    ),
    (
        'Polarized Acetate Sunglasses',
        'Hand-finished Italian acetate frames fitted with UV400 polarized scratch-resistant lenses for optimal clarity and eye protection.',
        65.00,
        'Accessories',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        40
    ),
    (
        'Heritage Low-Top White Sneakers',
        'Minimalist calfskin leather sneakers with cushioned ortholite insoles and durable vulcanized rubber soles.',
        95.00,
        'Footwear',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
        22
    ),
    (
        'Chelsea Suede Ankle Boots',
        'Supple water-resistant suede boots with elastic side gussets, leather pull tab, and Goodyear-welted non-slip soles.',
        145.00,
        'Footwear',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
        16
    )
ON CONFLICT DO NOTHING;
