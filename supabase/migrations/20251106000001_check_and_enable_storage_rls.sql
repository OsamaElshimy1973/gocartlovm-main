-- Check if RLS is enabled
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid = 'storage.objects'::regclass;

-- Enable RLS if not already enabled
alter table storage.objects enable row level security;

-- Verify RLS is enabled
select relname as table_name, relrowsecurity as rls_enabled
from pg_class
where oid = 'storage.objects'::regclass;