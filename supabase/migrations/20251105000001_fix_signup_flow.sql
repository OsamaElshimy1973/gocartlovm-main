-- First, ensure profile fields are nullable
ALTER TABLE public.profiles 
  ALTER COLUMN full_name DROP NOT NULL;

-- Update the handle_new_user trigger to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Create profile with proper error handling
  BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
      NEW.id,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)  -- Fallback to username part of email
      )
    );
  EXCEPTION WHEN unique_violation THEN
    -- Profile might already exist, try updating instead
    UPDATE public.profiles 
    SET 
      full_name = COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)  -- Fallback to username part of email
      ),
      updated_at = now()
    WHERE id = NEW.id;
  END;

  -- Assign default user role with conflict handling
  BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error assigning user role: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;