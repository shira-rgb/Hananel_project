-- Add followup_incentive text column to both business_info tables.
-- Single global incentive per business, edited from the followup page.

ALTER TABLE aesthetic_business_info
  ADD COLUMN IF NOT EXISTS followup_incentive text;

ALTER TABLE dental_business_info
  ADD COLUMN IF NOT EXISTS followup_incentive text;
