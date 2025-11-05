-- Update get_user_role function to handle the new seller states
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid)
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id;
$$;

-- Function to check application status
CREATE OR REPLACE FUNCTION public.get_seller_application_status()
RETURNS TABLE (
    has_application boolean,
    application_id UUID,
    status seller_status,
    store_name text,
    created_at timestamptz,
    admin_notes text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        true as has_application,
        sa.id as application_id,
        sa.status,
        sa.store_name,
        sa.created_at,
        sa.admin_notes
    FROM seller_applications sa
    WHERE sa.user_id = auth.uid()
    ORDER BY sa.created_at DESC
    LIMIT 1;
    
    -- If no rows returned, return a row with has_application = false
    IF NOT FOUND THEN
        RETURN QUERY SELECT 
            false,
            NULL::UUID,
            NULL::seller_status,
            NULL::text,
            NULL::timestamptz,
            NULL::text;
    END IF;
END;
$$;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.get_user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_seller_application_status TO authenticated;