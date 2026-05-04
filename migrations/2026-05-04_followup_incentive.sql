-- Add followup_incentive text column to both business_info tables.
-- Single global incentive per business, edited from the followup page.

ALTER TABLE public.aesthetic_business_info
  ADD COLUMN IF NOT EXISTS followup_incentive text;

ALTER TABLE public.dental_business_info
  ADD COLUMN IF NOT EXISTS followup_incentive text;

-- Allow anon writes on business_info so the dashboard (anon key) can save the incentive.
DROP POLICY IF EXISTS anon_insert ON public.aesthetic_business_info;
CREATE POLICY anon_insert ON public.aesthetic_business_info
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS anon_update ON public.aesthetic_business_info;
CREATE POLICY anon_update ON public.aesthetic_business_info
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS anon_insert ON public.dental_business_info;
CREATE POLICY anon_insert ON public.dental_business_info
  FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS anon_update ON public.dental_business_info;
CREATE POLICY anon_update ON public.dental_business_info
  FOR UPDATE TO anon USING (true) WITH CHECK (true);
