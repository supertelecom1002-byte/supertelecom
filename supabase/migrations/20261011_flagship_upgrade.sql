-- ========================================================
-- SUPER TELECOM FLAGSHIP UPGRADE SCHEMA MIGRATION
-- Run this in Supabase SQL Editor if Supabase is connected.
-- ========================================================

-- 1. App Configuration & Live Feature Flags
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT 'true'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Default Feature Flags & Lab Config
INSERT INTO public.app_config (key, value) VALUES
  ('tool_speaker_cleaner', 'true'::jsonb),
  ('tool_touch_test', 'true'::jsonb),
  ('tool_anti_theft', 'true'::jsonb),
  ('tool_battery_guard', 'true'::jsonb),
  ('tool_secret_codes', 'true'::jsonb),
  ('tool_lockscreen_gen', 'true'::jsonb),
  ('tool_used_phone_audit', 'true'::jsonb),
  ('shop_accessories_enabled', 'true'::jsonb),
  ('lab_status_override', '"auto"'::jsonb),
  ('announcement_banner', '{"enabled": false, "text": "🔥 Giridih Flagship Lab: Free On-The-Spot Hardware Diagnosis & Express Display Fixes"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Repair Jobs Live Pipeline
CREATE TABLE IF NOT EXISTS public.repair_jobs (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_model TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  estimated_cost NUMERIC NOT NULL DEFAULT 0,
  current_stage TEXT NOT NULL DEFAULT 'received' CHECK (current_stage IN ('received', 'diagnosing', 'qc_testing', 'ready', 'delivered')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Sample Live Jobs
INSERT INTO public.repair_jobs (id, customer_name, customer_phone, device_model, issue_description, estimated_cost, current_stage, notes) VALUES
  ('ST-1082', 'Amit Sharma', '9876543210', 'iPhone 13 (Midnight 128GB)', 'Cracked OLED display & touch dead zone in lower third', 4499, 'qc_testing', 'Original high-retina panel installed. TrueTone data transferred successfully.'),
  ('ST-1083', 'Pooja Verma', '9123456780', 'Samsung Galaxy S22 Ultra', 'Dead motherboard after minor liquid splash; charging port corroded', 2999, 'diagnosing', 'Ultrasonic chemical clean complete. Secondary power management IC short found.'),
  ('ST-1084', 'Rahul Kumar', '9988776655', 'OnePlus 9 Pro', 'Green vertical display line after system update', 1999, 'ready', 'Laser flex restoration completed. Display output 100% clean without replacement.')
ON CONFLICT (id) DO NOTHING;

-- 3. Service Pricing Matrix
CREATE TABLE IF NOT EXISTS public.service_pricing (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  repair_type TEXT NOT NULL,
  price_min NUMERIC NOT NULL,
  price_max NUMERIC NOT NULL,
  turnaround_time TEXT NOT NULL DEFAULT '45 Mins',
  warranty_days INTEGER NOT NULL DEFAULT 90
);

-- Seed Initial Pricing Matrix
INSERT INTO public.service_pricing (id, brand, model, repair_type, price_min, price_max, turnaround_time, warranty_days) VALUES
  ('sp-1', 'Apple', 'iPhone 13 / 14 / 15 Series', 'Full Combo OLED & Retina Screen', 3499, 8999, '45 Mins', 90),
  ('sp-2', 'Apple', 'iPhone 11 / 12 / 13 / 14', 'Outer Glass Only Refurbish (OCA)', 1799, 3499, '60 Mins', 60),
  ('sp-3', 'Apple', 'iPhone All Series', 'Original Battery & Health Calibration', 1299, 2999, '30 Mins', 90),
  ('sp-4', 'Samsung', 'Galaxy S21 / S22 / S23 / Ultra', 'Curved AMOLED Display & Touch', 3999, 9499, '45 Mins', 90),
  ('sp-5', 'OnePlus', 'OnePlus 9 / 10 / 11 / 12 Series', 'AMOLED Green/Pink Line Laser Fix', 1499, 3200, '2 Hours', 60)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_pricing ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read app_config" ON public.app_config FOR SELECT USING (true);
CREATE POLICY "Public Read repair_jobs" ON public.repair_jobs FOR SELECT USING (true);
CREATE POLICY "Public Read service_pricing" ON public.service_pricing FOR SELECT USING (true);

-- Authenticated or Anon Write Policies (Allows fallback writes and Admin updates)
CREATE POLICY "Public/Auth Upsert app_config" ON public.app_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public/Auth Upsert repair_jobs" ON public.repair_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public/Auth Upsert service_pricing" ON public.service_pricing FOR ALL USING (true) WITH CHECK (true);
