# Film hero — Preview (Phase 2)

State 2026-11-12, branch `redesign/liquid-glass-phase1`, published to preview.felya.com only. felya.com (`main`) is unchanged.

## What it is

The homepage has two heroes: the **film hero** (default) and the **globe hero** (the original `HeroSection.astro`,
unchanged). `HeroShowcase.astro` holds both.

- **Style:** the film hero is dark in both themes so the film belongs to the hero: a large film stage on the right
  (full hero height, feathered into the dark towards the headline), the headline in the site's own type on the left.
  The theme shows in the header: frosted white glass over the film in Light Mode, smoked glass in Dark Mode
  (`data-over-film`). Phones: headline on top, the film edge to edge below it.
- **Claim:** "Feel what the robot touches." (`hero.filmClaim`, 13 locales). The globe hero keeps "Your hands. Anywhere
  on Earth." — reach vs. touch, no duplicate. Alternatives under review: "The human hand, extended." · "Every
  movement. Every touch." · "Built to be felt." Change the claim in `src/i18n/translations.ts`.
- **Film:** one 14.5 s sequence cut from S01 — side silhouette (C06) → macro joints (C03) → product presence (C02) →
  gesture (C09), hard cuts, looped. Desktop 1280×720 (no upscaling), mobile 640×640 with a crop per shot. Provenance,
  hashes and the reproducible export in `docs/cinematic-hero-media.json` and `scripts/export-film-hero-sequence.py`.
  No other PATON footage exists in the repositories (searched 2026-11-12; `ume-exo` is a third-party project).
- **Switching:** a horizontal swipe animation (780 ms) via one small glass capsule at the bottom centre — ‹ line · dot ›
  (arrows and dots); touch screens can also swipe sideways on the hero (not on the globe, which keeps its drag).
  Side arrows were tried and removed: they looked like they covered content.
- **Pause:** a small glass lens over the film (bottom right) with the progress as a ring; it shows on hover, focus, when
  paused, and always on touch screens. Over the film it is real Liquid Glass (WebGL refraction of the film,
  `src/scripts/hero-glass.js`), elsewhere CSS glass.
- **Which hero first:** `heroShowcase` in `src/scripts/site-config.js`: `?hero=` → the visitor's own choice
  (remembered after a click) → data saver starts with the globe → default film.

## Verification

```sh
bun install --frozen-lockfile
SITE_URL=https://preview.felya.com bun run verify
node scripts/verify-cinematic-hero-lifecycle.mjs
```

Checked in the in-app browser at 1440×900 (light and dark) and 390×844: swipe in both directions with measured
transforms, the bottom switch, constant 48 px header height while scrolling, pause lens with WebGL active, touch swipe vs. vertical scroll, mobile media selection,
no horizontal overflow. Not checked: Safari, Firefox, real iOS/Android devices, real Reduced Transparency.
