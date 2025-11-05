-- Create enums for order status and payment status if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE public.order_status AS ENUM ('pending','confirmed','processing','shipped','delivered','cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE public.payment_status AS ENUM ('pending','paid','failed','refunded');
  END IF;
END$$;

-- Normalize existing order.status values to a valid enum value (fallback to 'pending')
UPDATE public.orders
SET status = 'pending'
WHERE status IS NULL OR status NOT IN ('pending','confirmed','processing','shipped','delivered','cancelled');

UPDATE public.orders
SET payment_status = 'pending'
WHERE payment_status IS NULL OR payment_status NOT IN ('pending','paid','failed','refunded');

-- Drop any existing defaults (avoid casting errors), then alter column types to enums using safe cast
ALTER TABLE public.orders
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN payment_status DROP DEFAULT;

ALTER TABLE public.orders
  ALTER COLUMN status TYPE public.order_status USING status::public.order_status,
  ALTER COLUMN payment_status TYPE public.payment_status USING payment_status::public.payment_status;

-- Set sensible defaults after type change
ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT 'pending',
  ALTER COLUMN payment_status SET DEFAULT 'pending';

-- Remove redundant profiles.email column if present (email is stored in auth.users)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.profiles DROP COLUMN email;
  END IF;
END$$;

-- Ensure foreign key constraints exist (create them only if missing)
-- products.store_id -> stores.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'products' AND kcu.column_name = 'store_id'
  ) THEN
    ALTER TABLE public.products
    ADD CONSTRAINT products_store_id_fkey FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE CASCADE;
  END IF;
END$$;

-- cart_items.product_id -> products.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'cart_items' AND kcu.column_name = 'product_id'
  ) THEN
    ALTER TABLE public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
  END IF;
END$$;

-- order_items.order_id -> orders.id and order_items.product_id -> products.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'order_items' AND kcu.column_name = 'order_id'
  ) THEN
    ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'order_items' AND kcu.column_name = 'product_id'
  ) THEN
    ALTER TABLE public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;
  END IF;
END$$;

-- orders.user_id -> auth.users(id) (exists in many schemas but ensure constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'orders' AND kcu.column_name = 'user_id'
  ) THEN
    ALTER TABLE public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END$$;

-- addresses.user_id -> auth.users(id)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'addresses' AND kcu.column_name = 'user_id'
  ) THEN
    ALTER TABLE public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END$$;

-- Add indexes to improve common lookups
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- Ensure language_code remains an ENUM 'language_code' (already created by earlier migration)
-- Add note: you can add more strict checks or reference tables if you want more language metadata

-- Migration complete
