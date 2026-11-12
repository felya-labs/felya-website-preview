# Liquid Glass on felya.com — web rules (Preview, Phase 1)

The website uses the same material as PATON Studio. The binding source is Studio's guideline
(`felya-labs/paton-studio`: `docs/design/liquid-glass.md`, §0 rules in short, §3 layers and plates, §8 motion). This
page records only what the website does differently and where things live. State: 2026-11-12.

## Rules (from Studio, unchanged)

1. Glass only on the functional layer. On the website that is: the header capsule, the hero controls
   (Film | Globe, Play/Pause), the play control over the prototype film, overlays (mobile menu, language dialog).
   Sections, cards, forms and media are content: solid.
2. Never glass on glass. Theme and language toggles inside the header are fills of the header glass, not glass.
   Safety net: `.lg-glass .lg-glass` loses its material.
3. Legibility beats transparency: header ink is full contrast; over the black film the header and hero controls
   switch to dark glass in both themes (`.site-header[data-cinematic-context]`).
4. One light from the top: 0.5 px hairline, 1 px top highlight, faint bottom return (`--glass-edge`).
5. Motion on springs, no idle animation (the old "breathing" play button is gone).
6. Light "Liquid Stage" (`#f4f6fb`), dark "Pro Night" (`#08090e`) — the same values as Studio.
7. Reduced motion, reduced transparency and increased contrast are honoured.

## Where it lives

| What | File |
|---|---|
| Tokens, material, header, overlays, plates, theme reveal, accessibility | `src/styles/liquid-glass.css` (loaded after `global.css`) |
| Film hero, swipe switch, arrows, dots, pause lens | `src/styles/cinematic-hero.css`, `src/components/HeroShowcase.astro` |
| Real refraction over the film (WebGL) | `src/scripts/hero-glass.js` |
| Squish, gliding header selection, compact header, theme disc | `src/scripts/liquid-glass.js` |
| Hero choice and crossfade | `src/scripts/cinematic-hero.js`, policy in `src/scripts/site-config.js` (`heroShowcase`) |

## Header

- One thickness all the time (48 px, like Studio's bars); on scroll it only glides closer to the top edge.
- Glass is round: `corner-shape: round` on every glass surface. global.css sets `corner-shape: squircle` on them, which
  Chrome applies to the background but not to the rim, shadow or frost — the edge doubled at the bar's ends.
- **Adaptive, not themed** (Apple WWDC25 219: small bars "flip between light and dark" with what lies behind them,
  their symbols with them). `initAdaptiveTone` in `liquid-glass.js` reads the backgrounds beneath the bar at three
  points (colours and gradient stops of the elements under it) and sets `data-glass-tone="dark|light"` with
  hysteresis. Dark glass with light ink over the film hero and dark sections, light glass with dark ink over light
  sections — in either page theme. Logo, links and toggles flip with it.

## Real refraction over the film (how, and why this way)

Researched 2026-11-12: kube.io "Liquid Glass in the browser", ObaidQatan/liquid-glass-component-library, Apple WWDC25
219 "Meet Liquid Glass", and PATON Studio's `stage-glass.ts`.

- **SVG displacement in `backdrop-filter: url()`** (kube.io, ObaidQatan's experimental mode) refracts any page content,
  but only in Chromium, and its displacement maps are static images rebuilt on every size change. ObaidQatan
  recommends plain frosted glass for production. Not used.
- **WebGL over content we know** (PATON Studio): where we know what lies beneath, we draw it ourselves under each glass
  rect, every frame — in every browser, live while the film plays and the page scrolls. Used for the film hero:
  `hero-glass.js` paints one canvas over the hero; the header bar (while it lies completely over the hero), the
  switch capsule and the pause lens become lenses (`data-lens`: the element keeps only a breath of tint, its edge
  and content). Elsewhere: CSS frost with the same tokens.
- Shader as in Studio: squircle rim, Snell n 1.0 → 1.5 normalised so the peak shift equals the thickness, lens zoom
  for small glass, frost lighter at the rim, detail layer (thin bars stay crisp), vibrancy, luminosity adjusted to the
  glass tone, lens shading, colour picked up from just outside the edge, glint and bezel glow from one top-left
  light, specular saturation. Glass materialises on a spring (lensing, frost and light grow from zero).
- **Scroll edge effect** (Apple): the film runs up under the bar; the headline dissolves over the last 40 px before
  the bar and is then under the glass, never shown through it unrefracted.
- Browsers pause `requestAnimationFrame` in background tabs; until the first frame the bar shows its CSS glass.

## Differences to Studio

- Theme switch: within the classic hero the existing live wipe stays (it keeps the globe running); everywhere else
  the new theme spreads from the click as a soft disc (View Transitions, 820 ms).

## Which hero comes first

`heroShowcase` in `src/scripts/site-config.js`, in this order: `?hero=cinematic|classic` (never stored) → the
visitor's own choice from Film | Globe (remembered) → browsers in data-saving mode start with the globe →
`defaultVariant` (film).
