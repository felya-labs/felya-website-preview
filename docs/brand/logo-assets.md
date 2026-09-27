# FELYA website logo assets

## Status

Current as of 2026-09-27. This V4 set supersedes the former V2/N025 website
logo implementation.

## Authoritative supplied sources

The user supplied six RGB PNG files. None contains alpha or vector data; no
PDF source was part of this handoff. Each black/white pair is a pixel-exact
inverse, so both colors encode identical geometry.

| Source | Variant | Canvas | SHA-256 |
| --- | --- | --- | --- |
| `V4_Pyra_black.png` | mark, positive | 1200 × 1200 | `fe06d1ec16fd9952a47bbe2685afa817e2915860f6d51a02c699acfeaca59368` |
| `V4_Pyra_white.png` | mark, negative | 1200 × 1200 | `6a6c0e4ef33c7811af1b2380cfad350c1a11240702f53a589e605654f40b0e1e` |
| `V4_Pyra+FELYA_black_horizontal.png` | horizontal lockup, positive | 1800 × 1200 | `84ac38ae9ebe73c52584d2ff4a3edde6d6823ee303ecd8c3b7f7c53e9672673d` |
| `V4_Pyra+FELYA_white_horizontal.png` | horizontal lockup, negative | 1800 × 1200 | `fb1b8fd301869502acae06c989c02020af0a7d19230db66ac2fff22cbb19f68d` |
| `V4_Pyra+FELYA_black_vertikal.png` | stacked lockup, positive | 1200 × 1200 | `8135340a95e550d52b4c74c9a06aac97bd3af1a6c5bfee83a3c2bcfafae43219` |
| `V4_Pyra+FELYA_white_vertikal.png` | stacked lockup, negative | 1200 × 1200 | `d90090646b72a81a81f77d915e1c8f766cac630f10cf1966fb8ad649280e7efd` |

The repository keeps these originals under
`assets-source/brand/source/logo-v4/`. That directory is excluded from the
sanitized public preview snapshot.

## Web preparation

The uniform white or black canvas was removed without changing the supplied
silhouette. Transparent PNG exports preserve the original antialiasing. Since
no vector data was available, SVG exports were traced from the 1200/1800 px
source masks with Potrace 2.1.8 using threshold 128, `turdSize` 2,
`alphaMax` 1, curve optimization enabled, and tolerance 0.05. The export adds
two transparent pixels around the detected artwork and uses tight viewBoxes.

Current assets in `public/assets/images/brand/felya-logo/`:

- `felya-mark-{black,white}.{svg,png}` — 439 × 562
- `felya-logo-horizontal-{black,white}.{svg,png}` — 879 × 284
- `felya-logo-vertical-{black,white}.{svg,png}` — 390 × 373

All SVGs contain one monochrome path, no embedded raster, filter, style, font,
script, or background.

## Website usage

- Header and footer use the horizontal lockup because it is the supplied
  composition suited to their compact horizontal layout.
- Light mode uses the black positive SVG; dark mode uses the supplied white
  negative geometry without the former N025 compensation.
- The stacked lockup is an official available asset but is not forced into the
  existing footer layout.
- Favicons use only the black V4 mark on the existing white continuous-corner
  surface. The Apple and maskable variants remain opaque white as required by
  their platform treatment.
- JSON-LD continues to reference
  `/assets/brand/felya-labs-logo-square-512.png`, which is regenerated from the
  V4 mark. The manifest continues to reference the regenerated Android icons.

## Archive

The complete former active logo SVG set, favicon family, public logo exports,
their former masters, V2 designer intermediates, and N025 generator are
retained under `assets-source/brand/archive/2026-09-pre-v4/`. These historical
files are not copied to the public preview snapshot.
