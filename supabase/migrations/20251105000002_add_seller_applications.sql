-- Create seller application status enum
CREATE TYPE public.seller_status AS ENUM ('pending', 'approved', 'rejected');

-- Create seller applications table
CREATE TABLE public.seller_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    store_name TEXT NOT NULL,
    store_description TEXT,
    status seller_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id, status)  -- One active application per user
);

-- Add RLS to seller_applications
ALTER TABLE public.seller_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view their own applications"
    ON public.seller_applications
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can create applications if they don't have an approved one
CREATE POLICY "Users can create applications"
    ON public.seller_applications
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id 
        AND NOT EXISTS (
            SELECT 1 FROM public.seller_applications 
            WHERE user_id = auth.uid() 
            AND status = 'approved'
        )
    );

-- Only admins can update applications
CREATE POLICY "Admins can manage applications"
    ON public.seller_applications
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));

-- Function to apply for seller status
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

    -- Create new application
    INSERT INTO seller_applications (user_id, store_name, store_description)
    VALUES (auth.uid(), store_name, store_description)
    RETURNING id INTO application_id;

    RETURN application_id;
END;
$$;

-- Function for admins to review seller applications
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

    -- If approved, grant seller role
    IF new_status = 'approved' THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (app_user_id, 'seller')
        ON CONFLICT (user_id, role) DO NOTHING;
    END IF;

    RETURN FOUND;
END;
$$;

-- Update trigger for seller role removal
CREATE OR REPLACE FUNCTION public.handle_seller_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- If application is rejected, remove seller role if exists
    IF NEW.status = 'rejected' AND OLD.status = 'approved' THEN
        DELETE FROM user_roles
        WHERE user_id = NEW.user_id AND role = 'seller';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger for seller role management
CREATE TRIGGER on_seller_status_change
    AFTER UPDATE ON seller_applications
    FOR EACH ROW
    EXECUTE FUNCTION handle_seller_status_change();

-- Function to get application status
CREATE OR REPLACE FUNCTION public.get_seller_application_status(user_id UUID DEFAULT auth.uid())
RETURNS TABLE (
    has_application BOOLEAN,
    status seller_status,
    store_name TEXT,
    created_at TIMESTAMPTZ,
    admin_notes TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        TRUE,
        sa.status,
        sa.store_name,
        sa.created_at,
        sa.admin_notes
    FROM seller_applications sa
    WHERE sa.user_id = $1
    ORDER BY sa.created_at DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            FALSE,
            NULL::seller_status,
            NULL::TEXT,
            NULL::TIMESTAMPTZ,
            NULL::TEXT;
    END IF;
END;
$$;