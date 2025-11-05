-- Create user roles enum
create type public.app_role as enum ('user', 'seller', 'admin');

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Create user_roles table for role management
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone not null default now(),
  unique (user_id, role)
);

-- Enable RLS on user_roles
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Create security definer function to get user roles
create or replace function public.get_user_roles(_user_id uuid)
returns setof app_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_roles
  where user_id = _user_id
$$;

-- Profiles policies
create policy "Users can view all profiles"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- User roles policies
create policy "Users can view their own roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Admins can manage all roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'));

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'user' role
  insert into public.user_roles (user_id, role)
  values (new.id, 'user');
  
  return new;
end;
$$;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update stores table to link with user
alter table public.stores add column if not exists user_id uuid references auth.users(id);

-- Add RLS policies for stores based on roles
create policy "Sellers can insert their own stores"
  on public.stores for insert
  with check (
    public.has_role(auth.uid(), 'seller') and auth.uid() = user_id
  );

create policy "Sellers can update their own stores"
  on public.stores for update
  using (auth.uid() = user_id);

create policy "Sellers can delete their own stores"
  on public.stores for delete
  using (auth.uid() = user_id);

-- Update products policies for sellers
create policy "Sellers can insert products for their stores"
  on public.products for insert
  with check (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.user_id = auth.uid()
        and public.has_role(auth.uid(), 'seller')
    )
  );

create policy "Sellers can update their store products"
  on public.products for update
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.user_id = auth.uid()
    )
  );

create policy "Sellers can delete their store products"
  on public.products for delete
  using (
    exists (
      select 1 from public.stores
      where stores.id = products.store_id
        and stores.user_id = auth.uid()
    )
  );