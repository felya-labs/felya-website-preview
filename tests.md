# Tests And Verification

| Check | Command or method | Verifies |
| --- | --- | --- |
| Dependency install | `bun install --frozen-lockfile` | Lockfile can restore the project dependencies |
| Static build | `bun run build` | Astro generates the GitHub Pages output in `dist/` |
| Source hygiene | `git diff --check` | No whitespace errors in the patch |
| Font asset check | See scan commands below | Local font files and license files ship with the build |
| Legacy output scan | See scan commands below | Old remote font, fake-submit, runtime, style, and path leftovers are absent |
| Passive external-load scan | See scan commands below | Built pages do not passively load third-party scripts, frames, images, media, styles, or CSS URLs |
| External endpoint scan | See scan commands below | External services remain limited to documented Formspark and outbound profile-link paths |
| CSP scan | See scan commands below | Source and built pages preserve the intended CSP allowlist |
| Desktop UX | Browser preview at `http://localhost:4321/` | Hero, waitlist form, sponsor marquee, gallery, and static CSS load |
| Mobile UX | Browser preview at 390px width | No horizontal overflow; mobile menu opens and closes |
| Browser initial network check | `bun run preview --host 127.0.0.1 --port 4321`, then hard reload `/` with Network open | Desktop and 390px mobile initial load make no requests to third-party hosts |
| Waitlist submit check | Submit a valid email through `#signup-form` and inspect Network | Formspark is requested only after submit; pending and success or error state is real |
| Local video click check | Hard reload `/` with Network open, then click `[data-video-cover]` | No `/assets/video/` request is made before the click; local video media starts only after the cover click |
| Legal routes | Browser preview of `/terms.html`, `/privacy.html`, `/impressum.html` | Legal pages render without mobile overflow |
| Legal text endpoints | Generated `/terms.txt`, `/privacy.txt`, `/impressum.txt` | Plain-text legal files remain deployable |

The deploy workflow runs the same dependency install and build commands on GitHub's `ubuntu-slim` runner.

## Scan Commands

Run after `bun run build`:

```sh
test -f dist/fonts/manrope-variable.ttf && test -f dist/fonts/license.md && test -f dist/fonts/licenses/manrope-OFL-1.1.txt
! rg -n "framerusercontent|fonts\.googleapis|fonts\.gstatic|cdn\.tailwindcss\.com|hidden_iframe|form-success|assets/assets|Contextprogram" src public dist
! rg -n --pcre2 "<(?:script|iframe|img|source|video|audio)\b[^>]+\b(?:src|poster)=[\"']https?://|<link\b[^>]+\bhref=[\"']https?://|url\([\"']?https?://" dist
rg -n "submit-form\.com|youtube-nocookie\.com|youtube\.com|ytimg\.com|googlevideo\.com|googletagmanager|google-analytics|fonts\.googleapis\.com|fonts\.gstatic\.com" src public dist
rg -q "origin: new URL\\(waitlistFormAction\\)\\.origin" src/data/site.js
rg -Fq 'connect-src ${waitlistForm.origin}' src/layouts/BaseLayout.astro && rg -Fq 'form-action ${waitlistForm.origin}' src/layouts/BaseLayout.astro
for file in dist/*.html; do rg -q "connect-src https://submit-form.com" "$file" && rg -q "form-action https://submit-form.com" "$file" && rg -q "frame-src 'none'" "$file" || exit 1; done
! rg -n "<source src=\"assets/video/|<video[^>]+src=\"assets/video/" dist
! rg -n "unsafe-inline" dist/*.html
```
