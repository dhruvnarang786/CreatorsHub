-- ═══════════════════════════════════════════════════════
-- CreatorsBNB — Full Database Schema
-- Run this entire file in Supabase SQL Editor (Dashboard → SQL Editor)
-- ═══════════════════════════════════════════════════════

-- ─── TABLE: profiles ───
-- Stores all user data (creators + studio owners)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('creator', 'studio_owner')),
  avatar_url text,
  bio text,
  location text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'creator')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop existing trigger if re-running
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ─── TABLE: studios ───
-- Stores all studio listings
create table if not exists studios (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,

  -- Listing Identity
  name text not null,
  type text not null,
  description text,
  vibe text,
  ideal_use_cases text,

  -- Location
  address text not null,
  area text not null,
  city text not null,
  google_map_pin text,

  -- Pricing
  price_per_hour numeric not null,
  currency text default 'INR',

  -- Features
  features text[],
  space_details text,

  -- Media
  photos text[],
  video_url text,

  -- Availability
  is_available boolean default true,
  available_days text[],
  available_from time,
  available_to time,

  -- Status
  is_approved boolean default false,
  is_active boolean default true,

  -- Legal
  government_id_verified boolean default false,
  agreed_to_terms boolean default false not null,
  booking_via_platform_only boolean default true,

  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);


-- ─── TABLE: bookings ───
-- Stores all booking requests
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  studio_id uuid references studios(id) on delete cascade not null,
  creator_id uuid references profiles(id) on delete cascade not null,
  owner_id uuid references profiles(id) not null,

  booking_date date not null,
  start_time time not null,
  end_time time not null,
  total_hours numeric not null,
  total_price numeric not null,

  status text default 'pending' check (
    status in ('pending', 'confirmed', 'cancelled', 'completed')
  ),

  message text,
  payment_status text default 'unpaid' check (
    payment_status in ('unpaid', 'paid', 'refunded')
  ),

  stripe_payment_intent_id text,

  created_at timestamp with time zone default timezone('utc', now())
);


-- ─── TABLE: equipment ───
-- For future equipment rental
create table if not exists equipment (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  category text not null,
  description text,
  price_per_day numeric not null,
  is_available boolean default true,
  photos text[],
  created_at timestamp with time zone default timezone('utc', now())
);


-- ─── TABLE: professionals ───
-- Videographers, editors, photographers
create table if not exists professionals (
  id uuid default gen_random_uuid() primary key,
  profile_id uuid references profiles(id) on delete cascade not null,
  type text not null check (type in ('videographer', 'editor', 'photographer')),
  speciality text,
  experience_years integer,
  price_per_hour numeric,
  portfolio_url text,
  skills text[],
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc', now())
);


-- ═══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table studios enable row level security;
alter table bookings enable row level security;
alter table equipment enable row level security;
alter table professionals enable row level security;

-- ─── Profiles RLS ───
create policy "Public profiles are viewable by everyone"
  on profiles for select using (true);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- ─── Studios RLS ───
create policy "Anyone can view approved studios"
  on studios for select using (is_approved = true);

create policy "Owners can insert their studios"
  on studios for insert with check (auth.uid() = owner_id);

create policy "Owners can update their studios"
  on studios for update using (auth.uid() = owner_id);

create policy "Owners can delete their studios"
  on studios for delete using (auth.uid() = owner_id);

-- ─── Bookings RLS ───
create policy "Creators see own bookings"
  on bookings for select using (auth.uid() = creator_id);

create policy "Studio owners see their bookings"
  on bookings for select using (auth.uid() = owner_id);

create policy "Creators can create bookings"
  on bookings for insert with check (auth.uid() = creator_id);

create policy "Owners can update booking status"
  on bookings for update using (auth.uid() = owner_id);

-- ─── Equipment RLS ───
create policy "Anyone can view available equipment"
  on equipment for select using (is_available = true);

create policy "Owners can manage their equipment"
  on equipment for insert with check (auth.uid() = owner_id);

create policy "Owners can update their equipment"
  on equipment for update using (auth.uid() = owner_id);

create policy "Owners can delete their equipment"
  on equipment for delete using (auth.uid() = owner_id);

-- ─── Professionals RLS ───
create policy "Anyone can view available professionals"
  on professionals for select using (is_available = true);

create policy "Professionals can manage their own listing"
  on professionals for insert with check (auth.uid() = profile_id);

create policy "Professionals can update their listing"
  on professionals for update using (auth.uid() = profile_id);

create policy "Professionals can delete their listing"
  on professionals for delete using (auth.uid() = profile_id);
