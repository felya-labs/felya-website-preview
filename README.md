# FELYA Website — Preview

Published preview snapshot of the multilingual FELYA website at [preview.felya.com](https://preview.felya.com).

## Repository role

This public repository is an automated deployment mirror. The canonical source is the private [`felya-labs/felya-website-stage`](https://github.com/felya-labs/felya-website-stage) repository.

Every push to `felya-website-stage/preview` is verified and synchronized here by GitHub Actions. A successful snapshot commit triggers this repository's Pages workflow and deploys the static Astro build to the preview domain.

Do not make editorial or application changes directly in this repository. Preview changes belong on the Stage repository's `preview` branch.

## Deployment contract

- Source branch: `felya-website-stage/preview`
- Snapshot branch: `felya-website-preview/main`
- Preview URL: [preview.felya.com](https://preview.felya.com)
- Build origin: `SITE_URL=https://preview.felya.com`
- Hosting: GitHub Pages

The preview CNAME, Pages workflow, and this README are maintained in this repository and preserved when source snapshots are synchronized.

The generated site mirrors the production architecture, including localized routes, canonical and social metadata, `hreflang`, legal pages, `robots.txt`, and `sitemap.xml`.
