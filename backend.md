Auth using supabase auth
Adding an removing a business
Images are to be taken from a public google drive link i.e. images for gallery page

# Supabase Backend Documentation

This document outlines the database structure and setup for the Ashesi Business Directory application.

## Tables

### Businesses

```sql
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
```

### Committee Members

```sql
create table committee_members (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  position text not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table committee_members is 'Committee members managing student businesses';
```

### Gallery Images

```sql
create table gallery_images (
  id uuid default uuid_generate_v4() primary key,
  url text not null,
  caption text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table gallery_images is 'Gallery images of student businesses';
```

### Settings

```sql
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
```

## Storage Buckets

### Business Images

```sql
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
```

### Gallery Images

```sql
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
```

### Committee Member Images

```sql
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
```

## Row Level Security (RLS) Policies

### Businesses

```sql
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
```

### Committee Members

```sql
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
```

### Gallery Images

```sql
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
```

### Settings

```sql
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
```

## Helper Functions

### Filter Businesses by Year

```sql
create or replace function filter_businesses_by_year(year_filter text)
returns setof businesses
language sql
as $$
  select *
  from businesses
  where year = year_filter
  order by created_at desc;
$$;
```

### Filter Committee Members by Year

```sql
create or replace function filter_committee_members_by_year(year_filter text)
returns setof committee_members
language sql
as $$
  select *
  from committee_members
  where extract(year from created_at)::text = year_filter
  order by created_at desc;
$$;
```

## Environment Variables

The following environment variables need to be set in your `.env` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Authentication

The application uses Supabase Auth for authentication. The admin panel requires users to be authenticated. Public pages (home, businesses, gallery, committee) are accessible without authentication.

## File Storage

Images are stored in Supabase Storage buckets:
- `business_images`: For business profile images
- `gallery_images`: For gallery images
- `committee_images`: For committee member profile images

Each bucket has public read access but requires authentication for write operations.

