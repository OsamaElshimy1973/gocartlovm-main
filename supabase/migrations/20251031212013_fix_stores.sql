-- Make user_id NOT NULL
-- Make user_id NOT NULL only if there are no NULL values
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.stores WHERE user_id IS NULL) THEN
    ALTER TABLE public.stores ALTER COLUMN user_id SET NOT NULL;
  END IF;
END$$;

-- Add missing columns for store details
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS contact_number text,
ADD COLUMN IF NOT EXISTS address text;

-- Additional RLS policy for sellers to view their own stores
DROP POLICY IF EXISTS "Sellers can view their own stores" ON public.stores;
CREATE POLICY "Sellers can view their own stores"
ON public.stores
FOR SELECT
USING (
  auth.uid() = user_id 
  OR 
  public.has_role(auth.uid(), 'admin')
);