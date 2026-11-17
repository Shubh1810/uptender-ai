# TenderPost codebase, stage by stage

How the frontend works, following one user and one tender through the system.
Each stage names the folders and files involved, so you can open the code next
to the explanation.

This describes the code **as it is today** (Nov 2026, after the
`chore/restructure` reorganisation). When the structure changes, update this
file in the same commit.

---

## The big picture

```
 ┌───────────────────┐      writes rows       ┌──────────────────────────┐
 │  Render backend   │ ─────────────────────▶ │  Supabase (Postgres)     │
 │  (scraper, other  │                        │  tenders, profiles,      │
 │  repo)            │                        │  user_subscriptions, …   │
 └───────────────────┘                        │  + Supabase Auth         │
                                              └────────────▲─────────────┘
                                                           │ reads/writes
                                                           │ (RLS applies)
 ┌──────────────────────────── this repo (Next.js on Vercel) ─────────────┐
 │                                                                        │
 │  Browser ──▶ src/proxy.ts ──▶ src/app/   (routes only: pages + API)    │
 │                 │                 │                                    │
 │                 │                 ├──▶ src/features/   product areas   │
 │                 │                 ├──▶ src/components/ shared UI       │
 │                 │                 ├──▶ src/server/     infrastructure  │
 │                 │                 └──▶ src/lib/        pure helpers    │
 │                 └─ refreshes the login session on protected pages      │
 └────────────────────────────────────────────────────────────────────────┘
          │                          │                      │
          ▼                          ▼                      ▼
      Razorpay                    Resend                 PostHog
     (payments)                  (emails)              (analytics)
```

**The frontend never scrapes.** The Render backend fills the `tenders`
table; this repo only reads it. The schema of `tenders` belongs to the backend.

---

## The layout and its rules

```
src/
├── app/                      ROUTES ONLY. A folder = a URL segment.
│   ├── (marketing)/          public site. "(…)" folders don't appear in URLs
│   │   ├── page.tsx          → /
│   │   ├── blog/ contact/ tender-guide/
│   │   └── (legal)/          privacy-policy, terms-and-conditions,
│   │                         cancellation-and-refund, shipping-and-delivery
│   ├── (auth)/
│   │   ├── auth/             → /auth/callback, /auth/signup, /auth/reset-password, …
│   │   └── onboarding/       → /onboarding
│   ├── (app)/                signed-in product (proxy-protected)
│   │   ├── dashboard/        → /dashboard/*  (layout.tsx = auth + plan + shell)
│   │   └── make-payment/     → /make-payment
│   ├── api/                  → /api/*  JSON endpoints + Razorpay webhook
│   ├── layout.tsx            root <html>: fonts, default SEO metadata, JSON-LD, analytics
│   ├── manifest.ts           → /manifest.webmanifest (installable app)
│   ├── opengraph-image.tsx twitter-image.tsx  → 1200×630 share card
│   ├── sitemap.ts robots.ts  → /sitemap.xml, /robots.txt
│   ├── icon.png apple-icon.png favicon.ico  loading.tsx  globals.css
│   ├── not-found.tsx error.tsx global-error.tsx   404 / crash screens
│
├── features/                 ONE FOLDER PER PRODUCT AREA (UI + hooks + server code)
│   ├── auth/                 useAuth, sign-out, get-started-button (Google)
│   ├── onboarding/           OnboardingClient (3-step flow), status.ts
│   ├── tenders/              search-terms (sanitiser), tender-stats (live count)
│   ├── saved-tenders/        useSavedTenders
│   ├── alerts/               components/*, types.ts, useAlertPreferences
│   ├── plans/                catalog.ts (prices!), PlanGate, useSubscription, types,
│   │   └── server/           active-plan.ts (getActivePlan, planLimit)
│   ├── billing/              checkout-script, types (Razorpay browser SDK)
│   │   └── server/           razorpay.ts (SDK + signatures), activate.ts
│   ├── admin/                AdminDashboardClient
│   └── marketing/            HomePage (landing, SERVER component), seo.ts (titles, keywords,
│       │                     JSON-LD), og-image, faq.ts (FAQ data), client sections:
│       │                     HeroSection, WorkflowSection, FeaturesSection, PricingSection, FaqSection
│       ├── effects/          wavy-background, glowing-effect, hover-border-gradient
│       └── waitlist/         waitlist-overlay, useWaitlistOverlay, email-signup, WaitlistCtaForm
│
├── components/               ONLY UI USED ACROSS MANY ROUTES
│   ├── ui/                   button, input, loading-screen (primitives)
│   └── layout/               Header, Footer, cookie-banner, ErrorState (error boundary UI)
│       └── dashboard/        DashboardShell, DashboardAccessProvider, DashboardLoadingScreen
│
├── server/                   INFRASTRUCTURE ONLY (no product logic), server-only
│   env.ts http.ts auth.ts rate-limit.ts crypto.ts email/ supabase/
│
├── lib/                      PURE HELPERS, safe in browser and server
│   safe-redirect.ts escape-html.ts navigation.ts utils.ts site.ts (SITE_URL)
│   fonts.ts (every next/font family + CSS variables)
│   supabase/client.ts (browser client)  analytics/ (PostHog provider + events)
│
└── proxy.ts                  runs before every request (Next 16's "middleware")
```

**Where does a file go?** Ask these in order:

1. **Is it a URL?** Put it in `app/`, and keep it thin. It should mostly import
   from `features/`.
2. **Is it about one product area** (plans, billing, tenders, alerts…)? Put it
   in `features/<area>/`. If it touches secrets, the service role or a
   third-party SDK, put it in `features/<area>/server/` and start the file with
   `import 'server-only'`.
3. **Is it UI used by several areas or routes?** Put it in `components/`
   (`ui/` for primitives, `layout/` for page chrome).
4. **Is it infrastructure every feature needs** (env, HTTP helpers, auth
   check, DB clients, email transport)? Put it in `server/`.
5. **Is it a tiny pure helper with no product knowledge?** Put it in `lib/`.

The other top-level folders:

| Folder | What lives here |
|---|---|
| `supabase/migrations/` | SQL that changes the database, applied in date order. Security rules (RLS) and `activate_subscription` |
| `supabase/scripts/` | One-off SQL (e.g. making your account a director) |
| `scripts/` | One-off Node scripts (e.g. encrypting old GST numbers) |
| `tests/` | Vitest unit tests: pricing, redirects, escaping, signatures, encryption |
| `public/` | Images served as-is at `/<filename>` |
| `docs/archive/` | Old product notes, **out of date**, kept for history |
| `.github/workflows/ci.yml` | typecheck, lint, tests, `npm audit` and build on every push/PR |

---

## Stage 0: Data arrives (the scraper)

- **Where:** not in this repo. The Render backend writes rows to Supabase
  `tenders` (title, organisation, closing date, value, location, …).
- **What the frontend relies on:** `is_active = true`, and the column list in
  `SELECT_FIELDS` in `src/app/api/tenders/route.ts`. If the scraper renames a
  column, search breaks there first.
- **Security:** only signed-in users can read `tenders`. Anonymous visitors
  only get a count, via the `active_tender_count()` database function.

## Stage 1: A visitor lands on the site (marketing)

```
GET /  ──▶ app/layout.tsx                 fonts, default metadata (features/marketing/seo.ts),
                                           JSON-LD, PostHog + Vercel Analytics,
                                           components/layout/cookie-banner
       ──▶ app/(marketing)/page.tsx       server: homepage title + canonical
       ──▶ features/marketing/HomePage.tsx  server: static sections (CTA, categories,
             │                               FAQ JSON-LD) render to HTML, no client JS
             ├─ components/layout/Header, Footer
             ├─ client islands: HeroSection, WorkflowSection (sticky scroll story),
             │  FeaturesSection (scroll offsets), PricingSection, FaqSection
             ├─ features/marketing/effects/*      visual effects (framer-motion)
             ├─ features/marketing/waitlist/*     waitlist popup + CTA form
             └─ Header + Hero ─▶ features/tenders/tender-stats (one shared request,
                                 cached 60s) ─▶ GET /api/tender-stats ─▶ active_tender_count()
```

- **Other public pages:** `app/(marketing)/blog`, `contact`, `tender-guide`,
  and the four legal pages in `(legal)/`. Each imports `Header`/`Footer`
  itself for now.
- **SEO:**
  - Each public page sets its own title and canonical. The root layout only
    supplies defaults plus a `%s | TenderPost` title template.
  - `app/sitemap.ts` lists only real public pages, and `app/robots.ts` blocks
    `/api/`, `/dashboard` and `/ingest/`.
  - `manifest.ts`, `icon.png`, `apple-icon.png` and `opengraph-image.tsx` are
    turned into tags automatically.
  - `(auth)/layout.tsx` and `(app)/layout.tsx` mark sign-in and product pages
    `noindex`.
  - Search verification comes from the `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
    and `NEXT_PUBLIC_BING_SITE_VERIFICATION` env vars.
- **Lead capture:**
  - The waitlist calls `POST /api/signup` and the contact form calls
    `POST /api/contact`.
  - Both email the visitor and sales through `server/email/` and are rate
    limited by `server/rate-limit.ts`.
- **Analytics:** `lib/analytics/provider.tsx` starts PostHog and
  `lib/analytics/events.ts` holds the named events. `next.config.js` proxies
  `/ingest/*` to PostHog so ad blockers don't drop it.

## Stage 2: Signing in

There are three entry points today, all using the browser Supabase client
(`lib/supabase/client.ts`):

| Entry point | Methods |
|---|---|
| `features/onboarding/OnboardingClient.tsx`, step 1 (main path) | Email 6-digit code, Google, Apple |
| `features/auth/get-started-button.tsx` (in the Header) | Google |
| `app/(auth)/auth/signup/page.tsx` | Email + password signup, Google, Apple |

What happens after the provider says "yes":

```
provider ──▶ /auth/callback   (app/(auth)/auth/callback/route.ts)
               exchanges the code for a session cookie
               ├─ onboarding not done (features/onboarding/status.ts) ─▶ /onboarding?step=2
               └─ done ──────────────────────────────────────────────▶ /dashboard
```

- **Password reset:** `app/(auth)/auth/reset-password/` sends the email, and
  `update-password/` sets the new password.
- **Sign-out:** `features/auth/sign-out.ts` clears local state, then submits a
  real form to `POST /api/auth/signout`. It's a form, not `fetch`, because
  Safari ignores cookies set on fetch responses.
- **Knowing who's signed in:**
  - On the server, call `getAuth()` / `requireUser()` / `requireDirector()`
    from `server/auth.ts`.
  - In the browser, use `features/auth/useAuth.ts` (Header).
  - In the dashboard, use `useDashboardAccess()` (see Stage 4).
- **Redirect safety:** every `?next=` or `?redirect=` value passes through
  `lib/safe-redirect.ts`.

## Stage 3: Onboarding

```
/onboarding ──▶ app/(auth)/onboarding/page.tsx + layout.tsx
            ──▶ features/onboarding/OnboardingClient.tsx
                  step 1: sign in (Stage 2)
                  steps 2–3: business profile + preferences
                  submit ──▶ POST /api/onboarding
                               ├─ validates with zod
                               ├─ encrypts GST number (server/crypto.ts)
                               ├─ upserts profiles  (onboarding_completed = true)
                               └─ upserts user_preferences
                  then a full page load to /dashboard (lib/navigation.ts)
```

- GST numbers are stored encrypted in `profiles.gst_number_enc`, with the key
  in the `GST_ENCRYPTION_KEY` env var. Lose the key and the stored numbers
  can't be read.

## Stage 4: The dashboard shell

Every `/dashboard/*` page is wrapped by `app/(app)/dashboard/layout.tsx`, a
**server component** that runs before the page:

```
request /dashboard/...
  1. proxy.ts                   signed out? ─▶ redirect to /
  2. dashboard/layout.tsx       getAuth()                      server/auth.ts
                                 onboarding complete?  else ─▶ /onboarding
                                 getActivePlan()               features/plans/server/active-plan.ts
                                 getUserRole()                 director or not
  3. DashboardAccessProvider    user + plan + isDirector → React context
  4. DashboardShell             sidebar, Chrome-style tabs, user menu
  5. the page
```

(Both 3 and 4 live in `components/layout/dashboard/`.)

- **In any dashboard client component:** `useDashboardAccess()` gives the user
  and role, and `useSubscription()` (`features/plans/`) gives the plan and
  limits. They're for display only; APIs re-check everything.
- **Paywalls:** wrap premium screens in `<PlanGate allowedPlans={[...]}>`
  (`features/plans/PlanGate.tsx`). Locked content is never rendered.

**Dashboard routes, real vs placeholder:**

| Real (has data) | Placeholder ("coming soon", ~21 lines) |
|---|---|
| `search/` (main feature), `tenders/` (saved), `alerts/`, `settings/`, `admin/`, home | `active-bids`, `bid-optimizer`, `compliance`, `doc-generator`, `email-prefs`, `history`, `notifications`, `opportunity-finder`, `profile`, `risk-compliance`, `smart-search`, `watchlist` |
| UI demos behind `PlanGate` | `ai-draft`, `ai-review`, `bid-analytics`, `competitor-intel`, `intelligraph`, `tender-analytics` |

## Stage 5: Searching tenders (the core loop)

```
app/(app)/dashboard/search/page.tsx   (client, ~1,270 lines)
   │  GET /api/tenders?query=…&keyword=…&exclude=…&location=…&page=…
   ▼
app/api/tenders/route.ts
   ├─ requireUser()                       must be signed in
   ├─ enforceRateLimit(120/min/user)
   ├─ sanitizeSearchTerms()               features/tenders/search-terms.ts
   ├─ Supabase query on `tenders`: active, not closed, ilike on
   │    title/org/ref/description, excludes, filters, value range, dates
   └─ { items, total_items, page, has_more }
```

**Saving a tender:**

```
features/saved-tenders/useSavedTenders.ts ──▶ /api/saved-tenders
                                               ├─ plan limit (features/plans/server/active-plan.ts)
                                               └─ saved_tenders / saved_tenders_with_stats
app/(app)/dashboard/tenders/page.tsx lists them.
```

- **Alerts:** `app/(app)/dashboard/alerts/page.tsx` uses `features/alerts/*`,
  which reads and writes `alert_preferences` **directly from the browser**
  (RLS protects it).
- **Settings:** `app/(app)/dashboard/settings/page.tsx` does the same with
  `profiles` and `user_preferences`.

## Stage 6: Paying (Razorpay)

```
Pricing card / PlanGate ──▶ /make-payment?plan=professional   (proxy requires sign-in)
app/(app)/make-payment/page.tsx
  1. features/billing/checkout-script.ts loads checkout.razorpay.com once
  2. POST /api/razorpay/create-order  { planId }
        features/billing/server/razorpay.ts createOrder()
        amount = features/plans/catalog.ts price + 18% GST   ← never from the browser
        order.notes = { userId, planId }                      ← source of truth later
  3. Razorpay popup; the user pays
  4. POST /api/razorpay/verify-payment  { order_id, payment_id, signature }
        verifyCheckoutSignature()
        features/billing/server/activate.ts activateSubscriptionFromPayment()
           fetches order + payment from Razorpay, checks paid/captured + amount
           DB function activate_subscription() via server/supabase/admin.ts
  5. ─▶ /dashboard (the layout now reads the new plan)

In parallel, Razorpay ──▶ POST /api/razorpay/webhook (order.paid / payment.captured)
        verifyWebhookSignature(raw body) ──▶ same activateSubscriptionFromPayment()
```

- **Why two paths?** If the user closes the tab after paying, the webhook still
  activates the plan.
- **Why it's safe to run twice:** `activate_subscription`
  (`supabase/migrations/20261103000000_security_hardening.sql`) locks per user,
  ignores an already-used `payment_id`, marks the old plan `superseded`, and
  extends the expiry on an early renewal of the same plan.
- **Who can create a paid plan:** only the service role. Users can read their
  own subscriptions but can't write them.
- **What this stage needs to work:**
  - **Env vars:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`,
    `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
  - **Database:** the hardening migration must be applied.
  - **Razorpay:** the webhook must be configured in the dashboard.

## Stage 7: Plans and limits after payment

- `features/plans/server/active-plan.ts` `getActivePlan()` returns the newest
  active, unexpired subscription, or the `free` plan's limits from
  `subscription_plans`.
- `planLimit(plan, 'saved_tenders', fallback)` is how APIs enforce limits.
- **Prices and names** come from `features/plans/catalog.ts`. **Feature flags
  and limits** come from the `subscription_plans.features` / `.limits` columns.

## Stage 8: Admin (director only)

```
/dashboard/admin ──▶ app/(app)/dashboard/admin/page.tsx   (server: director or redirect)
                 ──▶ features/admin/AdminDashboardClient.tsx
                        GET  /api/admin/users          director_get_all_users()
                        GET  /api/admin/user-usage     director_get_user_usage()
                        POST /api/admin/change-plan    director_change_user_plan()  (audited)
                        POST /api/admin/reset-usage    director_reset_user_usage()  (audited)
```

- **Roles** live in `profiles.role`. A database trigger stops users from
  changing their own role.
- **Making yourself a director:** run `supabase/scripts/setup_director_account.sql`.
- **No payment log yet:** failures only show up in Vercel logs (search for
  `[billing]` and `[api:razorpay`).

## Stage 9: Shared server plumbing (used by every API route)

| File | Job |
|---|---|
| `server/env.ts` | Validates env vars with zod. `requireEnv('X')` fails clearly when one is missing |
| `server/http.ts` | `apiHandler()` turns thrown `ApiError`s into JSON and hides unexpected errors. `parseJson(req, schema)` validates bodies. `assertSameOrigin()` is the CSRF check |
| `server/auth.ts` | `getAuth`, `requireUser`, `requireDirector`, `getUserRole` |
| `server/supabase/server.ts` | Supabase **as the user** (RLS applies). The default |
| `server/supabase/admin.ts` | Supabase **as the service role** (bypasses RLS). Only for payment activation |
| `server/supabase/session.ts` | Session refresh used by `proxy.ts` |
| `server/rate-limit.ts` | In-memory, per-instance limiter (best effort) |
| `server/crypto.ts` | AES-256-GCM encryption for sensitive fields |
| `server/email/` | Resend client + templates (user input goes through `lib/escape-html.ts`) |

A typical API route reads top to bottom like this:

```ts
export const POST = apiHandler('name', async (request) => {
  assertSameOrigin(request);                  // state-changing routes only
  const { supabase, user } = await requireUser();
  const body = await parseJson(request, schema);
  // … query as the user (RLS) …
  return NextResponse.json({ … });
});
```

## Stage 10: Shipping

1. Run `npm run check` locally (typecheck + lint + tests).
2. Push. CI runs the same checks plus `npm audit` and `next build`.
3. Vercel deploys `main`.
4. **Database changes are not automatic.** Run new `supabase/migrations/`
   files in the Supabase SQL editor (or `supabase db push`) *before*
   deploying code that needs them.
5. New env vars go into both Vercel and `.env.example`.

---

## Where did my file go? (Nov 2026 restructure)

| Before | After |
|---|---|
| `src/app/page.tsx`, `blog/`, `contact/`, `tender-guide/` | `src/app/(marketing)/…` |
| `src/app/privacy-policy/` + the 3 other legal pages | `src/app/(marketing)/(legal)/…` |
| `src/app/auth/`, `src/app/onboarding/` | `src/app/(auth)/…` |
| `src/app/dashboard/`, `src/app/make-payment/` | `src/app/(app)/…` |
| `app/dashboard/alerts/{components,types,useAlertPreferences}` | `features/alerts/` |
| `app/dashboard/admin/AdminDashboardClient.tsx` | `features/admin/` |
| `app/onboarding/OnboardingClient.tsx` | `features/onboarding/` |
| `lib/onboarding.ts` | `features/onboarding/status.ts` |
| `hooks/useAuth.ts`, `lib/auth/sign-out.ts`, `components/ui/get-started-button.tsx` | `features/auth/` |
| `lib/search-terms.ts` | `features/tenders/search-terms.ts` |
| `config/plans.ts` | `features/plans/catalog.ts` |
| `server/plans.ts` | `features/plans/server/active-plan.ts` |
| `server/billing/{razorpay,activate}.ts` | `features/billing/server/` |
| `components/{Hero,Pricing,Workflow}Section.tsx`, `components/ui/search-bar.tsx` | `features/marketing/` |
| `components/ui/{wavy-background,glowing-effect,hover-border-gradient}.tsx` | `features/marketing/effects/` |
| `components/ui/{waitlist-overlay,email-signup}.tsx`, `hooks/useWaitlistOverlay.ts` | `features/marketing/waitlist/` |
| `components/{Header,Footer}.tsx`, `components/ui/cookie-banner.tsx` | `components/layout/` |
| `components/dashboard/*` | `components/layout/dashboard/` |
| `lib/posthog/*` | `lib/analytics/*` |

URLs did not change. Route groups `(…)` are invisible in the URL.

## Known gaps (read before trusting a folder)

- The core tables (`tenders`, `profiles`, `user_subscriptions`,
  `subscription_plans`, `user_preferences`, `alert_preferences`) were created
  by hand and aren't in `supabase/migrations/`.
- Supabase query results are typed by hand. There are no generated types.
- `docs/archive/` describes an older version (Next 15, Zustand, "TenderHub").
- 12 dashboard routes are still "coming soon" placeholders. CLAUDE.md says to
  replace them with nav entries, but deleting routes needs your sign-off.
- Settings and alerts write to Supabase from the browser. Everything else goes
  through API routes.
- Marketing pages import `Header`/`Footer` one by one. A shared
  `(marketing)/layout.tsx` would remove that duplication.
- `blog/page.tsx` links to `/blog/<slug>` articles that don't exist (404).
- There are no public tender category pages (e.g. construction, railway), so
  only the homepage targets those searches.
