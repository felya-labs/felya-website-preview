# Cinematic homepage hero — Preview v1

Based on canonical Stage `origin/main` **edbd81b786510a179ef21445461712019fe9c371** (successful Main workflow run 37420506786). Feature branch: `feat/cinematic-hero-preview-v1`.

`HeroShowcase.astro` wraps the unchanged `HeroSection.astro` and the new cinematic composition. The original hero remains the sizing reference, including responsive geometry, images, globe drag, headline languages, glove lighting and theme wipe. Both alternatives share 48px arrow buttons at the bottom right. There is no automatic variant rotation, persistence, swipe interception or page reload. Hidden content is inert, aria-hidden and visually hidden; the old layout remains measurable. Its CSS animations, headline timers and globe renderer pause while inactive.

Normal navigation starts with the film. Compare directly with `/en/?hero=cinematic` and `/en/?hero=classic` (the same query works for all locale routes). The headline deliberately retains the exact English brand statement, with `lang="en"`. Supporting copy and controls use the existing 13 locale dictionaries.

The cinematic section stays black in both themes. A context attribute on the existing header provides light navigation, logo and controls while it overlaps the active film hero, reverting on variant change or scrolling past it. The global theme remains authoritative. The original live theme wipe remains on the classic hero; cinematic changes the surrounding page's theme without a film wipe.

## Media

Unchanged B2 exports from the cinematic experiment: C02 frames 2530–2630 (exclusive end) followed by C04 frames 2886–3017, 231 frames, 30fps, 7.7s. H.264 High, BT.709, no audio, faststart, intentional visible film cuts. There was no new edit, grading, reversal, interpolation or seamless-loop search. The selected C02 frame 55 is the poster. Full provenance, export parameters, byte counts and verified SHA-256 hashes: `cinematic-hero-media.json`.

Only the copied runtime assets under `public/assets/video/cinematic-hero/` ship: desktop 931650 bytes, mobile 506827 bytes and poster 76038 bytes. One video source is selected at initial viewport width (720px breakpoint) and kept across resize. `object-fit: contain` preserves the entire exported canvas, capped at 850 CSS pixels wide on desktop. Narrow outer feathering and frame-synchronized C04 padding feathering follow the approved B2 integration; hardware is unchanged.

Visible muted inline autoplay uses native video. Play/Pause preserves conscious pause across scroll, tab visibility, variant changes and bfcache. Inactive/out-of-view video is paused and video-frame callbacks stop. Reduced Motion starts with the poster without assigning an MP4 URL; Play remains available. Autoplay denial or media failure retains the same poster. Initial first-party cinematic autoplay is documented in the README, dependency inventory and privacy text; the separate prototype film keeps its click-to-load behavior.

## Verification

Run with pinned Bun 1.3.14:

```sh
bun install --frozen-lockfile
SITE_URL=https://preview.felya.com bun run verify
node scripts/verify-cinematic-hero-lifecycle.mjs
git diff --check
```

Full verification passed: references, logo geometry, all 13 × 116 translation keys, static build, localized routes/metadata/legal/search output. JS syntax checks and asset SHA-256 checks passed. The original HeroSection and global stylesheet are unchanged in this patch. No new runtime dependencies or external requests were introduced.

Actually checked in the macOS Codex In-app Browser: 1440×900, 1920×1080, 390×844, 430×932, cinematic and classic layouts, desktop/mobile source selection, silent playback, native previous/next buttons and Enter, visible keyboard focus, stable viewport-height geometry and unchanged scroll position with native input, explicit pause surviving scroll out/back and variant return, contextual header, both website themes, classic globe drag/headline activation/glove keyboard toggle and animated theme wipe. The source frame contact sheet covers the complete cut, preserving finger/mechanism framing; native playback was inspected across repeated cuts. Screenshots were inspected for both alternatives at desktop/mobile sizes. All 13 locale routes were additionally inspected at 390×844: no horizontal overflow or overlap between translated playback buttons and arrows (smallest measured gap 11px). Following sections retain their existing source and layout.

Simulations, not native OS/device claims: `?heroMotion=reduce` and `?heroAutoplay=blocked` exercise poster/start fallbacks in the real browser. The Node lifecycle fixture also exercises actual media-query matches, hidden/visible document events, pagehide/pageshow, media profile selection, explicit pause and delayed autoplay completion. Switching native browser panels left document.visibilityState at visible, so it did not test a true background-tab pause. Real OS Reduced Motion, real background-tab visibility and physical iOS/Android touch behavior are not verified. Mobile viewport sizing and native pointer clicks do not substitute for physical touch testing.

## Publication and rollback

Stage Main is the production source and must not be pushed for this task. The feature commit is applied selectively to a separate integration branch/worktree from current `origin/preview`, preserving independent Preview changes. A normal fast-forward push to Stage `preview` invokes `.github/workflows/publish-preview.yml`; it verifies the source and commits a sanitized snapshot to `felya-website-preview/main`, whose existing Pages workflow deploys it. No force push, manual snapshot replacement or experiment-branch merge is used.

The current Preview workflow preserves `public/canvas/`, mirror workflows, README and CNAME, excludes private/source-only and output directories, serializes publication, and verifies all Canvas shared-asset hashes. All 17 existing shared assets match the proposed feature assets. The Pages Canvas preservation guard is retained. Remote states are rechecked before the Preview push. Only intentional feature files are staged.

For a comparison, use `?hero=classic` or either arrow. To roll back the default integration, revert the integration commit on Stage `preview` through this same workflow; leave Main and the public production mirror untouched.
