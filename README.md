# Surf-Store E-Foil — School & Rental

Bilingual (SL/EN) marketing site + booking flow for Duotone e-foil rentals
and lessons at Green Lake, Kidričevo. Built with Next.js 15 (App Router),
TypeScript, Tailwind, next-intl, Drizzle ORM on Neon Postgres, and Resend
for transactional email.

## Stack

- **Next.js 15** App Router + **TypeScript**
- **Tailwind CSS**
- **next-intl** — `sl` (default) + `en`, `/sl/...` and `/en/...` prefixes
- **Neon Postgres** + **Drizzle ORM** (`db/schema.ts`)
- **Resend** for booking confirmations + admin notifications
- **zod** input validation; honeypot + in-memory rate limit on booking POST
- Vitest unit tests for pricing

## Quick start

```bash
pnpm install
cp .env.example .env.local      # fill in DATABASE_URL, RESEND_API_KEY, ADMIN_TOKEN
pnpm db:push                    # create tables on Neon
pnpm db:seed                    # insert the 3 Duotone boards
pnpm dev                        # http://localhost:3000 → redirects to /sl
```

Run tests:

```bash
pnpm test
```

## Environment

| Variable              | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `DATABASE_URL`        | Neon pooled connection string                    |
| `RESEND_API_KEY`      | Resend API key for sending email                 |
| `RESEND_FROM_EMAIL`   | Sender (default `bookings@surf-store.com`)       |
| `ENQUIRY_TO_EMAIL`    | Admin notification target (default `info@…`)     |
| `ADMIN_TOKEN`         | Long random string — gates `/admin` and status POST |
| `NEXT_PUBLIC_SITE_URL`| Public origin for sitemap + canonical            |

## Database

Schema lives in `db/schema.ts`:

- `boards` — rentable e-foil units (price stored as integer cents)
- `bookings` — pending/confirmed/cancelled with `subtotal`, `discount`, `total`
- `blocked_dates` — maintenance days (nullable `board_id` = blocks all)

Commands:

```bash
pnpm db:generate     # create migration from schema diff
pnpm db:push         # push schema directly (dev workflow)
pnpm db:migrate      # apply generated migrations
pnpm db:studio       # open Drizzle Studio
pnpm db:seed         # insert the 3 Duotone boards
```

`db:seed` is idempotent (`onConflictDoUpdate` on `slug`) — safe to re-run.

## Pricing

Pure, fully typed, unit-tested in `lib/pricing.ts`:

1. **1–6 days**: `dailyPrice × n`, then tiered discount
   - 1–2 d → 0%, 3–4 d → 10%, 5–6 d → 15%
2. **7+ days**: `weeklyPrice × weeks` + remainder days at daily rate with the
   tier discount applied to the remainder only
3. **Monotonic clamp**: a booking of N+1 days never costs less than N days.
   The clamp inflates `total` and re-derives `discount` so the breakdown
   stays self-consistent.

Tiers + day count are exported constants — edit `DAY_DISCOUNT_TIERS` in
`lib/pricing.ts` without changing the algorithm. Daily/weekly prices are
per-board columns in the `boards` table, so retail tuning happens in the DB.

## Booking flow

- `GET /api/availability?boardId=&from=&to=` — returns `{ unavailable: string[] }`
  (ISO YYYY-MM-DD). Date picker in `BookingForm` greys these out.
- `POST /api/bookings` — validates with zod, re-checks availability, **recomputes
  the price server-side**, writes a `pending` row, fires Resend emails to the
  customer + admin. Never trusts the client total.

## Admin (v1 stopgap)

Visit `/admin?token=YOUR_ADMIN_TOKEN` once — it sets an `admin_token` cookie
and redirects to `/admin`. From there you can confirm/cancel bookings.
Replace this with Clerk + a real dashboard before opening to staff.

## Deploy

1. Create a Neon project; copy the **pooled** connection string into Vercel
   env as `DATABASE_URL`.
2. Add `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ADMIN_TOKEN`, `NEXT_PUBLIC_SITE_URL`.
3. Push to GitHub, import in Vercel, deploy. Zero-config — no `vercel.json` needed.
4. After first deploy, run `pnpm db:push` locally against the prod `DATABASE_URL`
   (or wire it into a build step).

## What's where

```
app/
  [locale]/                 # all marketing routes, /sl/... and /en/...
    layout.tsx              # <html lang>, fonts, NextIntlClientProvider
    page.tsx                # composes all sections
    components/             # Hero, FeatureBadges, BoardsRow, BookingForm, …
  admin/page.tsx            # token-gated bookings list
  api/
    availability/route.ts
    bookings/route.ts
    bookings/[id]/status/route.ts
  sitemap.ts, robots.ts
db/
  schema.ts, index.ts, seed.ts
lib/
  pricing.ts (+ test), queries.ts, validations.ts, email.ts,
  rate-limit.ts, content.ts
messages/
  sl.json, en.json
i18n/request.ts
middleware.ts
```

## Swapping placeholder assets

Hero + board images are simple SVGs in `/public`. Replace them with real
photos (recommend WebP, ≤300KB each) keeping the same filenames, or update
`boards.imageUrl` in the DB. The booking form will pick up new entries
automatically — no code change needed for adding/removing boards.
