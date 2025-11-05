-- Create a table to store site-specific translatable strings
CREATE TABLE IF NOT EXISTS public.site_texts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,
  language_code text NOT NULL,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate entries for the same key+language
CREATE UNIQUE INDEX IF NOT EXISTS site_texts_key_lang_idx ON public.site_texts (key, language_code);

-- Enable RLS and allow public select
ALTER TABLE public.site_texts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to SELECT site texts (public content)
CREATE POLICY "Allow select site_texts" ON public.site_texts FOR SELECT USING (true);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_site_texts_updated_at ON public.site_texts;
CREATE TRIGGER trg_update_site_texts_updated_at
BEFORE UPDATE ON public.site_texts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Seed a few default texts (safe, can be removed)
INSERT INTO public.site_texts (key, language_code, value)
VALUES
  ('footer_brand', 'en', 'gocart.'),
  ('footer_description', 'en', 'Welcome to gocart, your ultimate destination for the latest and smartest gadgets. From smartphones and smartwatches to essential accessories, we bring you the best in innovation — all in one place.'),
  ('footer_contact_phone', 'en', '+1-212-456-7890'),
  ('footer_contact_email', 'en', 'contact@example.com'),
  ('footer_contact_address', 'en', '794 Francisco, 94102'),
  ('create_store', 'en', 'Create Your Store'),
  ('footer_brand', 'ar', 'gocart.'),
  ('footer_description', 'ar', 'مرحبًا بك في gocart، وجهتك المفضلة لأحدث وأذكى الأدوات. من الهواتف الذكية والساعات الذكية إلى الملحقات الأساسية، نقدم لك الأفضل في الابتكار — كل ذلك في مكان واحد.'),
  ('footer_contact_phone', 'ar', '+1-212-456-7890'),
  ('footer_contact_email', 'ar', 'contact@example.com'),
  ('footer_contact_address', 'ar', '794 Francisco, 94102'),
  ('create_store', 'ar', 'إنشاء متجرك')
ON CONFLICT (key, language_code) DO NOTHING;