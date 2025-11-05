-- Drop existing trigger first
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- Recreate function with better error handling
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Create profile with more robust error handling
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    )
  );
  
  -- Assign default 'user' role with duplicate handling
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;
  
  return new;
exception
  when others then
    -- Log error details to a logging table if you have one
    raise notice 'Error in handle_new_user: %', SQLERRM;
    return new; -- Still return new to allow user creation even if profile/role creation fails
end;
$$;

-- Recreate trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Ensure profiles table accepts null values for optional fields
alter table public.profiles alter column full_name drop not null;
alter table public.profiles alter column email drop not null;