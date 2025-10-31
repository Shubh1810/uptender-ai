-- ============================================
-- FIX TRIGGER: Improved handle_new_user function
-- ============================================
-- This fixes the trigger to properly extract name from Google Sign-In
-- and ensures it works for future signups

-- Drop and recreate the function with better error handling
drop function if exists public.handle_new_user() cascade;

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
end;
$$ language plpgsql security definer;

-- Ensure trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- BACKFILL: Create profiles for existing users
-- ============================================
-- Run this to create profiles for users who signed up BEFORE the trigger was created

-- Backfill profiles for existing auth.users who don't have profiles
insert into public.profiles (id, full_name, onboarding_completed)
select 
  u.id,
  coalesce(
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    u.raw_user_meta_data->>'display_name',
    ''
  ) as full_name,
  false as onboarding_completed
from auth.users u
left join public.profiles p on u.id = p.id
where p.id is null
on conflict (id) do nothing;

-- Backfill user_preferences for existing auth.users who don't have preferences
insert into public.user_preferences (user_id)
select u.id
from auth.users u
left join public.user_preferences up on u.id = up.user_id
where up.user_id is null
on conflict (user_id) do nothing;

-- ============================================
-- VERIFICATION: Check if trigger and data are working
-- ============================================
-- Run this query to see:
-- 1. How many users have profiles
-- 2. How many users have preferences
-- 3. Which users are missing profiles/preferences

select 
  'Users Summary' as check_type,
  (select count(*) from auth.users) as total_auth_users,
  (select count(*) from public.profiles) as total_profiles,
  (select count(*) from public.user_preferences) as total_preferences,
  (select count(*) from auth.users u 
   left join public.profiles p on u.id = p.id 
   where p.id is null) as users_missing_profiles,
  (select count(*) from auth.users u 
   left join public.user_preferences up on u.id = up.user_id 
   where up.user_id is null) as users_missing_preferences;

