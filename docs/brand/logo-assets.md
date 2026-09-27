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
- The header renders the lockup at 6.12 rem on desktop/laptop and 5.25 rem on
  mobile (about 10% above the former 5.56/4.77 rem settings). A header-only
  `-0.1875rem` vertical correction compensates for the lockup's visual mass.
  Current, +5%, +10%, and +15% scale candidates were compared in both themes;
  +10% improves presence without competing with navigation controls. The
  footer remains at 4.77 rem with no offset.
- The stacked lockup is an official available asset but is not forced into the
  existing footer layout.
- Favicons use the white V4 mark on a transparent canvas with the F050 black
  edge treatment. There is no background square or continuous-corner tile.
  F050 is a 20 px visible outer contour on the 1024 px master; the centered SVG
  stroke is 40 px before scaling and the white fill is painted above its inner
  half. The alpha bounds are 711 × 902 px (69.4% × 88.1%), leaving 156/157 px
  horizontally and 61 px vertically. The previous mark occupied 535 × 689 px
  (52.2% × 67.3%) with 245/244 px horizontal and 168/167 px vertical padding.
- F0, F025 (12 px), F050 (20 px), and F075 (28 px) were reviewed at 16, 32,
  48, 96, 180, and 512 px on white, browser gray, and black. F050 was selected:
  F025 is too faint at 16 px on white while F075 reads as a deliberate outline
  from 32 px upward. At output size, the selected contour scales to 0.3125 px,
  0.625 px, 0.9375 px, 1.875 px, 3.5156 px, and 10 px respectively.
- The 512 px maskable icon uses the same proportionate treatment around a
  640 px-high inner mark so its complete silhouette remains inside the maskable
  safe zone. The favicon edge is a functional small-size treatment only and is
  not a new official FELYA logo variant.
- JSON-LD continues to reference
  `/assets/brand/felya-labs-logo-square-512.png`. The favicon refinement does
  not rewrite that organization asset. The manifest references the regenerated
  transparent Android icons, including the safe-zone-adjusted maskable file.

The generated family contains ICO frames at 16, 32, 48, and 256 px plus PNGs
at 16, 32, 48, 96, 180 (Apple), 192, 256, and 512 px. Both the root ICO and
`public/assets/favicon/favicon.ico` are byte-identical.

## Archive

The complete former active logo SVG set, favicon family, public logo exports,
their former masters, V2 designer intermediates, and N025 generator are
retained under `assets-source/brand/archive/2026-09-pre-v4/`. These historical
files are not copied to the public preview snapshot.

The immediately preceding V4 rounded-square favicon family, its masters,
generator parameters, complete PNG/ICO/maskable output, and documentation are
retained under
`assets-source/brand/archive/2026-09-v4-rounded-favicon/`. These files are
private build history and are likewise excluded from the public snapshot.
