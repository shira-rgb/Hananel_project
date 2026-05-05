-- Fix: add INSERT/UPDATE/DELETE RLS policies for anon role on all dashboard tables.
-- Root cause: RLS was enabled but only SELECT policies existed, blocking all writes.

-- aesthetic_products
CREATE POLICY "anon_insert" ON aesthetic_products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_products FOR DELETE TO anon USING (true);

-- dental_products
CREATE POLICY "anon_insert" ON dental_products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_products FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_products FOR DELETE TO anon USING (true);

-- aesthetic_media
CREATE POLICY "anon_insert" ON aesthetic_media FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_media FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_media FOR DELETE TO anon USING (true);

-- dental_media
CREATE POLICY "anon_insert" ON dental_media FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_media FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_media FOR DELETE TO anon USING (true);

-- aesthetic_followup_messages
CREATE POLICY "anon_insert" ON aesthetic_followup_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_followup_messages FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_followup_messages FOR DELETE TO anon USING (true);

-- dental_followup_messages
CREATE POLICY "anon_insert" ON dental_followup_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_followup_messages FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_followup_messages FOR DELETE TO anon USING (true);

-- aesthetic_faq
CREATE POLICY "anon_insert" ON aesthetic_faq FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_faq FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_faq FOR DELETE TO anon USING (true);

-- dental_faq
CREATE POLICY "anon_insert" ON dental_faq FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_faq FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_faq FOR DELETE TO anon USING (true);

-- aesthetic_inquiries
CREATE POLICY "anon_insert" ON aesthetic_inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_inquiries FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_inquiries FOR DELETE TO anon USING (true);

-- dental_inquiries
CREATE POLICY "anon_insert" ON dental_inquiries FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_inquiries FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_inquiries FOR DELETE TO anon USING (true);

-- aesthetic_clients
CREATE POLICY "anon_insert" ON aesthetic_clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_clients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_clients FOR DELETE TO anon USING (true);

-- dental_clients
CREATE POLICY "anon_insert" ON dental_clients FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_clients FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_clients FOR DELETE TO anon USING (true);

-- dental_doctor_profile
CREATE POLICY "anon_insert" ON dental_doctor_profile FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_doctor_profile FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_doctor_profile FOR DELETE TO anon USING (true);

-- doctors
CREATE POLICY "anon_insert" ON doctors FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON doctors FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON doctors FOR DELETE TO anon USING (true);

-- aesthetic_leads
CREATE POLICY "anon_insert" ON aesthetic_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON aesthetic_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON aesthetic_leads FOR DELETE TO anon USING (true);

-- dental_leads
CREATE POLICY "anon_insert" ON dental_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update" ON dental_leads FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete" ON dental_leads FOR DELETE TO anon USING (true);

-- aesthetic_business_info (missing DELETE only)
CREATE POLICY "anon_delete" ON aesthetic_business_info FOR DELETE TO anon USING (true);

-- dental_business_info (missing DELETE only)
CREATE POLICY "anon_delete" ON dental_business_info FOR DELETE TO anon USING (true);
