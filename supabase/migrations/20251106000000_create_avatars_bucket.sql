-- Create a public storage bucket named "avatars" for user profile images.
-- This is idempotent and safe to run multiple times.
--
-- Notes:
-- - The Supabase Storage API exposes a helper SQL function `storage.create_bucket(name text, public boolean)`
--   inside the `storage` schema in managed Supabase instances.
-- - If your project does not have the `storage` schema or the function, run this in the
--   Supabase SQL editor and inspect the error; most projects created by Supabase already
--   have storage enabled.

DO $$
BEGIN
  -- Only create if the bucket does not already exist
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'avatars') THEN
    PERFORM storage.create_bucket('avatars', true);
  END IF;
END$$;

-- Verify by querying:
-- SELECT name, public FROM storage.buckets WHERE name = 'avatars';
