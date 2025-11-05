-- Create a view to easily see seller roles and their status
CREATE OR REPLACE VIEW public.seller_roles_view AS
SELECT 
    u.email,
    ur.user_id,
    ur.role,
    ur.status,
    sa.store_name,
    sa.store_description,
    sa.created_at as application_date,
    sa.admin_notes
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.seller_applications sa ON u.id = sa.user_id
WHERE ur.role = 'seller'
AND sa.id = (
    -- Get only the latest application for each user
    SELECT id FROM public.seller_applications sa2
    WHERE sa2.user_id = u.id
    ORDER BY created_at DESC
    LIMIT 1
);

-- Add RLS policy for the view
ALTER VIEW public.seller_roles_view ENABLE ROW LEVEL SECURITY;

-- Only admins can view all seller roles
CREATE POLICY "Admins can view all seller roles"
    ON public.seller_roles_view
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));

-- Users can view their own seller role
CREATE POLICY "Users can view their own seller role"
    ON public.seller_roles_view
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Helper function to check pending seller applications
CREATE OR REPLACE FUNCTION public.get_pending_seller_applications()
RETURNS TABLE (
    email TEXT,
    user_id UUID,
    store_name TEXT,
    store_description TEXT,
    application_date TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Only admins can view pending applications';
    END IF;

    RETURN QUERY
    SELECT 
        u.email,
        ur.user_id,
        sa.store_name,
        sa.store_description,
        sa.created_at as application_date
    FROM auth.users u
    JOIN public.user_roles ur ON u.id = ur.user_id
    JOIN public.seller_applications sa ON u.id = sa.user_id
    WHERE ur.role = 'seller'
    AND ur.status = 'pending'
    AND sa.status = 'pending'
    ORDER BY sa.created_at DESC;
END;
$$;