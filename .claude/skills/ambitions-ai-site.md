---
name: ambitions-ai-site
description: Orient fast when editing the Ambitions AI site — stack, deploy flow, author panel, image hosting, and gotchas. Read this before touching anything.
---

# Ambitions AI site — working skill

## Where everything lives

- **Site repo:** `/Users/nicholasburrage/Documents/GitHub/my-ambitionai-site`
- **Content briefs / source material repo:** `/Users/nicholasburrage/Documents/GitHub/AAI WEBSITE` — drafts, images, skill docs. Not the site code.
- **Live URL (staging):** `https://my-ambitionai-site.nb-e51.workers.dev`
- **Production domain:** `theambitionsagency.com` (legacy WordPress still serves some assets under `/wp-content/uploads/`)

If the user asks a "how does the site do X" question, **start in the site repo, not the briefs repo.** The briefs repo is content, not code.

## Stack

- **Astro v6** with `output: "server"` (all pages SSR)
- **EmDash CMS** (`emdash` + `@emdash-cms/cloudflare`) for content, admin UI at `/_emdash/admin`
- **Cloudflare Workers** runtime (`@astrojs/cloudflare`)
- **D1** database `my-emdash-site` (binding `DB`) — content storage
- **R2** bucket `my-emdash-media` (binding `MEDIA`) — uploaded media
- **Tailwind** via `@tailwindcss/vite`

## Deploy

From `my-ambitionai-site/`:

```bash
npm run deploy     # astro build && wrangler deploy
```

**Always build first.** `wrangler deploy` alone will push whatever is already in `dist/` — a stale build deploys silently.

Local dev: `npx emdash dev` (runs migrations, seeds, regenerates types). Admin at `http://localhost:4321/_emdash/admin`.

## Author panel (the byline card at the bottom of every post)

**File:** `src/pages/[slug].astro` — this renders every CMS-driven post at `/:slug/`.

Three maps at the top of the frontmatter (around lines 70–97) control the byline card. Each is keyed by the author's `displayName` as stored on the byline:

1. `authorPageMap` — link to the author's page (`/authors/...`)
2. `authorPhotoMap` — circular photo URL (renders `<img>` if present, skips if null)
3. `authorBioMap` — two-paragraph italic bio, second paragraph ending in a link

Current authors: **Nick Burrage**, **Liyana van Wyk** (also keyed as `Liyana V.` in `authorPageMap` to catch the short displayName).

**Byline card markup** lives later in the same file (around line 325 onwards, `<!-- Author section -->`). The photo is rendered conditionally: `{authorPhoto && <img ...>}`. No map entry → no image, no broken image, no empty slot.

**To add a new author:** add them to all three maps. Their byline on the post (via EmDash admin → Bylines) must match the map key exactly — a typo there (e.g. `Liyana V.` vs `Liyana van Wyk`) will silently fall back to the `"Ambitions AI"` default and you'll get a generic card.

## Image hosting — the reality

The site pulls images from three places. In priority order:

1. **`public/images/...`** (served as `/images/...`) — the reliable default. Anything committed here ships with the Worker's static assets. **This is where author photos and hero images for non-CMS pages should go.** File: `public/images/nick-burrage-400.webp`, `public/images/liyana-van-wyk-400.webp`.
2. **Legacy WordPress** at `https://theambitionsagency.com/wp-content/uploads/...` — referenced in imported posts. Don't create new ones here.
3. **R2 bucket `my-emdash-media`** (binding `MEDIA`) — 366+ objects, fed by EmDash CMS media uploads. Served **through EmDash**, not directly. The custom domain `media.theambitionsagency.com` **is not currently attached** to this bucket (verified: `wrangler r2 bucket domain list my-emdash-media` returns empty, TLS handshake fails on the domain). The r2.dev public URL is also disabled. So direct URLs to R2 objects don't work — only CMS-embedded images render.

**Practical rule:** for anything you're wiring into template code (photos in maps, SVG icons, logos), put it in `public/images/` and reference as `/images/filename.ext`. Don't use R2 URLs in code until the custom domain is fixed.

**If/when R2 custom domain gets attached:** the existing pattern (originally used by the now-broken `media.theambitionsagency.com/authors/...` URLs) is fine to revive. Objects are already uploaded at `authors/nick-burrage.webp` and `authors/liyana-van-wyk.webp` from the 2026-04-18 session.

## Author photo specs

- Source 400×400 WebP or JPG
- Displayed at 80×80 circular (`rounded-full object-cover`)
- Square crop, face centred — the template crops to a circle, so anything not roughly square will look wrong

## Gotchas (from the repo's CLAUDE.md, worth remembering)

- `Astro.locals.runtime.env` was removed in Astro v6. Use `import { env } from 'cloudflare:workers'` to access `DB`, `MEDIA`, etc.
- Taxonomy names in queries must match `seed.json` `"name"` exactly (e.g. `"category"` not `"categories"`).
- WP-imported posts may contain `[vc_row ...]` WPBakery shortcodes or `htmlBlock` Portable Text nodes — filter or custom-handle in listing/post renderers.
- If a page 500s in SSR, Astro falls back to `[slug].astro` matching the same path — a broken index page can render the wrong content rather than throw an error.
- `mcp__ambitions-ai-cms__taxonomy_create_term` is broken — insert taxonomy terms via `npx wrangler d1 execute my-emdash-site --remote --command="INSERT INTO taxonomies ..."` instead.
- EmDash cursor pagination breaks when `published_at` is null (e.g. on WP-imported posts). Query D1 directly with offset-based pagination using `cloudflare:workers` env as a workaround.

## Common commands

```bash
# From my-ambitionai-site/
npm run deploy                                           # build + deploy
npx wrangler whoami                                      # check auth
npx wrangler r2 object put my-emdash-media/path/file.ext --file=local.ext --remote
npx wrangler r2 bucket info my-emdash-media
npx wrangler r2 bucket domain list my-emdash-media       # confirm domain state
npx wrangler d1 execute my-emdash-site --remote --command="SELECT ..."
```

## When in doubt

1. Read `my-ambitionai-site/CLAUDE.md` — it's the authoritative on-repo README.
2. Check `my-ambitionai-site/wrangler.jsonc` for the live bindings.
3. For CMS/content behaviour, load the `building-emdash-site` agent skill referenced in CLAUDE.md.
