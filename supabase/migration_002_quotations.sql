-- Run this once in Supabase → SQL Editor → New query → Run.
-- Adds the columns needed for the quotation engine + follow-up system.

alter table orders
  add column if not exists quote_breakdown jsonb,
  add column if not exists quote_inputs jsonb,
  add column if not exists quote_sent_at timestamptz,
  add column if not exists follow_up_stage int not null default 0,
  add column if not exists next_follow_up_at timestamptz;

create index if not exists orders_next_follow_up_idx on orders (next_follow_up_at)
  where next_follow_up_at is not null;
