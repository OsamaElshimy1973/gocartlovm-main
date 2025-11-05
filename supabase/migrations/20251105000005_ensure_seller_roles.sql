-- Create role status type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.role_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add status column to user_roles if it doesn't exist
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS status role_status NOT NULL DEFAULT 'approved';

-- Function to insert seller role when application is approved
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

    -- Handle seller role based on application status
    IF new_status = 'approved' THEN
        -- Insert seller role if it doesn't exist, or update if it does
        INSERT INTO public.user_roles (user_id, role, status)
        VALUES (app_user_id, 'seller'::app_role, 'approved'::role_status)
        ON CONFLICT (user_id, role) 
        DO UPDATE SET status = 'approved'::role_status;
    ELSIF new_status = 'rejected' THEN
        -- Update role status to rejected if it exists
        UPDATE public.user_roles
        SET status = 'rejected'::role_status
        WHERE user_id = app_user_id AND role = 'seller'::app_role;
    END IF;

    RETURN FOUND;
END;
$$;

-- Function to handle seller application submission
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

    -- Create seller role with pending status
    INSERT INTO public.user_roles (user_id, role, status)
    VALUES (auth.uid(), 'seller'::app_role, 'pending'::role_status)
    ON CONFLICT (user_id, role) 
    DO UPDATE SET status = 'pending'::role_status;

    -- Create new application
    INSERT INTO seller_applications (user_id, store_name, store_description)
    VALUES (auth.uid(), store_name, store_description)
    RETURNING id INTO application_id;

    RETURN application_id;
END;
$$;