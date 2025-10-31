-- Profiles table (one-to-one with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  business_type text check (business_type in (
    'Proprietorship','Pvt Ltd','LLP','MSME','Startup','Consultant','Individual'
  )),
  gst_number_enc bytea, -- optional encrypted GST
  gst_verified boolean default false,
  years_in_operation int check (years_in_operation >= 0),
  primary_industry text,
  secondary_industries text[] default '{}',
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "self-profiles-select" on public.profiles for select using (auth.uid() = id);
create policy "self-profiles-insert" on public.profiles for insert with check (auth.uid() = id);
create policy "self-profiles-update" on public.profiles for update using (auth.uid() = id);

-- User preferences (one-to-one)
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  notify_whatsapp boolean default false,
  notify_sms boolean default false,
  notify_email boolean default true,
  notify_inapp boolean default true,
  frequency text check (frequency in ('real_time','daily','weekly')) default 'daily',
  alert_threshold int check (alert_threshold between 0 and 100) default 70,
  keywords text[] default '{}',
  categories text[] default '{}',
  regions text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_preferences enable row level security;
create policy "self-pref-select" on public.user_preferences for select using (auth.uid() = user_id);
create policy "self-pref-insert" on public.user_preferences for insert with check (auth.uid() = user_id);
create policy "self-pref-update" on public.user_preferences for update using (auth.uid() = user_id);

-- Optional: saved tenders
create table if not exists public.saved_tenders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tender_ref text not null,
  title text not null,
  url text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index if not exists saved_tenders_user_id_idx on public.saved_tenders (user_id);

alter table public.saved_tenders enable row level security;
create policy "self-saved-select" on public.saved_tenders for select using (auth.uid() = user_id);
create policy "self-saved-insert" on public.saved_tenders for insert with check (auth.uid() = user_id);
create policy "self-saved-delete" on public.saved_tenders for delete using (auth.uid() = user_id);

-- Bootstrap trigger to auto-create profile and preferences at signup
create or replace function public.handle_new_user()
returns trigger as $$
declare
  user_full_name text;
begin
  -- Extract full name from Google metadata (tries multiple possible fields)
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'display_name',
    ''
  );

  -- Insert profile (with name from Google if available)
  insert into public.profiles (id, full_name, onboarding_completed)
  values (new.id, user_full_name, false)
  on conflict (id) do nothing;

  -- Insert user preferences (defaults will be applied)
  insert into public.user_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
exception
  when others then
    -- Log error but don't fail the user creation
    raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
    return new;
end; $$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


