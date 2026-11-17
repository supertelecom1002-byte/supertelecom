-- =========================================================================
-- SUPER TELECOM SECURITY & RLS HARDENING MIGRATION
-- Prevents public scraping of customer names and phone numbers
-- =========================================================================

-- 1. Ensure RLS is active on repair_jobs
ALTER TABLE IF EXISTS public.repair_jobs ENABLE ROW LEVEL SECURITY;

-- 2. Drop over-permissive public read policy if exists
DROP POLICY IF EXISTS "Public Read repair_jobs" ON public.repair_jobs;
DROP POLICY IF EXISTS "Public/Auth Upsert repair_jobs" ON public.repair_jobs;

-- 3. Secure RPC: Only returns a specific job when both Job ID and last 4 digits of phone match
CREATE OR REPLACE FUNCTION public.get_repair_status_secure(
  p_job_id TEXT,
  p_phone_last4 TEXT
)
RETURNS TABLE (
  id TEXT,
  customer_name TEXT,
  customer_phone TEXT,
  device_model TEXT,
  issue_description TEXT,
  estimated_cost NUMERIC,
  current_stage TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    rj.id,
    rj.customer_name,
    rj.customer_phone,
    rj.device_model,
    rj.issue_description,
    rj.estimated_cost,
    rj.current_stage,
    rj.notes,
    rj.created_at,
    rj.updated_at
  FROM public.repair_jobs rj
  WHERE UPPER(TRIM(rj.id)) = UPPER(TRIM(p_job_id))
    AND RIGHT(REGEXP_REPLACE(rj.customer_phone, '\D', '', 'g'), 4) = TRIM(p_phone_last4)
  LIMIT 1;
END;
$$;

-- Grant execution permission on RPC to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION public.get_repair_status_secure(TEXT, TEXT) TO anon, authenticated;

-- 4. Admin Access Policy (Only authenticated admin staff can view/edit all records)
CREATE POLICY "Admins full access to repair_jobs"
ON public.repair_jobs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.email = auth.jwt() ->> 'email'
      AND au.is_active = true
  )
);
