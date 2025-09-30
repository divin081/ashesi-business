-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Tables

-- Businesses Table
create table businesses (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  year text not null,
  founder text not null,
  education text not null,
  location text not null,
  founded text not null,
  stage text not null,
  team_size text not null,
  achievements text not null,
  description text not null,
  image text not null,
  social_media jsonb default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table businesses is 'Student businesses at Ashesi University';

-- Committee Members Table
create table committee_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  position text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table committee_members is 'Committee members managing student businesses';

-- Gallery Images Table
create table gallery_images (
  id uuid default uuid_generate_v4() primary key,
  url text not null,
  caption text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  Height int not null
);

comment on table gallery_images is 'Gallery images of student businesses';

-- Settings Table
create table settings (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  display_name text not null,
  email_notifications boolean default false,
  dark_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table settings is 'Admin settings for the application';

-- Posts Table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null,
  cover_image_url text,
  author text,
  published boolean default false,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table posts is 'Blog posts for the website';

-- Create Storage Buckets

-- Business Images Bucket
insert into storage.buckets (id, name, public) values ('business_images', 'business_images', true);

create policy "Business images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'business_images' );

create policy "Only authenticated users can upload business images"
  on storage.objects for insert
  with check ( bucket_id = 'business_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can update business images"
  on storage.objects for update
  using ( bucket_id = 'business_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can delete business images"
  on storage.objects for delete
  using ( bucket_id = 'business_images' and auth.role() = 'authenticated' );

-- Gallery Images Bucket
insert into storage.buckets (id, name, public) values ('gallery_images', 'gallery_images', true);

create policy "Gallery images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'gallery_images' );

create policy "Only authenticated users can upload gallery images"
  on storage.objects for insert
  with check ( bucket_id = 'gallery_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can update gallery images"
  on storage.objects for update
  using ( bucket_id = 'gallery_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can delete gallery images"
  on storage.objects for delete
  using ( bucket_id = 'gallery_images' and auth.role() = 'authenticated' );

-- Committee Member Images Bucket
insert into storage.buckets (id, name, public) values ('committee_images', 'committee_images', true);

create policy "Committee member images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'committee_images' );

create policy "Only authenticated users can upload committee member images"
  on storage.objects for insert
  with check ( bucket_id = 'committee_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can update committee member images"
  on storage.objects for update
  using ( bucket_id = 'committee_images' and auth.role() = 'authenticated' );

create policy "Only authenticated users can delete committee member images"
  on storage.objects for delete
  using ( bucket_id = 'committee_images' and auth.role() = 'authenticated' );

-- Enable Row Level Security (RLS) and Create Policies

-- Businesses RLS
alter table businesses enable row level security;

create policy "Businesses are viewable by everyone"
  on businesses for select
  using ( true );

create policy "Only authenticated users can insert businesses"
  on businesses for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update businesses"
  on businesses for update
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can delete businesses"
  on businesses for delete
  using ( auth.role() = 'authenticated' );

-- Committee Members RLS
alter table committee_members enable row level security;

create policy "Committee members are viewable by everyone"
  on committee_members for select
  using ( true );

create policy "Only authenticated users can insert committee members"
  on committee_members for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update committee members"
  on committee_members for update
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can delete committee members"
  on committee_members for delete
  using ( auth.role() = 'authenticated' );

-- Gallery Images RLS
alter table gallery_images enable row level security;

create policy "Gallery images are viewable by everyone"
  on gallery_images for select
  using ( true );

create policy "Only authenticated users can insert gallery images"
  on gallery_images for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update gallery images"
  on gallery_images for update
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can delete gallery images"
  on gallery_images for delete
  using ( auth.role() = 'authenticated' );

-- Settings RLS
alter table settings enable row level security;

create policy "Settings are viewable by authenticated users"
  on settings for select
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can insert settings"
  on settings for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update settings"
  on settings for update
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can delete settings"
  on settings for delete
  using ( auth.role() = 'authenticated' );

-- Posts RLS
alter table posts enable row level security;

create policy "Posts are viewable by everyone when published"
  on posts for select
  using ( published = true );

create policy "Only authenticated users can insert posts"
  on posts for insert
  with check ( auth.role() = 'authenticated' );

create policy "Only authenticated users can update posts"
  on posts for update
  using ( auth.role() = 'authenticated' );

create policy "Only authenticated users can delete posts"
  on posts for delete
  using ( auth.role() = 'authenticated' );

-- Create Helper Functions


