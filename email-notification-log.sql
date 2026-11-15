-- Run in Supabase SQL Editor before deploying the Edge Function.
create table if not exists public.email_notification_log (
 id uuid primary key default gen_random_uuid(),
 record_id uuid not null,
 record_type text not null check (record_type in ('booking','inquiry')),
 created_at timestamptz not null default now(),
 admin_sent boolean not null default false,
 customer_sent boolean not null default false,
 provider_message_id text,
 error_message text,
 unique(record_id,record_type)
);
alter table public.email_notification_log enable row level security;
revoke all on public.email_notification_log from anon, authenticated;
grant all on public.email_notification_log to service_role;
