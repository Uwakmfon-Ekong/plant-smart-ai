-- PlantSmart AI — Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  farm_name text,
  location text,
  phone text,
  role text default 'farmer' check (role in ('farmer', 'expert', 'researcher', 'admin')),
  avatar_url text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CROPS ───────────────────────────────────────────────────────────────────
create table public.crops (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  variety text,
  field_name text not null,
  planted_date date,
  expected_harvest date,
  status text default 'healthy' check (status in ('healthy', 'monitor', 'alert')),
  health_score integer default 100 check (health_score between 0 and 100),
  notes text,
  created_at timestamptz default now()
);

alter table public.crops enable row level security;
create policy "Users manage own crops" on public.crops for all using (auth.uid() = user_id);

-- ─── SCANS ───────────────────────────────────────────────────────────────────
create table public.scans (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  crop_id uuid references public.crops(id) on delete set null,
  image_url text not null,
  diagnosis text,
  disease_name text,
  confidence numeric(5,2),
  treatment text,
  chemical_recommendation text,
  severity text check (severity in ('low', 'medium', 'high')),
  created_at timestamptz default now()
);

alter table public.scans enable row level security;
create policy "Users manage own scans" on public.scans for all using (auth.uid() = user_id);

-- ─── MARKETPLACE LISTINGS ────────────────────────────────────────────────────
create table public.marketplace_listings (
  id uuid default uuid_generate_v4() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category text not null check (category in ('seedling', 'input', 'produce')),
  price numeric(12,2) not null,
  currency text default 'NGN',
  quantity numeric(12,2) not null,
  unit text not null,
  location text,
  image_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.marketplace_listings enable row level security;
create policy "Anyone can view active listings" on public.marketplace_listings for select using (is_active = true);
create policy "Sellers manage own listings" on public.marketplace_listings for all using (auth.uid() = seller_id);

-- ─── EXPERTS ─────────────────────────────────────────────────────────────────
create table public.experts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  specialty text not null,
  bio text,
  hourly_rate numeric(10,2) default 5000,
  rating numeric(3,2) default 5.0,
  sessions_count integer default 0,
  is_available boolean default true,
  created_at timestamptz default now()
);

alter table public.experts enable row level security;
create policy "Anyone can view experts" on public.experts for select using (true);
create policy "Experts manage own profile" on public.experts for all using (auth.uid() = user_id);

-- ─── COMMUNITY POSTS ─────────────────────────────────────────────────────────
create table public.community_posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  tags text[] default '{}',
  likes_count integer default 0,
  replies_count integer default 0,
  created_at timestamptz default now()
);

alter table public.community_posts enable row level security;
create policy "Anyone can read posts" on public.community_posts for select using (true);
create policy "Auth users can create posts" on public.community_posts for insert with check (auth.uid() = author_id);
create policy "Authors can update own posts" on public.community_posts for update using (auth.uid() = author_id);

-- ─── STORAGE BUCKETS ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public) values ('plant-scans', 'plant-scans', false);
insert into storage.buckets (id, name, public) values ('marketplace-images', 'marketplace-images', true);
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Storage policies
create policy "Auth users upload scans" on storage.objects for insert
  with check (bucket_id = 'plant-scans' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users access own scans" on storage.objects for select
  using (bucket_id = 'plant-scans' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Public marketplace images" on storage.objects for select
  using (bucket_id = 'marketplace-images');

create policy "Sellers upload marketplace images" on storage.objects for insert
  with check (bucket_id = 'marketplace-images' and auth.uid() is not null);
