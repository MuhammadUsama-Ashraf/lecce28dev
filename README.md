<div align="center">

# LECCE **28**

### Elevate your beauty. Embrace your wellness.

A luxury body-care storefront built with Next.js, Tailwind and real-time WebGL —
where the product bottles are modelled in 3D and you can spin them with your cursor.

`Next.js 16` · `React 19` · `TypeScript` · `Tailwind v4` · `three.js`

</div>

---

## Overview

Lecce 28 is a luxury beauty brand built on naturally derived formulas that drive
ingredient education and awareness. This repository holds its storefront: eight
products with full INCI ingredient decks, an editorial journal, and a shopping
cart — wrapped in an editorial design system and an interactive 3D product viewer.

The site ships **two front ends** from one codebase and one content source:

| | Route | What it is |
|---|---|---|
| **Current** | `/` | The editorial design — full-bleed hero, oversized wordmark, product rails, floating value cards |
| **Parked** | `/classic` | A faithful replica of the original lecce28.com home page, kept for reference |

Both share the same product data, cart and inner pages, so nothing has to be
maintained twice.

---

## Highlights

**Real 3D, not renders.** Every bottle and jar is generated at runtime from lathe
geometry — amber glass with physical transmission, a black pump cap, and a cream
label drawn to a canvas texture so it carries the actual product typography
(`LECCE 28 / CHAMOMILE & OLIVE OIL / BODY WASH / FUMO DI COCCO / 16 fl. oz.`).
No model files, no external HDR maps.

**It degrades gracefully.** Scenes mount only when they scroll near the viewport,
and never when the device asks for reduced motion or lacks WebGL — the studio
photograph takes over instead.

**One source of truth.** Products, copy, FAQs, policies and journal entries all
live in `src/content/`. Change a price once and it updates the grid, the product
page, the cart and the bundle cards.

**Cart that survives a refresh.** React context plus `localStorage`, with a slide-over
drawer, quantity controls and a free-shipping threshold.

**Every page is prerendered.** 23 static routes, no server required.

---

## Getting started

```bash
git clone https://github.com/Hatch-Social-Inc/lecce28.git
cd lecce28
npm install
cp .env.example .env.local     # then fill in the values below
npm run db:migrate             # creates the tables
npm run db:seed                # imports the catalogue and the first owner
npm run dev
```

Open **http://localhost:3000** for the store and **/admin** for the back office.

### Environment

`.env.local` drives development; the same keys live in the Vercel project for
production. Development and production must point at **different** databases.

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Neon **pooled** connection — what the app queries through |
| `DIRECT_URL` | Neon **direct** connection — migrations only, pgbouncer cannot hold their locks |
| `SESSION_SECRET` | 32+ random bytes signing the admin session cookie |
| `STRIPE_SECRET_KEY` | Test key locally, live key in production |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` locally, from the dashboard in production |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob, for product image uploads |
| `NEXT_PUBLIC_SITE_URL` | Absolute origin used for Stripe redirects |

### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Generates the Prisma client, then builds |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint across the project |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Import the catalogue, settings and first owner |
| `npm run db:studio` | Prisma Studio, a table browser |
| `npm run db:reset` | Drop, re-migrate and re-seed the development database |

Requires Node 20 or newer (developed on 22).

---

## Routes

```
/                       Home — editorial design
/shop                   All eight products
/product/[slug]         Product detail with the 3D viewer
/about-us               Brand principles and founder story
/blogs                  Journal index
/blogs/[slug]           Journal entry
/contact-us             Enquiry form and opening hours
/faqs                   Questions, delivery table, returns
/privacy-policy         Privacy policy
/terms-conditions       Terms and conditions
/checkout/success       Order confirmation after Stripe
/classic                Parked replica of the original site

/admin                  Overview — revenue, recent orders, low stock
/admin/orders           Every order, filterable, searchable
/admin/orders/[id]      One order: items, addresses, status, notes, history
/admin/products         Catalogue
/admin/products/[id]    Product editor with image uploads
/admin/promo-codes      Codes customers type at checkout
/admin/sales            Scheduled markdowns, storewide or per product
/admin/settings         Shipping, tax and order numbering
/admin/staff            People and roles (owner only)

/api/cart/quote         Server-side pricing for the bag
/api/checkout           Creates the pending order and the Stripe session
/api/webhooks/stripe    The only thing that marks an order paid
```

---

## The store backend

**Postgres (Neon) · Prisma · Stripe Checkout · Vercel Blob**

Every amount is stored and calculated in integer cents. The browser only ever
sends slugs and quantities — prices, sale markdowns, promo discounts, shipping
and tax are all recomputed server-side in `src/lib/pricing.ts` before anything
reaches Stripe, so a tampered cart cannot change a total.

**Orders** are written as `PENDING` when checkout opens and only become `PAID`
when Stripe's signed webhook says so; the success page never marks anything
paid. That same webhook decrements stock and counts the promo redemption, and
it is idempotent, because Stripe retries.

**Discounts** come in two shapes. A *sale* is a scheduled markdown that needs no
customer action and shows a struck-through price; where several cover the same
product the customer gets the lowest result. A *promo code* is typed at
checkout and can carry a minimum subtotal, a redemption cap, a date window and a
product allow-list.

**Roles** — `OWNER` manages people, `ADMIN` runs the store, `STAFF` handles
orders and stock but cannot move prices, publish products, cancel or refund.
Sessions are signed JWTs in an httpOnly cookie (`src/lib/session.ts`), and every
page and action re-checks the user through `src/lib/dal.ts` rather than trusting
the cookie alone — a deactivated account stops working immediately.

**History** — product, promo, sale, order and staff changes are written to an
audit log with who did what, and order history is shown on the order itself.

---

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx              Fonts, cart provider, cart drawer
│  ├─ globals.css             Design tokens + the .organic type scale
│  ├─ (organic)/              The live site — its own header and footer
│  │  ├─ page.tsx             Home
│  │  ├─ shop/  product/  about-us/  blogs/  contact-us/
│  │  └─ faqs/  privacy-policy/  terms-conditions/
│  └─ (classic)/              The parked replica and its original chrome
│     └─ classic/page.tsx
│
├─ components/
│  ├─ three/                  Vessel geometry, label textures, viewers
│  ├─ organic/                Current design system
│  ├─ home/  layout/  ui/     Classic-replica components
│  └─ cart/                   Provider and drawer
│
└─ content/
   ├─ products.ts             Eight products: prices, INCI, directions, specs
   ├─ site.ts                 Nav, copy, testimonials, FAQs, journal
   └─ policies.ts             Privacy and terms
```

Route groups — the parenthesised folders — let the two designs carry different
headers and footers without changing any URLs.

---

## The 3D layer

| Piece | File |
|---|---|
| Bottle and jar geometry, glass material, pump cap | `components/three/Vessel.tsx` |
| Label artwork drawn to a canvas texture | `components/three/label-texture.ts` |
| Drag-to-rotate product viewer | `components/three/ProductViewer.tsx` |
| Lazy mounting and capability checks | `components/three/SceneMount.tsx` |

Lighting is built from drei `Lightformer` rectangles rather than an HDR file, so
the scenes have no network dependency and no loading flash.

---

## Design system

Type scale, colour tokens and the reveal-on-scroll primitive live in
`src/app/globals.css`. The current design's scale is scoped under `.organic`, so
the parked replica keeps its own typography untouched.

```
.t-display     Hero and footer wordmark, uppercase
.t-h2          Section headings, uppercase
.t-h3          Sub-headings
.t-editorial   Italic serif display
.t-stat        Prices and large numerals
.t-nav         Navigation and buttons
.t-label       Card labels
.t-body        Body copy
```

> **A note on fonts.** The reference design uses PP Mori and PP Editorial New,
> both commercial licences. This build substitutes **Schibsted Grotesk** and
> **Instrument Serif Italic** at identical sizes, weights and line-heights. If the
> licensed files are purchased, drop them into `public/fonts/` and swap the two
> declarations in `src/app/layout.tsx` — nothing else changes.

---

## Deployment

Deployed on **Vercel**, which builds from `master` on every push.

The store runs on Vercel's Node runtime — the admin, checkout and the Stripe
webhook all need a server, so there is no static export any more.

**Once per environment:**

1. Add the environment variables above to the Vercel project. Give *Preview* and
   *Development* the development database, *Production* the production one.
2. Run `npm run db:deploy` against the production database to apply migrations,
   then `npm run db:seed` once to create the first owner account.
3. Point a Stripe webhook at `https://<your-domain>/api/webhooks/stripe` for
   `checkout.session.completed`, `checkout.session.expired`,
   `checkout.session.async_payment_succeeded`,
   `checkout.session.async_payment_failed` and `charge.refunded`, then put its
   signing secret in `STRIPE_WEBHOOK_SECRET`.

**Locally**, forward webhooks with the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

<div align="center">

**Lecce 28** · Cruelty-free · Over 98% natural · Free shipping over $100

[support@lecce28.com](mailto:support@lecce28.com) ·
[Instagram](https://www.instagram.com/lecce28_skincare/) ·
[Facebook](https://www.facebook.com/lecce28)

</div>
