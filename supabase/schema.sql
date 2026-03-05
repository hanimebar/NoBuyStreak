-- profiles: auto-created by trigger on auth.users insert
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_pro boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now()
);

-- rules: one No Buy rule per row
create table rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  category text not null,  -- clothing | food | tech | beauty | homewares | other
  daily_spend_estimate numeric(10,2),  -- optional, for money-saved calc
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_checkin_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- checkins: one row per user per rule per calendar day
create table checkins (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references rules(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  checked_date date not null,  -- date in user's timezone
  held boolean not null,       -- true = held, false = slipped
  created_at timestamptz not null default now(),
  unique(rule_id, checked_date)
);

-- temptation_logs
create table temptation_logs (
  id uuid primary key default gen_random_uuid(),
  rule_id uuid not null references rules(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  item_name text not null,
  category text not null,
  estimated_cost numeric(10,2),
  trigger_source text,  -- instagram | tiktok | email | in-store | boredom | other
  outcome text not null,  -- resisted | slipped
  logged_at timestamptz not null default now(),
  acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

-- webhook_events: idempotency log for Stripe webhooks
create table webhook_events (
  id text primary key,  -- Stripe event ID
  type text not null,
  processed_at timestamptz not null default now()
);

-- indexes
create index on checkins(rule_id, checked_date);
create index on temptation_logs(user_id, logged_at);
create index on temptation_logs(logged_at, acknowledged);

-- RLS
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

alter table rules enable row level security;
create policy "Users manage own rules" on rules using (auth.uid() = user_id);

alter table checkins enable row level security;
create policy "Users manage own checkins" on checkins using (auth.uid() = user_id);

alter table temptation_logs enable row level security;
create policy "Users manage own temptations" on temptation_logs using (auth.uid() = user_id);

-- Postgres trigger: auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
