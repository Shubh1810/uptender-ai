-- =============================================================================
-- MIGRATION: Security hardening
-- Date: 2026-11-03
--
-- The anon key is public, so anything the `anon` / `authenticated` roles can
-- do through PostgREST, any visitor can do from the browser console.
-- This migration closes the holes the app relied on:
--
--   1. profiles.role        users could UPDATE their own row → set role='director'
--   2. user_subscriptions   users could INSERT their own row → free paid plans
--   3. activate_subscription  atomic, idempotent plan activation (service role only)
--   4. director_change_user_plan  no-op for users without a subscription row
--   5. saved_tenders_with_stats   view ran as owner → bypassed RLS (all users' saves readable)
--   6. tenders              readable by anonymous visitors; expose only a count
--   7. SECURITY DEFINER functions: pin search_path, remove PUBLIC execute
--
-- Run in the Supabase SQL editor (or `supabase db push`). Idempotent.
-- =============================================================================

begin;

-- -----------------------------------------------------------------------------
-- 0. Preconditions
-- -----------------------------------------------------------------------------
-- Activation marks the previous plan 'superseded'. Fail loudly if a CHECK
-- constraint would reject that, instead of silently leaving two active plans.
do $$
declare c record;
begin
  for c in
    select conname, pg_get_constraintdef(oid) as def
    from pg_constraint
    where conrelid = 'public.user_subscriptions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    if c.def not ilike '%superseded%' then
      raise exception
        'Constraint % on user_subscriptions (%) does not allow status ''superseded''. Add it, then re-run.',
        c.conname, c.def;
    end if;
  end loop;
end $$;

-- -----------------------------------------------------------------------------
-- 1. profiles.role can only be changed by trusted roles
-- -----------------------------------------------------------------------------
-- SECURITY INVOKER on purpose: current_user must reflect the caller.
-- API callers run as `anon` / `authenticated`; the SQL editor, migrations,
-- auth triggers and SECURITY DEFINER director functions run as other roles.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.role := 'user';
  elsif new.role is distinct from old.role then
    raise exception 'Not allowed to change role' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
  before insert or update on public.profiles
  for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;

-- -----------------------------------------------------------------------------
-- 2. user_subscriptions: users may only READ their own rows
-- -----------------------------------------------------------------------------
alter table public.user_subscriptions enable row level security;

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'user_subscriptions'
  loop
    execute format('drop policy %I on public.user_subscriptions', pol.policyname);
  end loop;
end $$;

create policy "subscriptions_select_own"
  on public.user_subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

revoke insert, update, delete on public.user_subscriptions from anon, authenticated;

-- One subscription per payment (blocks replaying a payment for extra time).
do $$
begin
  create unique index if not exists user_subscriptions_payment_id_key
    on public.user_subscriptions (payment_id)
    where payment_id is not null;
exception when unique_violation then
  raise warning 'Duplicate payment_id rows exist in user_subscriptions (past replays?). '
                'Resolve them and re-run to add the unique index. activate_subscription still '
                'deduplicates under a lock.';
end $$;

-- -----------------------------------------------------------------------------
-- 3. activate_subscription: the ONLY way a paid plan gets created
-- -----------------------------------------------------------------------------
create or replace function public.activate_subscription(
  p_user_id       uuid,
  p_plan_id       text,
  p_payment_id    text,
  p_order_id      text,
  p_period_months int default 12
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now          timestamptz := now();
  v_current_plan text;
  v_current_exp  timestamptz;
  v_expires      timestamptz;
begin
  if p_period_months is null or p_period_months < 1 or p_period_months > 36 then
    raise exception 'Invalid subscription period: %', p_period_months;
  end if;
  if not exists (select 1 from public.subscription_plans where id = p_plan_id) then
    raise exception 'Unknown plan: %', p_plan_id;
  end if;

  -- Serialise activations per user (webhook + browser callback can race).
  perform pg_advisory_xact_lock(hashtextextended(p_user_id::text, 0));

  if exists (select 1 from public.user_subscriptions where payment_id = p_payment_id) then
    return jsonb_build_object('success', true, 'already_activated', true);
  end if;

  select plan_id, expires_at
    into v_current_plan, v_current_exp
    from public.user_subscriptions
   where user_id = p_user_id and status = 'active'
   order by started_at desc
   limit 1;

  -- Renewing the same plan early extends from the current expiry rather than
  -- throwing away the time the customer already paid for.
  if v_current_plan = p_plan_id and v_current_exp > v_now then
    v_expires := v_current_exp + make_interval(months => p_period_months);
  else
    v_expires := v_now + make_interval(months => p_period_months);
  end if;

  update public.user_subscriptions
     set status = 'superseded', updated_at = v_now
   where user_id = p_user_id and status = 'active';

  insert into public.user_subscriptions
    (user_id, plan_id, status, started_at, expires_at, payment_id, order_id)
  values
    (p_user_id, p_plan_id, 'active', v_now, v_expires, p_payment_id, p_order_id);

  return jsonb_build_object('success', true, 'already_activated', false, 'expires_at', v_expires);
end;
$$;

revoke all on function public.activate_subscription(uuid, text, text, text, int) from public, anon, authenticated;
grant execute on function public.activate_subscription(uuid, text, text, text, int) to service_role;

-- -----------------------------------------------------------------------------
-- 4. director_change_user_plan: also works for users with no subscription row
-- -----------------------------------------------------------------------------
create or replace function public.director_change_user_plan(
  p_target_user_id uuid,
  p_new_plan_id    text,
  p_reason         text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_user_id uuid := auth.uid();
  v_updated       int;
begin
  if v_admin_user_id is null then
    return jsonb_build_object('success', false, 'error', 'Not authenticated');
  end if;
  if not public.is_director(v_admin_user_id) then
    return jsonb_build_object('success', false, 'error', 'Unauthorized - Director access required');
  end if;
  if not exists (select 1 from public.subscription_plans where id = p_new_plan_id) then
    return jsonb_build_object('success', false, 'error', 'Invalid plan ID');
  end if;
  if not exists (select 1 from auth.users where id = p_target_user_id) then
    return jsonb_build_object('success', false, 'error', 'User not found');
  end if;

  update public.user_subscriptions
     set plan_id = p_new_plan_id, updated_at = now()
   where user_id = p_target_user_id and status = 'active';
  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    insert into public.user_subscriptions (user_id, plan_id, status, started_at)
    values (p_target_user_id, p_new_plan_id, 'active', now());
  end if;

  insert into public.admin_audit_log (admin_user_id, action, target_user_id, details)
  values (
    v_admin_user_id,
    'change_plan',
    p_target_user_id,
    jsonb_build_object('new_plan_id', p_new_plan_id, 'reason', p_reason, 'created_subscription', v_updated = 0)
  );

  return jsonb_build_object('success', true, 'message', 'Plan updated successfully');
end;
$$;

-- -----------------------------------------------------------------------------
-- 5. saved_tenders: views must respect the caller's RLS
-- -----------------------------------------------------------------------------
alter table public.saved_tenders enable row level security;
alter view public.saved_tenders_with_stats set (security_invoker = true);
revoke all on public.saved_tenders_with_stats from anon;

-- -----------------------------------------------------------------------------
-- 6. tenders: signed-in users only; anonymous visitors get just the count
-- -----------------------------------------------------------------------------
alter table public.tenders enable row level security;

do $$
declare pol record;
begin
  for pol in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'tenders' and cmd = 'SELECT'
  loop
    execute format('drop policy %I on public.tenders', pol.policyname);
  end loop;
end $$;

create policy "tenders_select_authenticated"
  on public.tenders
  for select
  to authenticated
  using (true);

revoke select on public.tenders from anon;

create or replace function public.active_tender_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*) from public.tenders where is_active = true;
$$;

revoke all on function public.active_tender_count() from public;
grant execute on function public.active_tender_count() to anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 7. SECURITY DEFINER hygiene
-- -----------------------------------------------------------------------------
-- Pin search_path (prevents search_path hijacking) on every definer function.
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and p.proname in (
        'is_director', 'is_admin', 'get_user_role',
        'director_get_all_users', 'director_get_user_usage', 'director_reset_user_usage',
        'get_saved_tenders_count', 'is_tender_saved',
        'user_has_feature', 'check_and_increment_usage', 'get_user_usage'
      )
  loop
    execute format('alter function %s set search_path = public', f.sig);
  end loop;
end $$;

-- Functions that take an arbitrary user id and act on it must not be callable
-- from the browser (users could read or exhaust other users' quotas).
-- The app no longer calls them; backend jobs should use the service role.
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'get_saved_tenders_count', 'is_tender_saved',
        'user_has_feature', 'check_and_increment_usage', 'get_user_usage'
      )
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
    execute format('grant execute on function %s to service_role', f.sig);
  end loop;
end $$;

-- Role / director functions: signed-in users only (each checks auth.uid() itself).
do $$
declare f record;
begin
  for f in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'is_director', 'is_admin', 'get_user_role',
        'director_change_user_plan', 'director_get_all_users',
        'director_get_user_usage', 'director_reset_user_usage'
      )
  loop
    execute format('revoke all on function %s from public, anon', f.sig);
    execute format('grant execute on function %s to authenticated, service_role', f.sig);
  end loop;
end $$;

commit;

-- =============================================================================
-- Verification (run after the migration)
-- =============================================================================
-- Policies on sensitive tables:
--   select tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where tablename in ('profiles', 'user_subscriptions', 'tenders', 'saved_tenders', 'usage_tracking');
--
-- As a normal signed-in user, these must FAIL from the browser console:
--   await supabase.from('profiles').update({ role: 'director' }).eq('id', myId)
--   await supabase.from('user_subscriptions').insert({ user_id: myId, plan_id: 'enterprise', status: 'active' })
--   await supabase.rpc('activate_subscription', { ... })
