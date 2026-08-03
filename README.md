# Rivlet Ecom Prototype

Premium ecommerce prototype for **Rivlet** - warm editorial shopping experience extending [therivlet.com](https://therivlet.com). Catalog-complete with bag, wishlist, account, live search, and mock checkout.

**Brand line:** *Move like water, feel like air.*

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://127.0.0.1:5173/`).

```bash
npm run build    # production build
npm run preview  # preview the build
```

## What’s included

| Route | Experience |
|-------|------------|
| `/` | Home story - hero, promise, situations, The Edit, platforms, co-ord, trust |
| `/shop/` | Collection PLP - situation / platform / category / colour filters, sort, search `?q=` |
| `/product/?id=` | PDP for all six SKUs - feel → problem → tech → fit → set |
| `/sets/` | Crop + Short co-ord |
| `/stories/` | Fabric platforms & standards |
| `/account/` | Sign in / profile / sign out (prototype auth) |
| `/checkout/` | Mock checkout (no payment) |
| `/confirmation/` | Order confirmation |

## Product experience

- **The Edit** - six women’s pieces (Midnight & Cardamom, XS-2XL)
- **Shop by situation** - Gym, Yoga, Office, Travel, Summer
- **Fabric platforms** - AquaFlow™, SecondSkin™, NeutralCore™
- **Bag & wishlist** - localStorage; guest wishlist; quick add
- **Search** - overlay with live suggestions (`Ctrl/Cmd+K`)
- **Account menu** - hover on desktop; account section in mobile menu
- **Mobile-first** - compact header, filter drawer, safe-area aware

## Stack

- **Vite** + **TypeScript**
- Custom CSS design tokens (no Bootstrap / Kendo)
- Fonts: Cormorant Garamond, Inter, DM Mono
- Brand navy `#0C1E34` · Midnight `#1A1208` · Cardamom `#7A5C3A`

## Project layout

```
src/
  pages/          # route entry scripts
  data/products.ts
  cart.ts / wishlist.ts / auth.ts / search.ts / motion.ts
  ui/shell.ts     # header, footer, drawers, search
  styles/         # tokens, base, components, pages
public/brand/     # mark + wordmark
docs/             # plans, reports, design notes (see docs/README.md)
```

## Documentation

All plans, CRO reports, and design notes are under [`docs/`](./docs/README.md):

- [`docs/design/`](./docs/design/) — brand / experience notes
- [`docs/plans/`](./docs/plans/) — build and feature plans
- [`docs/reports/`](./docs/reports/) — ATC CRO decision report

## Notes

- Prototype only - checkout does not charge.
- Account login accepts any valid email + short password (stored in `localStorage`).
- Competitor scrape dumps and large research assets are not included in this repo.

## Brand

[therivlet.com](https://therivlet.com) · Rivlet
