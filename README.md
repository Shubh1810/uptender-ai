# TenderPost — frontend

Next.js 16 (App Router) + Supabase + Razorpay. Deployed on Vercel.

```bash
cp .env.example .env.local   # fill in values
npm install
npm run dev
npm run check                # typecheck + lint + tests (same as CI, minus build)
```

## Architecture

```
src/
  app/            Routes only. Pages stay thin; API route handlers validate,
                  authorise, call into server/ and return JSON.
  features/       Client-side domain code, one folder per domain
    billing/        Razorpay Checkout loader + browser SDK types
    plans/          useSubscription, PlanGate, plan types
    saved-tenders/  useSavedTenders
    tenders/        live tender count
  server/         Server-only code (`import 'server-only'`; importing it from a
                  client component fails the build)
    env.ts          Validated environment variables
    http.ts         apiHandler(), parseJson(), ApiError, same-origin check
    auth.ts         getAuth(), requireUser(), requireDirector()
    plans.ts        getActivePlan(): current plan + limits (free fallback)
    rate-limit.ts   Best-effort per-instance limiter
    crypto.ts       AES-256-GCM field encryption (GST numbers)
    billing/        Razorpay client, signature checks, subscription activation
    email/          Resend client + HTML-escaped templates
    supabase/       server (RLS, as the user) / admin (service role) / session
  config/plans.ts Single source of truth for plan names, prices, GST
  lib/            Framework-agnostic helpers (safe redirects, escaping, …)
  components/     Shared UI (landing sections, dashboard shell, ui/ primitives)
  proxy.ts        Session refresh + redirect for protected pages
supabase/
  migrations/     Versioned SQL, including RLS. Apply in order.
  scripts/        One-off SQL (e.g. assigning the director role)
scripts/          One-off Node scripts (e.g. encrypting legacy GST values)
tests/            Vitest unit tests
docs/             Product / historical notes
```

### Rules of the road

- **The browser can reach Supabase directly** with the public anon key. Every
  table must be protected by RLS; API checks alone are not enough.
- **Never trust the client for money or permissions.** Prices come from
  `config/plans.ts`; plans are activated only by `activate_subscription`
  (service role) after Razorpay confirms payment.
- **Route handlers** use `apiHandler` + `parseJson(schema)` + `requireUser()`.
  Errors are thrown as `ApiError`; unexpected errors return a generic 500 and
  are logged server-side (no DB messages or stack traces reach the client).
- **User input in HTML emails** goes through `escapeHtml`. User input in
  PostgREST filter strings goes through `sanitizeSearchTerm`.
- **Redirect targets** from query params go through `safeRedirectPath`.

## Payments

1. `POST /api/razorpay/create-order` creates an order for the plan's yearly
   price + 18% GST and records `userId` / `planId` in the order notes.
2. The browser opens Razorpay Checkout; on success it calls
   `POST /api/razorpay/verify-payment` (signature checked).
3. Razorpay also calls `POST /api/razorpay/webhook` (`order.paid`,
   `payment.captured`). Either path activates the plan. Activation is
   idempotent per payment, so retries and duplicates are safe.

## Deploying these changes

1. **Database:** run `supabase/migrations/20261103000000_security_hardening.sql`
   in the Supabase SQL editor **before** deploying the app (`/api/tender-stats`
   and plan activation depend on functions it creates). It aborts with a clear
   message if `user_subscriptions.status` can't hold `'superseded'`.
2. **Env vars on Vercel:** add `SUPABASE_SERVICE_ROLE_KEY`,
   `RAZORPAY_WEBHOOK_SECRET`, `GST_ENCRYPTION_KEY`, `EMAIL_FROM` (see
   `.env.example`).
3. **Razorpay dashboard:** add the webhook (URL, events, secret above).
4. **Resend:** verify `tenderpost.org` and set `EMAIL_FROM` to an address on it.
5. **Legacy GST values:** `node scripts/encrypt-existing-gst.mjs` (dry run),
   then `--apply`.

## Typing Supabase

Query results are currently typed by hand at the call site. Once the Supabase
CLI is linked, generate types and pass them to the clients:

```bash
npx supabase gen types typescript --project-id <id> > src/server/supabase/database.types.ts
```
