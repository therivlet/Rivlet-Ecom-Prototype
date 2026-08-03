---
name: Coord platforms spacing
overview: Keep the current Fabric platforms card runway. Separate it visually from The co-ord (they currently share the same canvas-deep background), tighten the gap between them, and restyle “Learn the platforms” as an editorial text link instead of a ghost button.
todos:
  - id: split-bg
    content: Give platforms cream canvas; keep co-ord on canvas-deep
    status: completed
  - id: tighten-gap
    content: Reduce vertical padding between co-ord and platforms
    status: cancelled
  - id: learn-link
    content: Restyle Learn the platforms as editorial text link
    status: completed
  - id: class-cleanup
    content: Move co-ord home spacing/background to CSS class
    status: completed
isProject: false
---

# Separate co-ord and Fabric platforms

## Problem
On home, **The co-ord** and **Fabric platforms** both use `background: var(--color-canvas-deep)`, so they read as one continuous band. Each also uses full `.section` vertical padding (`--pad-section`), so the gap between them is oversized.

Relevant markup in [`src/pages/home.ts`](src/pages/home.ts):
- Co-ord: `section` with `padding-top:0; background: var(--color-canvas-deep)`
- Platforms: `section.platforms` (also canvas-deep in CSS)

## Keep
- Existing 3-column platform runway / card design (no layout redesign)

## Changes

### 1. Split the visual sessions
In [`src/styles/pages.css`](src/styles/pages.css):
- Keep co-ord on `canvas-deep`
- Set `.platforms` background to the default page canvas (`var(--color-canvas)`), so Fabric platforms is a distinct cream session after co-ord

### 2. Tighten spacing between them
- Co-ord section: keep compact top; reduce bottom padding (class-based, not large inline stack)
- Platforms: reduce top padding when it follows co-ord (e.g. `.platforms` `padding-top: clamp(2rem, 4vw, 3rem)` instead of full `--pad-section`)
- Goal: clear break between bands, without a huge empty strip

### 3. Restyle “Learn the platforms”
In [`src/pages/home.ts`](src/pages/home.ts) + CSS:
- Replace `btn btn--ghost` with an editorial text link (mono / uppercase / underline), aligned with the quieter platform CTAs — not a second primary-looking button next to “Shop all sets”
- Place it as a simple line under the platforms lede (same section head)

### 4. Consistency cleanup
- Move co-ord inline styles (`padding-top`, background) into a small class (e.g. `.coord-home`) so spacing rules live in CSS next to `.platforms`
- Leave platform cards, images, and shop links unchanged

## Files
- [`src/pages/home.ts`](src/pages/home.ts) — section classes + Learn link markup
- [`src/styles/pages.css`](src/styles/pages.css) — backgrounds, padding, link style
