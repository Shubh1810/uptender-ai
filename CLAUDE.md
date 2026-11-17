# CLAUDE.md

TenderPost frontend: Next.js 16 (App Router) + React 19 + Supabase + Razorpay
on Vercel. Solo-founder startup; prefer the smallest change that ships.

**Read [CODEBASE.md](CODEBASE.md) before structural work.** It walks the whole
pipeline stage by stage. This file is the rulebook.

## Commands

```bash
npm run dev          # local dev
npm run check        # typecheck + lint + tests. Must pass before you finish
npm run build        # what CI and Vercel run
npx vitest run tests/plans.test.ts   # a single test file
```

If `tsc` reports errors only inside `.next/`, the route type cache is stale
(e.g. after moving routes). Delete `.next/` and rebuild.

## Where code goes

```
src/app/           routes only: (marketing)/ (auth)/ (app)/ api/. Thin pages
src/features/<x>/  one product area: UI, hooks; server-only code in <x>/server/
src/components/    UI used across routes: ui/ primitives, layout/ chrome
src/server/        infrastructure only: env, http, auth, rate-limit, crypto, email, supabase
src/lib/           pure helpers with no product knowledge
supabase/migrations/  every DB change, as a new dated file
```

Decide in this order:
1. Is it a URL? Use `app/`.
2. Is it one product area? Use `features/<area>/`.
3. Is it shared UI? Use `components/`.
4. Is it infrastructure? Use `server/`.
5. Is it a pure helper? Use `lib/`.

- Don't recreate `hooks/`, `config/`, or `server/billing/`.
- Route groups `(…)` don't change URLs. Never put non-route files in `app/`.
- Import with the `@/` alias, not `../`.
- When you move or add a folder, update `CODEBASE.md` in the same change.

## Patterns to follow

**API routes** have exactly this shape (see `src/app/api/saved-tenders/route.ts`):

```ts
export const POST = apiHandler('area/name', async (request) => {
  assertSameOrigin(request);                    // every state-changing route
  const { supabase, user } = await requireUser(); // or requireDirector()
  const body = await parseJson(request, schema);  // zod schema, defined above
  // query as the user via `supabase` (RLS applies)
  return NextResponse.json({ ... });
});
```

- Throw `ApiError` / `badRequest()` / `forbidden()` from `@/server/http`.
  Don't build error responses by hand, and never return DB messages or stacks
  to the client.
- Log unexpected failures as `console.error('[api:area/name] what failed', error)`.
  Vercel logs are searched by that prefix.
- Rate-limit anything public or expensive with `enforceRateLimit(key, n, ms)`.

**Validation** uses zod v4 syntax: `z.email()`, `z.url()`, `z.uuid()` (not
`z.string().email()`). Every request body goes through `parseJson`.

**Server-only code** starts with `import 'server-only'`. It covers anything
that touches secrets, the service role, Razorpay or Resend. Read env vars only
through `env()` / `requireEnv('X')` from `@/server/env`, never
`process.env.X!` in new server code. Add new vars to the zod schema there and to
`.env.example`.

**Supabase clients:** pick deliberately.

| Client | Use for |
|---|---|
| `@/server/supabase/server` `createClient()` | Server code acting as the user (RLS). The default |
| `@/server/supabase/admin` `createAdminClient()` | Bypasses RLS. **Only** payment activation. Don't widen its use without asking |
| `@/lib/supabase/client` | Browser: auth flows only in new code (see "Direction" below) |

**Auth:**
- On the server, use `getAuth()` (nullable) or `requireUser()` /
  `requireDirector()` from `@/server/auth`.
- In dashboard client components, use `useDashboardAccess()` and
  `useSubscription()`. These are display-only; the server re-checks.
- Any redirect target taken from a query param goes through `safeRedirectPath()`.

**Money and plans:**
- Prices, plan names and GST come **only** from `@/features/plans/catalog`.
  Never hard-code a price or plan name.
- Limits come from `getActivePlan()` + `planLimit()` in
  `@/features/plans/server/active-plan`, and must be enforced in the API route.
  `<PlanGate>` is UX only.
- Plan IDs are `free | basic | pro | enterprise` (display names Starter /
  Professional / Enterprise).

**User input:**
- In HTML emails, pass it through `escapeHtml()`.
- In PostgREST filter strings (`.or()`, `ilike`), pass it through
  `sanitizeSearchTerm()` / `sanitizeSearchTerms()` from `@/features/tenders/search-terms`.

**Analytics:** add named events in `@/lib/analytics/events`. Don't call
`posthog.capture` ad hoc.

**SEO and public pages:**
- Every public page exports `metadata` with:
  - a `title` without the brand (the root template appends `| TenderPost`)
  - a `description`
  - `alternates: { canonical: '/its-path' }`
- A client-component page gets its metadata from a thin server `page.tsx`
  (see `app/(marketing)/page.tsx`) or a sibling `layout.tsx` (see `contact/`).
- **Never set `canonical` in the root layout.** Every page inherits it.
- Add every new public page to `PAGES` in `app/sitemap.ts`. The sitemap may
  only contain URLs that return 200 to a signed-out visitor.
- Icons, manifest, share images, sitemap and robots are file conventions in
  `app/` (`icon.png`, `apple-icon.png`, `manifest.ts`, `opengraph-image.tsx`,
  `twitter-image.tsx`, `sitemap.ts`, `robots.ts`). Don't hand-write
  `<link>`/`<meta>` tags for them in `<head>`.
- Site-wide copy, keywords and JSON-LD live in `features/marketing/seo.ts`; the
  origin comes from `SITE_URL` in `@/lib/site`.
- Only claim tender sources the scraper actually covers.
- `(auth)` and `(app)` route groups are `noindex` via their layouts.

## Current logic to work within (don't "fix" these by accident)

- **`src/proxy.ts` is Next 16's middleware.**
  - Don't add a `middleware.ts`.
  - It only touches auth on protected prefixes (`/dashboard`, `/make-payment`).
    Calling `getUser()` on public routes silently signs users back in after
    sign-out, which is why it's skipped there.
- **Sign-out must stay a real form POST** (`features/auth/sign-out.ts` →
  `/api/auth/signout`). Safari ignores cookies set on `fetch` responses.
- **After any session change** (sign-in, finishing onboarding), use
  `hardNavigate()` from `@/lib/navigation`, not `router.push`, so server
  components see the new cookies.
- **`profiles.onboarding_completed` holds mixed types.** Always read it via
  `isOnboardingComplete()` (`@/features/onboarding/status`).
- **Paid plans are created only by the `activate_subscription` DB function**,
  called from `features/billing/server/activate.ts`.
  - Never insert or update `user_subscriptions` anywhere else.
  - Never trust plan, amount or user from the browser; they come from the
    Razorpay order notes.
  - Activation must stay idempotent: the browser callback and the webhook both
    run it.
- **The webhook verifies the raw body.** Read `request.text()` before
  parsing, and don't wrap it in `parseJson`.
- **The `tenders` table belongs to the Render scraper (separate repo).**
  - Read-only from here, and only for signed-in users.
  - Anonymous visitors get only `active_tender_count()`.
  - Changing selected columns? Check `SELECT_FIELDS` in `app/api/tenders/route.ts`.
- **GST numbers** are encrypted with `encryptField()` into
  `profiles.gst_number_enc`. Never store or return plaintext GST.
- **Rate limiting is in-memory per instance.** It's best effort; don't rely
  on it for hard quotas.
- **Database changes are manual.**
  - Add a new file in `supabase/migrations/`; never edit one that has been
    applied.
  - Code that needs a migration must not deploy before it's applied. Say so
    explicitly in your summary.
  - Core tables (`tenders`, `profiles`, `user_subscriptions`,
    `subscription_plans`, `user_preferences`, `alert_preferences`) are **not**
    in migrations yet, so check real columns before relying on them.
  - Query results are hand-typed (no generated types yet).
- **`react-hooks/set-state-in-effect`** lint errors on data-fetching effects.
  Existing code disables it with a comment. In new code, prefer server
  fetching instead.

## Direction for new code (existing code is being migrated toward this)

- **Server Components by default.** Add `'use client'` only on the interactive
  leaf, not on whole pages.
- **Reads** happen in Server Components (or the dashboard layout).
  **Writes** go through Server Actions or API routes with zod plus
  `requireUser()`. **No new direct browser writes to Supabase tables**: settings
  and alerts do this today and are legacy.
- **One cached auth lookup per request:** wrap shared server lookups in React
  `cache()` rather than calling `getAuth()` repeatedly.
- **Keep files under ~300 lines.** Split big pages into
  `features/<area>/components/`. Don't grow `search/page.tsx` (~1,270 lines) or
  `OnboardingClient.tsx` (~1,420); extract from them instead.
- **No placeholder routes.** Upcoming features are "coming soon" entries in the
  nav config, not 21-line pages.
- **No new dependencies without a clear need.**
  - Animation: framer-motion only (gsap is being removed).
  - Icons: lucide-react.
  - UI primitives: shadcn into `components/ui/`.
- **No `alert()` / `confirm()` in new UI.** Show errors inline.
- **Fonts:** don't add more `next/font` families to `app/layout.tsx`.
- **Deduplicate fetches.** The tender count is fetched by Header, Hero and the
  landing page separately. Don't add a fourth caller; lift it to one place.

## Working rules

- Work on a branch; `main` deploys to production.
- Commit messages say what changed and why. No more "new" or "fixes".
- Before finishing:
  - `npm run check` passes.
  - Report anything that needs a manual step: a migration, an env var on
    Vercel, Razorpay or Resend dashboard config.
- Ask before:
  - touching the database directly
  - changing billing or activation logic
  - widening service-role usage
  - deleting routes

## Status (update as it changes)

- 2026-11-17: production Supabase is **missing
  `20261103000000_security_hardening.sql`**. `/api/tender-stats` returns 500
  and payment activation can't work until it's applied (see README "Deploying
  these changes"). Confirm the scraper uses the service-role key first.
- `docs/` is stale (claims Next 15, Zustand, "TenderHub"). Trust code,
  README and CODEBASE.md over it.
