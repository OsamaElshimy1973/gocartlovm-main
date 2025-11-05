-- First, remove any existing seller roles since we're changing the role type
DELETE FROM public.user_roles WHERE role = 'seller';

-- Update the app_role enum to include seller states
ALTER TYPE public.app_role RENAME TO app_role_old;
CREATE TYPE public.app_role AS ENUM ('user', 'seller_pending', 'seller_approved', 'admin');

-- Migrate existing data to use the new enum
ALTER TABLE public.user_roles 
  ALTER COLUMN role TYPE public.app_role 
  USING (CASE 
    WHEN role::text = 'seller' THEN 'seller_approved'::public.app_role 
    ELSE role::text::public.app_role 
  END);

-- Drop the old enum
DROP TYPE public.app_role_old;

-- Update seller application functions
CREATE OR REPLACE FUNCTION public.apply_for_seller(
    store_name TEXT,
    store_description TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    application_id UUID;
BEGIN
    -- Check if user already has an active application
    IF EXISTS (
        SELECT 1 FROM seller_applications 
        WHERE user_id = auth.uid()
        AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'User already has a pending application';
    END IF;

    -- Add seller_pending role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (auth.uid(), 'seller_pending')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Create new application
    INSERT INTO seller_applications (user_id, store_name, store_description)
    VALUES (auth.uid(), store_name, store_description)
    RETURNING id INTO application_id;

    RETURN application_id;
END;
$$;

-- Update review function to handle role changes
CREATE OR REPLACE FUNCTION public.review_seller_application(
    application_id UUID,
    new_status seller_status,
    admin_notes TEXT DEFAULT NULL
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    app_user_id UUID;
BEGIN
    -- Check if caller is admin
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only admins can review applications';
    END IF;

    -- Update application
    UPDATE seller_applications
    SET status = new_status,
        admin_notes = COALESCE(admin_notes, admin_notes),
        reviewed_at = now(),
        reviewed_by = auth.uid(),
        updated_at = now()
    WHERE id = application_id
    RETURNING user_id INTO app_user_id;

    -- Handle role based on application status
    IF new_status = 'approved' THEN
        -- Remove pending role if exists
        DELETE FROM public.user_roles 
        WHERE user_id = app_user_id 
        AND role = 'seller_pending';
        
        -- Add approved role
        INSERT INTO public.user_roles (user_id, role)
        VALUES (app_user_id, 'seller_approved')
        ON CONFLICT (user_id, role) DO NOTHING;
    ELSIF new_status = 'rejected' THEN
        -- Remove any seller roles
        DELETE FROM public.user_roles 
        WHERE user_id = app_user_id 
        AND role IN ('seller_pending', 'seller_approved');
    END IF;

    RETURN FOUND;
END;
$$;

-- Update has_role function to handle seller states
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = _role
        OR 
        -- Allow seller_approved to pass seller role checks
        (_role = 'seller' AND role = 'seller_approved')
      )
  )
$$;