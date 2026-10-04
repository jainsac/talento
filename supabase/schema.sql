-- Talento production schema
create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  role text not null default 'participant' check (role in ('participant','organizer','judge','admin')),
  created_at timestamptz not null default now()
);

create table if not exists competitions (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  category text not null,
  mode text not null default 'online',
  description text,
  audition_fee numeric(10,2) not null default 0,
  currency text not null default 'INR',
  status text not null default 'draft' check (status in ('draft','review','published','live','completed','archived')),
  audition_opens_at timestamptz,
  audition_closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists competition_stages (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  name text not null,
  stage_order int not null,
  status text not null default 'upcoming' check (status in ('upcoming','live','completed')),
  created_at timestamptz not null default now(),
  unique(competition_id, stage_order)
);

create table if not exists auditions (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  participant_id uuid not null references profiles(id) on delete cascade,
  title text,
  submission_url text,
  status text not null default 'submitted' check (status in ('draft','submitted','under_review','qualified','rejected','withdrawn')),
  audience_score numeric(6,2),
  judge_score numeric(6,2),
  challenge_score numeric(6,2),
  total_score numeric(6,2),
  created_at timestamptz not null default now()
);

create table if not exists judges (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  unique(competition_id, profile_id)
);

create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  audition_id uuid not null references auditions(id) on delete cascade,
  judge_id uuid not null references judges(id) on delete cascade,
  score numeric(6,2) not null check (score >= 0 and score <= 100),
  feedback text,
  created_at timestamptz not null default now(),
  unique(audition_id, judge_id)
);

create table if not exists competition_payments (
  id uuid primary key default gen_random_uuid(),
  audition_id uuid not null references auditions(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'INR',
  provider text,
  provider_payment_id text,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
  created_at timestamptz not null default now()
);

create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions(id) on delete cascade,
  name text not null,
  logo_url text,
  reward_text text,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;
alter table competitions enable row level security;
alter table competition_stages enable row level security;
alter table auditions enable row level security;
alter table judges enable row level security;
alter table scores enable row level security;
alter table competition_payments enable row level security;
alter table sponsors enable row level security;

create policy "published competitions are public" on competitions for select using (status in ('published','live','completed'));
create policy "users read own profile" on profiles for select using (auth.uid() = id);
create policy "users update own profile" on profiles for update using (auth.uid() = id);
create policy "participants read own auditions" on auditions for select using (auth.uid() = participant_id);
create policy "participants create own auditions" on auditions for insert with check (auth.uid() = participant_id);