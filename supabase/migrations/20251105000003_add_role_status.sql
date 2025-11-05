-- Add status field to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update insert trigger to handle status
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_roles (user_id, role, status)
    VALUES (NEW.id, 'user', 'approved');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update seller application process to use user_roles status
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

    -- Insert seller role with pending status if not exists
    INSERT INTO user_roles (user_id, role, status)
    VALUES (auth.uid(), 'seller', 'pending')
    ON CONFLICT (user_id, role) 
    DO UPDATE SET status = 'pending'
    WHERE user_roles.user_id = EXCLUDED.user_id 
    AND user_roles.role = EXCLUDED.role;

    -- Create new application
    INSERT INTO seller_applications (user_id, store_name, store_description)
    VALUES (auth.uid(), store_name, store_description)
    RETURNING id INTO application_id;

    RETURN application_id;
END;
$$;

-- Update review process to handle role status
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

    -- Update role status
    UPDATE user_roles
    SET status = new_status::text
    WHERE user_id = app_user_id 
    AND role = 'seller';

    RETURN FOUND;
END;
$$;

-- Function to check seller status considering both role and application
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
    WITH latest_application AS (
        SELECT 
            sa.status,
            sa.store_name,
            sa.created_at,
            sa.admin_notes
        FROM seller_applications sa
        WHERE sa.user_id = $1
        ORDER BY sa.created_at DESC
        LIMIT 1
    )
    SELECT 
        CASE WHEN la.status IS NOT NULL THEN TRUE ELSE FALSE END,
        COALESCE(la.status, 
            (SELECT status::seller_status 
             FROM user_roles 
             WHERE user_id = $1 AND role = 'seller'
             LIMIT 1)
        ),
        la.store_name,
        la.created_at,
        la.admin_notes
    FROM latest_application la;
END;
$$;

-- Update RLS policies to reflect new status field
CREATE POLICY "Users can read their own roles and status"
    ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow admins to update role status
CREATE POLICY "Admins can manage role status"
    ON public.user_roles
    FOR ALL
    USING (public.has_role(auth.uid(), 'admin'));