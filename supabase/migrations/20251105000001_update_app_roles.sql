-- Update the app_role type to include new seller states
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'seller_pending';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'seller_approved';

-- Create a function to safely migrate existing seller roles
CREATE OR REPLACE FUNCTION migrate_seller_roles() 
RETURNS void AS $$
BEGIN
    -- Update existing sellers to approved status
    UPDATE user_roles 
    SET role = 'seller_approved'::app_role 
    WHERE role = 'seller'::app_role;
END;
$$ LANGUAGE plpgsql;

-- Run the migration function
SELECT migrate_seller_roles();

-- Drop the migration function as it's no longer needed
DROP FUNCTION migrate_seller_roles();

-- Update the apply_for_seller function to use the new roles
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
    AND role IN ('seller_pending'::app_role, 'seller_approved'::app_role)
  ) THEN
    RAISE EXCEPTION 'User already has a pending or approved seller application';
  END IF;

  -- Insert the pending seller role
  INSERT INTO user_roles (user_id, role)
  VALUES (auth.uid(), 'seller_pending'::app_role);

  -- Store the initial application details for later use
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
    AND role = 'admin'::app_role
  ) THEN
    RAISE EXCEPTION 'Only administrators can approve seller applications';
  END IF;

  -- Update the user's role to approved seller
  UPDATE user_roles 
  SET role = 'seller_approved'::app_role 
  WHERE user_id = target_user_id 
  AND role = 'seller_pending'::app_role;

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