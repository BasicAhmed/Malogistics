-- Run this once in Supabase → SQL Editor → New query → Run.
-- Single-row table holding every configurable pricing variable. The admin
-- edits this from /admin/pricing; the quotation engine always reads the
-- current row, so changes apply to every quote generated after the save.

create table if not exists pricing_config (
  id int primary key default 1,

  base_price numeric not null default 500,
  local_base_price numeric not null default 400,
  price_per_kg numeric not null default 8,
  price_per_km numeric not null default 4.5,
  price_per_volume numeric not null default 120,

  category_multiplier_general numeric not null default 1.0,
  category_multiplier_containerized numeric not null default 1.15,
  category_multiplier_cold_chain numeric not null default 1.35,

  cold_chain_fee numeric not null default 850,
  container_handling_fee numeric not null default 1200,
  cross_border_fee numeric not null default 2500,

  urgency_flexible_pct numeric not null default 0,
  urgency_this_month_pct numeric not null default 5,
  urgency_two_weeks_pct numeric not null default 10,
  urgency_this_week_pct numeric not null default 25,

  tax_pct numeric not null default 15,
  minimum_charge numeric not null default 1500,

  updated_at timestamptz not null default now(),

  constraint single_row check (id = 1)
);

insert into pricing_config (id) values (1)
  on conflict (id) do nothing;
