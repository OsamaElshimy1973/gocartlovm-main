-- First backup functions and policies that depend on the old type
DROP FUNCTION IF EXISTS backup_role_dependencies();
CREATE FUNCTION backup_role_dependencies() 
RETURNS void AS $$
BEGIN
    -- Drop functions that depend on app_role
    DROP FUNCTION IF EXISTS has_role(uuid, app_role);
    DROP FUNCTION IF EXISTS get_user_roles(uuid);
    
    -- Drop policies that depend on app_role
    DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
    DROP POLICY IF EXISTS "Sellers can insert their own stores" ON stores;
    DROP POLICY IF EXISTS "Sellers can view their own stores" ON stores;
    DROP POLICY IF EXISTS "Sellers can insert products for their stores" ON products;
END;
$$ LANGUAGE plpgsql;

-- Run the backup
SELECT backup_role_dependencies();
DROP FUNCTION backup_role_dependencies();

-- Now we can safely rename the type
ALTER TYPE public.app_role RENAME TO app_role_old;

-- Create the new app_role type with all required values
CREATE TYPE public.app_role AS ENUM ('user', 'seller_pending', 'seller_approved', 'admin');

-- Create a function to safely migrate existing roles
CREATE OR REPLACE FUNCTION migrate_roles() 
RETURNS void AS $$
BEGIN
    -- First, backup the existing roles
    CREATE TEMP TABLE role_backup AS 
    SELECT user_id, role::text as role_text 
    FROM user_roles;

    -- Update the user_roles table to use the new type
    ALTER TABLE user_roles 
    ALTER COLUMN role TYPE public.app_role 
    USING CASE role::text
        WHEN 'seller' THEN 'seller_approved'::app_role
        ELSE role::text::app_role
    END;

    -- Drop the old type as it's no longer needed
    DROP TYPE public.app_role_old;
END;
$$ LANGUAGE plpgsql;

-- Run the migration
SELECT migrate_roles();

-- Drop the migration function
DROP FUNCTION migrate_roles();

-- Recreate the apply_for_seller function with the new role type
CREATE OR REPLACE FUNCTION apply_for_seller(
    store_name text,
    store_description text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user already has a seller role
    IF EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('seller_pending', 'seller_approved')
    ) THEN
        RAISE EXCEPTION 'User already has a pending or approved seller application';
    END IF;

    -- Insert the pending seller role
    INSERT INTO user_roles (user_id, role)
    VALUES (auth.uid(), 'seller_pending');

    -- Store the initial application details
    INSERT INTO seller_applications (
        user_id,
        store_name,
        store_description,
        status,
        created_at
    ) VALUES (
        auth.uid(),
        store_name,
        store_description,
        'pending',
        now()
    );
END;
$$;

-- Function to approve a seller application
CREATE OR REPLACE FUNCTION approve_seller_application(
    target_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the executing user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can approve seller applications';
    END IF;

    -- Update the user's role to approved seller
    UPDATE user_roles 
    SET role = 'seller_approved'
    WHERE user_id = target_user_id 
    AND role = 'seller_pending';

    -- Update the application status
    UPDATE seller_applications
    SET 
        status = 'approved',
        approved_at = now(),
        approved_by = auth.uid()
    WHERE user_id = target_user_id
    AND status = 'pending';

    -- If no rows were updated, the application wasn't found or wasn't pending
    IF NOT FOUND THEN
        RAISE EXCEPTION 'No pending seller application found for this user';
    END IF;
END;
$$;

-- Grant appropriate permissions
GRANT EXECUTE ON FUNCTION apply_for_seller TO authenticated;
GRANT EXECUTE ON FUNCTION approve_seller_application TO authenticated;