-- Allow saving media records without a file blob (e.g. after user clicks "מחק מדיה"
-- inline to remove the file but keep the record metadata for re-upload).
ALTER TABLE public.aesthetic_media ALTER COLUMN file_url DROP NOT NULL;
ALTER TABLE public.dental_media ALTER COLUMN file_url DROP NOT NULL;
