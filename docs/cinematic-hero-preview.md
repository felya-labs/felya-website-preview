# Film hero — Preview (Phase 2)

State 2026-11-12, branch `redesign/liquid-glass-phase1`, published to preview.felya.com only. felya.com (`main`) is unchanged.

## What it is

The homepage has two heroes: the **film hero** (default) and the **globe hero** (the original `HeroSection.astro`,
unchanged). `HeroShowcase.astro` holds both.

- **Style:** the film hero follows the rest of the site — theme background (Liquid Stage / Pro Night), section kicker,
  the classic hero's title scale, CTA pair, and the film in a dark rounded frame like the prototype film. It replaces
  the Phase 1 black, full-width composition that came from an earlier AI study and did not match the site.
- **Claim:** "Feel what the robot touches." (`hero.filmClaim`, 13 locales). The globe hero keeps "Your hands. Anywhere
  on Earth." — reach vs. touch, no duplicate. Alternatives under review: "The human hand, extended." · "Every
  movement. Every touch." · "Built to be felt." Change the claim in `src/i18n/translations.ts`.
- **Film:** one 14.5 s sequence cut from S01 — side silhouette (C06) → macro joints (C03) → product presence (C02) →
  gesture (C09), hard cuts, looped. Desktop 1280×720 (no upscaling), mobile 640×640 with a crop per shot. Provenance,
  hashes and the reproducible export in `docs/cinematic-hero-media.json` and `scripts/export-film-hero-sequence.py`.
  No other PATON footage exists in the repositories (searched 2026-11-12; `ume-exo` is a third-party project).
- **Switching:** a horizontal swipe animation (780 ms). Arrows at the edges appear only while a mouse is over the
  hero (and on keyboard focus); they stay clickable while invisible. Touch screens: swipe sideways on the hero (not
  on the globe, which keeps its own drag) and two dots at the bottom; with a mouse the dots appear with the arrows.
- **Pause:** a small glass lens in the film's corner with the progress as a ring; it shows on hover, focus, when
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
transforms, arrows on hover, pause lens with WebGL active, touch swipe vs. vertical scroll, mobile media selection,
no horizontal overflow. Not checked: Safari, Firefox, real iOS/Android devices, real Reduced Transparency.
