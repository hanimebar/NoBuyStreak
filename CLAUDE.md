# NoBuyStreak — CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## What It Is

**NoBuy Streak** is a gamified streak tracker for the No Buy / underconsumption movement. Users set custom No Buy rules, check in daily, log temptations, and download shareable cards showing their streak. The app turns spending restraint into a streak, a score, and a source of community pride.

- Target user: Women 22–35 on r/nobuy and TikTok "underconsumption core" — already doing this manually in Notes apps and spreadsheets
- Domain target: `nobuystreak.com` (fallbacks: `nobuyapp.com`, `mynobuy.com`)
- Git branch: `main`
- Hosting: Vercel

---

## Commands

```bash
npm run dev    # Dev server on localhost:3000
npm run build  # Production build — validates types + catches runtime errors
npm run lint   # ESLint only
```

No test suite. Validate all changes with `npm run build`.

---

## MVP Scope

### IN (v1)
- Email + Google OAuth auth (Supabase Auth)
- Create No Buy rules: name, category, optional daily spend estimate for money-saved calc
- Daily check-in per rule: "Held today" / "I slipped" — one tap, idempotent
- Streak counter per rule: current streak + longest streak
- Temptation log: item name, category, estimated cost, trigger source, outcome (resisted/slipped)
- Shareable PNG card: server-generated, shows streak count + money saved + rule name + branding
- Stripe billing: €6/month or €39/year (Pro plan)
- Free tier: 1 rule, 30-day streaks, no card download
- Pro tier: unlimited rules, shareable cards, 30-day lookback email
- 30-day lookback Vercel cron: weekly email resurfaces temptations logged ~30 days ago
- Settings: edit rule, delete rule, Stripe billing portal

### OUT of v1 (explicitly — do not build these)
- Streak partners / social features
- Push notifications / PWA
- Monthly AI insights
- Bank/spending import
- Community feed or leaderboard
- Reddit/TikTok OAuth direct sharing (PNG download is enough)
- Custom streak freeze / grace days

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Supabase Auth (email + Google OAuth) |
| Database | Supabase Postgres + RLS |
| Payments | Stripe (Checkout + Webhooks + Portal) |
| Email | Resend |
| Card generation | Satori + `@resvg/resvg-js` (server-side PNG) |
| Hosting | Vercel |
| AI | None in v1. Claude API (`claude-haiku-3-5`) in v2 for monthly insights only |

---

## Architecture

### Request Flow

1. User signs up → Postgres trigger creates `profiles` row automatically
2. Onboarding: create first rule + capture browser timezone → stored on `profiles.timezone`
3. Dashboard loads rules via server component (anon Supabase client, RLS enforced)
4. Daily check-in → POST `/api/checkins` → service role client writes check-in → streak recalculation runs → updates `rules.current_streak` + `rules.longest_streak`
5. Temptation log → POST `/api/temptations` → service role client writes row
6. Shareable card → GET `/api/card/[ruleId]` → reads rule + streak → Satori renders JSX → resvg converts to PNG → returned as `image/png`
7. Upgrade → POST `/api/checkout` → Stripe Checkout session → webhook `/api/webhooks/stripe` sets `profiles.is_pro = true`
8. Weekly cron (Sunday 08:00 UTC) → GET `/api/cron/lookback` → queries temptations ~30 days old → Resend email per user → marks `acknowledged = true`

### Supabase Client Pattern

| Client | File | Use for |
|--------|------|---------|
| `createClient()` | `src/lib/supabase/server.ts` | Auth reads, respects RLS |
| `createServiceClient()` | `src/lib/supabase/server.ts` | All writes, bypasses RLS |
| `createClient()` | `src/lib/supabase/client.ts` | Browser-only reads |

`src/middleware.ts` refreshes the Supabase session cookie on every request.

### Streak Recalculation Logic

Critical: bugs here silently reset users' streaks and cause churn.

- `checked_date` stored in `checkins` is the date in the **user's local timezone** — not UTC
- To get the correct date: `new Date().toLocaleDateString('en-CA', { timeZone: userTimezone })` → returns `YYYY-MM-DD`
- Current streak: walk backwards from today (or yesterday if today has no check-in) — count consecutive `held = true` days
- Longest streak: max run of consecutive `held = true` days across all time
- If today has no check-in yet, streak anchors on yesterday
- One check-in per rule per calendar date enforced by `UNIQUE(rule_id, checked_date)` constraint
- Write `current_streak`, `longest_streak`, `last_checkin_at` back to `rules` row after every check-in

Test edge cases: user checks in at 11:59pm their time, UTC+14 timezone, exactly one missed day.

### Card Generation

- Route: GET `/api/card/[ruleId]`
- **Must have `export const runtime = "nodejs"`** — `@resvg/resvg-js` is a native binary, fails on Edge runtime
- Auth-gated (Pro only) — check `profiles.is_pro` before generating
- Card design: dark background, rule name, streak number large, "days strong", estimated money saved, NoBuy Streak branding
- Fallback if resvg fails at deploy: client-side `html-to-image` as emergency fallback (lower quality but unblocks launch)
- Test on Vercel preview deployment early — this is the highest-probability deployment blocker

### Stripe

- `src/lib/stripe.ts` exports `getStripe()` (lazy singleton) and `PLANS` constant
- Stripe API version: `"2026-01-28.clover"`
- Webhook events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- Idempotency: check if `stripe_subscription_id` already set before updating; log all events to `webhook_events` table
- `client_reference_id` on Checkout session = Supabase user ID (join key for webhook)
- Tier stored on `profiles.is_pro` (boolean); `stripe_customer_id` and `stripe_subscription_id` also stored

### Cron Job

`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/lookback",
      "schedule": "0 8 * * 0"
    }
  ]
}
```

Route is GET, protected by `Authorization: Bearer CRON_SECRET` header check.
Queries `temptation_logs` where `logged_at` is 28–35 days ago and `acknowledged = false`.
Sends one Resend email per user, then sets `acknowledged = true` in bulk.

---

## Database Schema

Run in Supabase SQL editor to initialise (`supabase/schema.sql`).

```sql
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
```

### Indexes
```sql
create index on checkins(rule_id, checked_date);
create index on temptation_logs(user_id, logged_at);
create index on temptation_logs(logged_at, acknowledged);
```

### Postgres Trigger (auto-create profile on signup)
```sql
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
```

### RLS Policies
```sql
-- profiles
alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- rules
alter table rules enable row level security;
create policy "Users manage own rules" on rules using (auth.uid() = user_id);

-- checkins
alter table checkins enable row level security;
create policy "Users manage own checkins" on checkins using (auth.uid() = user_id);

-- temptation_logs
alter table temptation_logs enable row level security;
create policy "Users manage own temptations" on temptation_logs using (auth.uid() = user_id);

-- webhook_events: no RLS needed (service role only)
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | Shared types: `Rule`, `Checkin`, `TemptationLog`, `Profile`, category enums |
| `src/app/api/checkins/route.ts` | POST check-in + streak recalculation |
| `src/app/api/card/[ruleId]/route.ts` | GET shareable PNG card (Satori + resvg) |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/app/api/cron/lookback/route.ts` | Weekly 30-day temptation lookback email |
| `src/lib/supabase/server.ts` | `createClient()` + `createServiceClient()` |
| `src/lib/stripe.ts` | Lazy Stripe singleton + `PLANS` constant |
| `src/lib/streak.ts` | Pure streak recalculation function (timezone-aware) |
| `src/middleware.ts` | Supabase session refresh on every request |
| `src/components/CheckInButton.tsx` | "Held today" / "I slipped" — client component |
| `src/components/StreakCard.tsx` | Satori JSX component for card design |
| `vercel.json` | Cron job definition |
| `supabase/schema.sql` | Full DB schema — run in Supabase SQL editor |

---

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero, features, pricing, social proof |
| `/login` | Email + Google OAuth |
| `/auth/callback` | Supabase OAuth callback |
| `/onboarding` | Post-signup: create first rule + capture timezone |
| `/app/dashboard` | Rules list, streak counters, check-in buttons |
| `/app/rules/new` | Create new rule (Pro gate beyond 1) |
| `/app/rules/[id]` | Rule detail: check-in history, temptation log, card download |
| `/app/temptations/new` | Log a temptation |
| `/app/settings` | Edit profile, manage subscription (Stripe portal) |
| `/pricing` | Pricing page (accessible without auth) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://nobuystreak.com
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_MONTHLY_PRICE_ID
STRIPE_ANNUAL_PRICE_ID
RESEND_API_KEY
CRON_SECRET
```

---

## Conventions

- All API routes: `export const runtime = "nodejs"`
- Pages fetching Supabase at request time: `export const dynamic = "force-dynamic"`
- `@/*` resolves to `./src/*`
- `useSearchParams()` requires a `<Suspense>` boundary
- Resend: lazily initialised, never at module scope
- Card generation route: MUST be `runtime = "nodejs"` — resvg native binary fails on Edge
- Timezone: always use `profiles.timezone` for date calculations, never assume UTC for user-facing dates

---

## Pricing

| Tier | Price | Features |
|------|-------|---------|
| Free | €0 | 1 rule, streak tracking, temptation log, no card download |
| Pro | €6/month or €39/year | Unlimited rules, shareable PNG cards, 30-day lookback email |

**Revenue path to €12k/month:** ~2,000 Pro users × €6, or mix of monthly + annual.

---

## Build Sequence (43h total)

1. `npx create-next-app@latest` — TypeScript, Tailwind, App Router, `src/` dir, `@/*` alias
2. Install deps: `@supabase/ssr`, `stripe`, `resend`, `satori`, `@resvg/resvg-js`, shadcn/ui init
3. Supabase schema (`supabase/schema.sql`) — run in dashboard
4. Auth: login page, callback route, middleware
5. Onboarding: first rule form + timezone capture
6. Dashboard: rules list + streak display
7. Check-in API + streak recalculation (`src/lib/streak.ts`)
8. Temptation log form + list
9. Stripe: checkout, webhook, portal
10. Free tier gating (server-side, rule creation API)
11. Shareable card (Satori → resvg → PNG) — test on Vercel preview deploy immediately
12. 30-day lookback cron + Resend email
13. Landing page
14. Settings page

---

## Go-To-Market: First 10 Customers

1. **r/nobuy post** — lead with the personal story ("I kept my streak in Notes and lost it"), not "I built X"
2. **r/financialindependence + r/UKPersonalFinance** — spending discipline angle
3. **TikTok comment drop** on "no buy 2026" / "underconsumption core" videos (20–30 videos)
4. **DM 10 micro-creators** (5k–50k followers) — free Pro lifetime for honest mention
5. **ProductHunt launch** after 5 real users — card generation GIF is the hero demo

---

## Known Risks

1. **`@resvg/resvg-js` on Vercel** — test early on preview deploy. Fallback: client-side `html-to-image`
2. **Timezone streak bugs** — use `Intl.DateTimeFormat` for date, not UTC. Write pure function + test edge cases
3. **Stripe webhook idempotency** — `webhook_events` table with Stripe event ID as PK prevents double-processing
4. **GDPR** — "Delete my account" must cascade-delete all user data. Build from day one.
5. **Free tier abuse** — acceptable in v1, do not over-engineer

---

## Post-Launch v2 Priorities

1. Streak partners (social accountability — most requested feature in every habit tracker)
2. PWA + Web Push daily check-in reminder
3. Monthly insights email (SQL aggregates first, Claude API for narrative in v3)
4. Annual plan upsell email at day 30 for monthly subscribers
