-- URMA landing page backend. Paste this whole file into Supabase: SQL Editor > New query > Run.
-- Visitors (the "anon" role) can only: add a lead, add feedback, cast or remove a vote, and read vote totals.
-- They cannot read leads, feedback or individual votes. You read those in the Table Editor.

-- 1. Votes (one row per browser per product) ---------------------------------------------
create table if not exists public.vote_events (
  product    text not null check (product in
             ('infinity-cube-tpu','infinity-cube-pla','spiral-focus','dragon-egg','orbit','flexi-dragon')),
  client_id  uuid not null,
  created_at timestamptz not null default now(),
  primary key (product, client_id)
);
alter table public.vote_events enable row level security;   -- no policies: no direct access
revoke all on public.vote_events from anon, authenticated;

create or replace function public.vote_counts()
returns table(product text, votes bigint)
language sql security definer set search_path = public as
$$ select product, count(*) from public.vote_events group by product $$;

create or replace function public.cast_vote(p_product text, p_client uuid)
returns void
language sql security definer set search_path = public as
$$ insert into public.vote_events(product, client_id) values (p_product, p_client) on conflict do nothing $$;

create or replace function public.remove_vote(p_product text, p_client uuid)
returns void
language sql security definer set search_path = public as
$$ delete from public.vote_events where product = p_product and client_id = p_client $$;

grant execute on function public.vote_counts()                 to anon;
grant execute on function public.cast_vote(text, uuid)         to anon;
grant execute on function public.remove_vote(text, uuid)       to anon;

-- 2. Leads ("Try one" form) ---------------------------------------------------------------
create table if not exists public.leads (
  id         bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name       text not null check (char_length(name) between 1 and 120),
  email      text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company    text not null check (char_length(company) between 1 and 160),
  role       text check (char_length(role) <= 120),
  team_size  text check (char_length(team_size) <= 40),
  interest   text check (char_length(interest) <= 80),
  message    text check (char_length(message) <= 2000),
  consent    boolean not null check (consent)
);
alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;
grant insert on public.leads to anon;
drop policy if exists "anyone can submit a lead" on public.leads;
create policy "anyone can submit a lead" on public.leads for insert to anon with check (true);

-- 3. Feedback ("Share feedback" form, open answers) --------------------------------------
create table if not exists public.feedback (
  id             bigint generated always as identity primary key,
  created_at     timestamptz not null default now(),
  product        text check (char_length(product) <= 80),
  noticed        text check (char_length(noticed) <= 2000),
  change_request text check (char_length(change_request) <= 2000),
  context        text check (char_length(context) <= 2000),
  contact        text check (char_length(contact) <= 200),
  check (coalesce(noticed, change_request, context) is not null)
);
alter table public.feedback enable row level security;
revoke all on public.feedback from anon, authenticated;
grant insert on public.feedback to anon;
drop policy if exists "anyone can submit feedback" on public.feedback;
create policy "anyone can submit feedback" on public.feedback for insert to anon with check (true);
