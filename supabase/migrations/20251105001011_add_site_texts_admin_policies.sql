-- Add admin-only RLS policies for site_texts (idempotent)
-- Cast the role literal to app_role to match has_role(uuid, app_role) signature

-- Drop existing policies if they exist (safe to re-run)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'site_texts' AND p.polname = 'allow_admin_modify_site_texts_insert'
  ) THEN
    DROP POLICY IF EXISTS "allow_admin_modify_site_texts_insert" ON public.site_texts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'site_texts' AND p.polname = 'allow_admin_modify_site_texts_update'
  ) THEN
    DROP POLICY IF EXISTS "allow_admin_modify_site_texts_update" ON public.site_texts;
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policy p
    JOIN pg_class c ON p.polrelid = c.oid
    WHERE c.relname = 'site_texts' AND p.polname = 'allow_admin_modify_site_texts_delete'
  ) THEN
    DROP POLICY IF EXISTS "allow_admin_modify_site_texts_delete" ON public.site_texts;
  END IF;
END$$;

-- Create policies using explicit app_role cast
CREATE POLICY "allow_admin_modify_site_texts_insert"
  ON public.site_texts
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "allow_admin_modify_site_texts_update"
  ON public.site_texts
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "allow_admin_modify_site_texts_delete"
  ON public.site_texts
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Verify (optional): list policies for site_texts
-- SELECT p.polname, p.polcmd, c.relname FROM pg_policy p JOIN pg_class c ON p.polrelid = c.oid WHERE c.relname = 'site_texts';
