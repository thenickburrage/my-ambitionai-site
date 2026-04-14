This is an EmDash site -- a CMS built on Astro with a full admin UI.

## Commands

```bash
npx emdash dev        # Start dev server (runs migrations, seeds, generates types)
npx emdash types      # Regenerate TypeScript types from schema
npx emdash seed seed/seed.json --validate  # Validate seed file
npm run build         # Build for production (must run before deploy)
npm run deploy        # Build + deploy to Cloudflare Workers
```

The admin UI is at `http://localhost:4321/_emdash/admin`.

> **Deploy rule:** `npm run deploy` runs `astro build && wrangler deploy`. Always build first — Wrangler just uploads whatever is in `dist/` and will silently deploy a stale build if you skip the build step.

## Key Files

| File                     | Purpose                                                                            |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `astro.config.mjs`       | Astro config with `emdash()` integration, database, and storage                  |
| `src/live.config.ts`     | EmDash loader registration (boilerplate -- don't modify)                         |
| `seed/seed.json`         | Schema definition + demo content (collections, fields, taxonomies, menus, widgets) |
| `emdash-env.d.ts`      | Generated types for collections (auto-regenerated on dev server start)             |
| `src/layouts/Base.astro` | Base layout with EmDash wiring (menus, search, page contributions)               |
| `src/pages/`             | Astro pages -- all server-rendered                                                 |

## Skills

Agent skills are in `.agents/skills/`. Load them when working on specific tasks:

- **building-emdash-site** -- Querying content, rendering Portable Text, schema design, seed files, site features (menus, widgets, search, SEO, comments, bylines). Start here.
- **creating-plugins** -- Building EmDash plugins with hooks, storage, admin UI, API routes, and Portable Text block types.
- **emdash-cli** -- CLI commands for content management, seeding, type generation, and visual editing flow.

## Rules

- All content pages must be server-rendered (`output: "server"`). No `getStaticPaths()` for CMS content.
- Image fields are objects (`{ src, alt }`), not strings. Use `<Image image={...} />` from `"emdash/ui"`.
- `entry.id` is the slug (for URLs). `entry.data.id` is the database ULID (for API calls like `getEntryTerms`).
- Always call `Astro.cache.set(cacheHint)` on pages that query content.
- Taxonomy names in queries must match the seed's `"name"` field exactly (e.g., `"category"` not `"categories"`).

## Cloudflare / Astro v6 Gotchas

- **`Astro.locals.runtime.env` is removed in Astro v6.** Accessing it throws a runtime error. Use `import { env } from 'cloudflare:workers'` to access D1, R2, KV, and other bindings instead.
  ```ts
  import { env } from 'cloudflare:workers';
  const db = env.DB as D1Database;
  ```
- **`mcp__ambitions-ai-cms__taxonomy_create_term` is broken** — it references a non-existent table. Insert taxonomy terms directly via wrangler: `npx wrangler d1 execute my-emdash-site --remote --command="INSERT INTO taxonomies ..."`.
- **EmDash cursor pagination breaks when `published_at` is null** (e.g. after a WordPress import). Work around by querying D1 directly with offset-based pagination using `cloudflare:workers` env.
- **WordPress-imported posts** may have WPBakery shortcode content (`[vc_row ...]`) or `htmlBlock` Portable Text nodes. Filter these in listing pages; individual post pages may need custom handling for `htmlBlock` node types.
- **If a page 500s in SSR**, Astro may fall back to `[slug].astro` matching the same path — so a broken index page can appear to render wrong content rather than showing an error.
