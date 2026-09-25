-- Alejandro Puerto Technology - Lead capture schema v0.4
-- Execute this script in the Supabase SQL editor.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  profile text not null,
  company text,
  message text not null,
  source text not null default 'website',
  status text not null default 'new',
  consent_at timestamptz not null,
  health_score smallint,
  health_band text,
  metadata jsonb not null default '{}'::jsonb,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  cta text,
  notified_at timestamptz,
  constraint leads_health_score_range check (health_score is null or health_score between 0 and 100),
  constraint leads_status_allowed check (status in ('new','contacted','qualified','proposal','won','lost'))
);

-- Safe upgrades for existing v0.2/v0.3 projects.
alter table public.leads add column if not exists health_score smallint;
alter table public.leads add column if not exists health_band text;
alter table public.leads add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.leads add column if not exists utm_source text;
alter table public.leads add column if not exists utm_medium text;
alter table public.leads add column if not exists utm_campaign text;
alter table public.leads add column if not exists utm_content text;
alter table public.leads add column if not exists utm_term text;
alter table public.leads add column if not exists landing_page text;
alter table public.leads add column if not exists referrer text;
alter table public.leads add column if not exists cta text;
alter table public.leads add column if not exists notified_at timestamptz;

alter table public.leads enable row level security;

-- No anon/authenticated insert policy is intentionally created.
-- Inserts are performed only from the server route using the server-side Supabase secret key.

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_health_score_idx on public.leads (health_score) where health_score is not null;
create index if not exists leads_utm_campaign_idx on public.leads (utm_campaign) where utm_campaign is not null;
