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
npm run dev
```

Open **http://localhost:3000**. There are no environment variables to set.

### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build — prerenders all 23 routes |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint across the project |

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
/classic                Parked replica of the original site
```

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

The build is a **static export** — `npm run build` writes plain HTML to `out/`,
and the Vercel project is configured to publish that directory.

```bash
npm run build   # writes out/
npx serve out   # preview it locally
```

To switch to Vercel's native Next.js runtime instead — which restores
`next/image` optimisation — set **Framework Preset** to *Next.js* and clear the
**Output Directory** override in the project settings, then remove `output` and
`images.unoptimized` from `next.config.ts`. Changing one without the other
breaks the deploy.

---

<div align="center">

**Lecce 28** · Cruelty-free · Over 98% natural · Free shipping over $100

[support@lecce28.com](mailto:support@lecce28.com) ·
[Instagram](https://www.instagram.com/lecce28_skincare/) ·
[Facebook](https://www.facebook.com/lecce28)

</div>
