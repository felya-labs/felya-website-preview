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
| Hero controls (Film \| Globe, Play) | `src/styles/cinematic-hero.css` |
| Squish, gliding header selection, compact header, theme disc | `src/scripts/liquid-glass.js` |
| Hero choice and crossfade | `src/scripts/cinematic-hero.js`, policy in `src/scripts/site-config.js` (`heroShowcase`) |

## Differences to Studio

- No refraction: Studio refracts its own 3D stage in WebGL. The website uses CSS frost (`backdrop-filter`) with the
  same tokens. Real refraction over the hero film (we know what lies beneath) is Phase 2.
- Theme switch: within the classic hero the existing live wipe stays (it keeps the globe running); everywhere else
  the new theme spreads from the click as a soft disc (View Transitions, 820 ms).

## Which hero comes first

`heroShowcase` in `src/scripts/site-config.js`, in this order: `?hero=cinematic|classic` (never stored) → the
visitor's own choice from Film | Globe (remembered) → browsers in data-saving mode start with the globe →
`defaultVariant` (film).
