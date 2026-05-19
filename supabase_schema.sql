-- Run this entire file in your Supabase SQL editor (Database → SQL Editor → New Query)

-- Profiles table (extends auth.users)
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  plan        text default 'starter' check (plan in ('starter','pro','lifetime')),
  trial_ends  timestamptz default (now() + interval '7 days'),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Accounts table (prop firm accounts)
create table public.accounts (
  id              uuid default gen_random_uuid() primary key,
  user_id         uuid references public.profiles on delete cascade not null,
  firm            text not null,
  plan            text not null,
  account_size    text not null,
  status          text default 'Evaluation',
  current_profit  numeric default 0,
  profit_target   numeric,
  days_traded     integer default 0,
  winning_days    integer default 0,
  current_balance numeric,
  best_day_pnl    numeric,
  notes           text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Daily log table
create table public.daily_log (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.profiles on delete cascade not null,
  date       date not null,
  total      numeric default 0,
  eval_pnl   numeric default 0,
  funded_pnl numeric default 0,
  note       text,
  created_at timestamptz default now(),
  unique (user_id, date)
);

-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Row Level Security (users can only see their own data)
alter table public.profiles  enable row level security;
alter table public.accounts  enable row level security;
alter table public.daily_log enable row level security;

create policy "Users can view own profile"   on public.profiles  for all using (auth.uid() = id);
create policy "Users can view own accounts"  on public.accounts  for all using (auth.uid() = user_id);
create policy "Users can view own daily log" on public.daily_log for all using (auth.uid() = user_id);
