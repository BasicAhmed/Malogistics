-- Run this once in Supabase → SQL Editor → New query → Run.
-- Creates the orders table used by MA Logistics' tracking/sales/performance system.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  tracking_number text unique not null,
  status text not null default 'enquiry'
    check (status in ('enquiry','quoted','confirmed','in_transit','delivered','cancelled')),
  source text not null check (source in ('web_enquiry','sales_manual')),

  goods_type text default '',
  origin text default '',
  destination text default '',
  details text default '',
  urgency text default '',

  name text not null,
  company text,
  phone text not null,
  email text not null,

  quote_amount numeric,
  corridor text,
  on_time boolean,

  history jsonb not null default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_status_idx on orders (status);
create index if not exists orders_tracking_number_idx on orders (tracking_number);
