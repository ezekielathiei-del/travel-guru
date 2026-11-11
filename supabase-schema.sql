-- Travel Guru secure enquiry and booking database (Supabase / PostgreSQL)
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_travel_guru_admin()
returns boolean language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_travel_guru_admin() from public;
grant execute on function public.is_travel_guru_admin() to authenticated;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  destination text not null,
  travel_date date,
  travellers integer not null default 1 check (travellers between 1 and 100),
  message text not null default '',
  status text not null default 'new' check (status in ('new','contacted','pending','confirmed','cancelled'))
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reference text not null unique,
  full_name text not null,
  email text not null,
  phone text not null,
  package_name text not null,
  travel_date date not null,
  return_date date not null,
  travellers integer not null check (travellers between 1 and 30),
  room_preference text not null default 'Standard',
  special_requests text not null default '',
  estimated_total numeric(12,2) not null default 0 check (estimated_total >= 0),
  status text not null default 'new' check (status in ('new','contacted','pending','confirmed','cancelled')),
  constraint valid_booking_dates check (return_date >= travel_date)
);

alter table public.admin_users enable row level security;
alter table public.inquiries enable row level security;
alter table public.bookings enable row level security;

-- Visitors can submit records, but cannot read or change anyone's records.
drop policy if exists "Public can submit enquiries" on public.inquiries;
create policy "Public can submit enquiries" on public.inquiries for insert to anon, authenticated with check (status = 'new');
drop policy if exists "Admins can read enquiries" on public.inquiries;
create policy "Admins can read enquiries" on public.inquiries for select to authenticated using (public.is_travel_guru_admin());
drop policy if exists "Admins can update enquiries" on public.inquiries;
create policy "Admins can update enquiries" on public.inquiries for update to authenticated using (public.is_travel_guru_admin()) with check (public.is_travel_guru_admin());

drop policy if exists "Public can submit booking requests" on public.bookings;
create policy "Public can submit booking requests" on public.bookings for insert to anon, authenticated with check (status = 'new');
drop policy if exists "Admins can read bookings" on public.bookings;
create policy "Admins can read bookings" on public.bookings for select to authenticated using (public.is_travel_guru_admin());
drop policy if exists "Admins can update bookings" on public.bookings;
create policy "Admins can update bookings" on public.bookings for update to authenticated using (public.is_travel_guru_admin()) with check (public.is_travel_guru_admin());

-- No browser role can read the admin allowlist.
revoke all on public.admin_users from anon, authenticated;
revoke all on public.inquiries from anon, authenticated;
revoke all on public.bookings from anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
grant insert on public.bookings to anon, authenticated;
grant select, update on public.inquiries to authenticated;
grant select, update on public.bookings to authenticated;
