-- Add status field to user_roles table
ALTER TABLE public.user_roles 
ADD COLUMN status TEXT NOT NULL DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected'));