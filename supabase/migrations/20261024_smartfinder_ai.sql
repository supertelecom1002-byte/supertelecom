-- =====================================================================
-- SUPER TELECOM SMARTFINDER AI - SHARED DATABASE SCHEMA
-- Version: 20261024_smartfinder_ai
-- Description: Multi-engine smartphone catalogue, variants, specs,
--              benchmark metrics, live retailer price history, 14-point resale
--              valuation, and privacy-first ephemeral scan sessions.
-- =====================================================================

-- 1. Devices Master Table
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand TEXT NOT NULL,
    marketing_model_name TEXT NOT NULL,
    model_identifier TEXT NOT NULL UNIQUE,
    release_date DATE,
    official_product_url TEXT,
    category TEXT DEFAULT 'smartphone',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'upcoming')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Device Variants Table (RAM, Storage, Colors)
CREATE TABLE IF NOT EXISTS public.device_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    ram_gb INTEGER NOT NULL,
    storage_gb INTEGER NOT NULL,
    colour TEXT,
    region TEXT NOT NULL DEFAULT 'IN',
    supported_networks TEXT[] DEFAULT ARRAY['5G', '4G', 'VoLTE'],
    variant_identifier TEXT,
    variant_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Device Hardware Specifications & Benchmarks Table
CREATE TABLE IF NOT EXISTS public.device_specs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE UNIQUE,
    display_type TEXT NOT NULL,
    display_size TEXT NOT NULL,
    resolution TEXT NOT NULL,
    refresh_rate TEXT NOT NULL,
    chipset TEXT NOT NULL,
    gpu TEXT,
    battery_capacity INTEGER NOT NULL,
    charging_wattage INTEGER NOT NULL,
    ois_support BOOLEAN NOT NULL DEFAULT false,
    rear_camera_configuration TEXT NOT NULL,
    front_camera TEXT NOT NULL,
    video_capabilities TEXT,
    dimensions TEXT,
    weight TEXT,
    software_support TEXT,
    benchmark_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    pros TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    cons TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    specifications_source TEXT,
    source_url TEXT,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Retailer Offers & Live Price History Table
CREATE TABLE IF NOT EXISTS public.retailer_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.device_variants(id) ON DELETE CASCADE,
    retailer_name TEXT NOT NULL CHECK (retailer_name IN ('Amazon', 'Flipkart', 'Croma', 'Reliance Digital', 'Super Telecom Official', 'Other')),
    offer_price NUMERIC(10, 2) NOT NULL,
    mrp NUMERIC(10, 2),
    currency TEXT NOT NULL DEFAULT 'INR',
    product_url TEXT,
    affiliate_url TEXT,
    in_stock BOOLEAN NOT NULL DEFAULT true,
    is_stale BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Used Phone Resale Valuation Engine Offers Table
CREATE TABLE IF NOT EXISTS public.valuation_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES public.devices(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.device_variants(id) ON DELETE CASCADE,
    condition_grade TEXT NOT NULL CHECK (condition_grade IN ('Excellent', 'Good', 'Fair', 'Damaged', 'Not Working')),
    private_sale_low NUMERIC(10, 2) NOT NULL,
    private_sale_high NUMERIC(10, 2) NOT NULL,
    external_buyback_benchmark NUMERIC(10, 2) NOT NULL,
    super_telecom_estimated_quote NUMERIC(10, 2) NOT NULL,
    hardware_condition_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Privacy-First Ephemeral Scan Sessions Table (Strict Privacy: 0 IMEI, 0 Serial Numbers, 0 Image Binary)
CREATE TABLE IF NOT EXISTS public.scan_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    detected_brand TEXT,
    detected_model TEXT,
    scan_method TEXT NOT NULL CHECK (scan_method IN ('user_agent', 'box_camera', 'model_code', 'manual')),
    confidence_score NUMERIC(4, 2) DEFAULT 0.90,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for lightning fast lookups
CREATE INDEX IF NOT EXISTS idx_devices_brand ON public.devices(brand);
CREATE INDEX IF NOT EXISTS idx_devices_model_identifier ON public.devices(model_identifier);
CREATE INDEX IF NOT EXISTS idx_devices_marketing_name ON public.devices(marketing_model_name);
CREATE INDEX IF NOT EXISTS idx_device_variants_device_id ON public.device_variants(device_id);
CREATE INDEX IF NOT EXISTS idx_device_specs_device_id ON public.device_specs(device_id);
CREATE INDEX IF NOT EXISTS idx_retailer_offers_device_id ON public.retailer_offers(device_id);
CREATE INDEX IF NOT EXISTS idx_retailer_offers_price ON public.retailer_offers(offer_price);
CREATE INDEX IF NOT EXISTS idx_valuation_offers_device ON public.valuation_offers(device_id, condition_grade);

-- Enable Row Level Security (RLS)
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailer_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_sessions ENABLE ROW LEVEL SECURITY;

-- Public Read Policies (Allow clients to search catalogue and read offers)
CREATE POLICY "Public Read Devices" ON public.devices FOR SELECT USING (status = 'active');
CREATE POLICY "Public Read Variants" ON public.device_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Specs" ON public.device_specs FOR SELECT USING (true);
CREATE POLICY "Public Read Retailer Offers" ON public.retailer_offers FOR SELECT USING (true);
CREATE POLICY "Public Read Valuation Offers" ON public.valuation_offers FOR SELECT USING (true);
CREATE POLICY "Public Insert Scan Sessions" ON public.scan_sessions FOR INSERT WITH CHECK (true);

-- Admin Mutation Policies
CREATE POLICY "Admin All Devices" ON public.devices FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin All Variants" ON public.device_variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin All Specs" ON public.device_specs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin All Retailer Offers" ON public.retailer_offers FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin All Valuation Offers" ON public.valuation_offers FOR ALL USING (auth.role() = 'service_role');
