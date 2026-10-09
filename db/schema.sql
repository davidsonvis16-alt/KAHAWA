-- KAHAWA auth schema. Safe to run more than once (npm run db:setup).
-- Works on any Postgres 13+: Neon, Supabase, Railway, or local.

-- Customers. Passwords are stored ONLY as argon2id hashes.
create table if not exists users (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  name              text not null,
  phone             text not null,
  password_hash     text not null,
  email_verified_at timestamptz,
  points            integer not null default 50 check (points >= 0),
  addresses         jsonb not null default '[]'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
-- One account per email, case-insensitive (Wanjiku@x.com == wanjiku@x.com).
create unique index if not exists users_email_key on users (lower(email));

-- Logged-in sessions. The browser holds a random token in an httpOnly cookie;
-- we store only its SHA-256, so a leaked database can't be used to log in.
create table if not exists sessions (
  token_hash  text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null,
  ip          text,
  user_agent  text
);
create index if not exists sessions_user_idx on sessions (user_id);

-- One-time links: email verification and password reset. Hashed, expiring, single use.
create table if not exists auth_tokens (
  token_hash  text primary key,
  user_id     uuid not null references users(id) on delete cascade,
  kind        text not null check (kind in ('verify', 'reset')),
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists auth_tokens_user_idx on auth_tokens (user_id, kind);

-- Rate limiting: one row per attempt, counted over a time window.
create table if not exists rate_events (
  key  text not null,
  at   timestamptz not null default now()
);
create index if not exists rate_events_key_at on rate_events (key, at);

-- If this database is on Supabase, the public schema is also exposed through
-- Supabase's REST API. Turning on RLS with no policies blocks that path entirely;
-- our server connects as the owner role, which bypasses RLS. Harmless elsewhere.
alter table users        enable row level security;
alter table sessions     enable row level security;
alter table auth_tokens  enable row level security;
alter table rate_events  enable row level security;
