---
name: publish-blog-post
description: Publish or update an Ambitions AI blog post from a markdown file. Handles title, content, excerpt, meta description, dates, featured image, and byline. Works against the live EmDash CMS via MCP + D1.
---

# Publish blog post — skill

Use this skill when the user wants to publish a new blog post, or replace the content of an existing one, from a markdown source. **Never use the EmDash admin UI** — the user has asked us to do this entirely through tooling.

## When to use

Triggers: user says "publish this", "push this post live", "replace the content of X post", "update this blog post", or pastes a blog-post markdown file / gives you a markdown file path.

Do **not** use this skill for:
- Byline-only swaps (no content change) → run the D1 byline-swap directly, see [Byline swap](#byline-swap) at the bottom.
- Small copy edits on a single paragraph → ask the user if the whole file has been refreshed, or if they want a surgical edit.
- Service pages (`/about/`, `/pricing/`, `/content-marketing/`, etc.) — those are code-owned `.astro` files in `src/pages/*/index.astro`, not CMS posts.

## Tools used

- `mcp__ambitions-ai-cms__content_get` — read existing post + get `_rev` token
- `mcp__ambitions-ai-cms__content_update` — write content, title, excerpt, meta_description, dates, featured_image
- `mcp__ambitions-ai-cms__content_create` — new post
- `mcp__ambitions-ai-cms__content_publish` — promote the draft revision to live
- `mcp__ambitions-ai-cms__content_list` — look up slugs for internal-link validation
- `wrangler d1 execute` — byline reassignment (MCP doesn't manage the byline relation)

Collection slug is always `posts`.

## Source markdown conventions

The user's natural format (from the Ambitions AI blog post skill in `AAI WEBSITE/SKILLS/1ambition-ai-blog-post-skill.md`). Recognise these patterns:

```markdown
<!-- Featured image: none for now. To be added later. -->   ← or a filename/URL

# Blog Post Title                                            ← maps to `title`

*Reading time: 6 minutes*                                    ← ignore (no field)

**By Liyana van Wyk**                                        ← maps to byline (Liyana | Nick | Ambitions)

**Lead sentence in bold, sets up the post.**                 ← candidate for `excerpt` (first paragraph)

Body paragraph...

**Related reading:**                                         ← literal section with bullets
- [Link text](/slug)
- [Link text](#)                                             ← placeholder; flag before publish

---                                                          ← section break (drop on conversion)

## H2 Section Heading

*Quick Answer: One-sentence answer in italics.*              ← render as italic paragraph (no custom block)

Body paragraph.

### H3 Subheading

- Bullet
- Bullet

**Liyana's Insight:** or **Nick's Insight:**               ← label paragraph (bold)

*The italic insight content here.*                           ← italic paragraph

## FAQ                                                       ← FAQ section — each H3 is a question

### Question goes here?

Answer paragraph.

## CTA Heading That Speaks As The Business

Pitch paragraph.

**[Contact Us](#)**                                          ← must be a real URL by publish; `/contact/`
```

### Field mapping

| Markdown | Post field | Notes |
|----------|-----------|-------|
| H1 `# Title` | `title` | Required. One H1, at top. **On updates, preserve the existing DB title by default** — if the markdown H1 differs, surface the mismatch in the diff and ask before overwriting. Do not silently change published H1s (they are SEO-sensitive). |
| First bold lede (`**...**` paragraph) | `excerpt` | **Always auto-extract** from the first bold paragraph after the byline line. Plain text, no marks. If there is no bold lede, leave `excerpt` null. |
| `<!-- Featured image: path -->` | `featured_image` | Object `{ src, alt }` if a path is given. If markdown says "none" or omits the comment → **set `featured_image: null`** (clear any existing). Never retain a previous image on update — stale WP-legacy URLs are assumed broken. The user will add images manually later. |
| `**By Liyana van Wyk**` | (byline relation, separate D1 step) | Parse author name. Fallback "Ambitions" if missing. |
| `*Reading time: ...*` | — | Discard. |
| Everything after the byline line | `content` (portableText) | Convert per rules below. |
| Meta description | `meta_description` | If user provides one in front-matter; otherwise leave existing value. Don't auto-generate. |
| Post/updated dates | `post_date`, `updated_date` | `post_date` only set if user specifies (or on create, default to today). `updated_date` **always bumped to today's ISO date on every update**. |

### Optional YAML front-matter (takes precedence over inferred values)

```yaml
---
slug: entity-seo-for-geo
byline: Liyana van Wyk
featured_image:
  src: https://media.theambitionsagency.com/... | /images/...
  alt: Descriptive alt text
excerpt: Short plain-text excerpt.
meta_description: Meta description text under 160 chars.
post_date: 2026-04-18
---
```

Front-matter is optional — infer from markdown when absent. If front-matter says `slug`, use it. Otherwise derive slug from filename (strip `.md`) or from title via kebab-case.

## EmDash Portable Text — what the site stores

Verified from `google-ai-overviews-optimization` (106 blocks). **Only `_type: "block"`.** No custom block types in use. Any custom `_type` we invent would need renderer support in `src/pages/[slug].astro`, which doesn't exist today — so don't invent custom types.

### Block skeleton

```json
{
  "_type": "block",
  "_key": "key-NNN-xxxxx",
  "style": "normal" | "h2" | "h3",
  "listItem": "bullet" | "number",
  "level": 1,
  "children": [
    { "_type": "span", "_key": "...", "text": "...", "marks": ["strong"|"em"|"<markDefKey>"] }
  ],
  "markDefs": [ { "_type": "link", "_key": "<same-key-as-span-marks>", "href": "/path" } ]
}
```

`listItem` + `level` appear only on list blocks. `markDefs` appears only when the block has links.

### Conventions seen in the live corpus

- **Headings** (H2/H3) wrap their whole text span in `["strong"]`. Mirror this.
- Lists are all `level: 1`, never nested.
- Links are `href`-only — no `target`, `rel`, `blank`, `nofollow`. Internal and external links use the same shape.
- Combined marks on a span: e.g. `"marks": ["<linkKey>", "strong"]` for a bold link.
- `_key` values in the corpus look like `"key-13-qsdrw"`. Any stable unique string works; we can emit `"b-<n>"`, `"s-<n>"`, `"m-<n>"`.

## Markdown → Portable Text conversion rules

Strict, deterministic. If you need a case not covered here, ask the user.

| Markdown | Block | Notes |
|----------|-------|-------|
| `## Heading` | `{style: "h2", children: [{text: "Heading", marks: ["strong"]}]}` | Wrap entire heading text in `strong`. |
| `### Heading` | `{style: "h3", children: [{text: "Heading", marks: ["strong"]}]}` | Same. |
| Paragraph | `{style: "normal", children: [...spans]}` | One block per paragraph. |
| `- item` | `{style: "normal", listItem: "bullet", level: 1, children: [...]}` | One block per list item. |
| `1. item` | `{style: "normal", listItem: "number", level: 1, children: [...]}` | Same. |
| `**bold**` | span with `marks: ["strong"]` | |
| `*italic*` | span with `marks: ["em"]` | |
| `[text](/path)` or `[text](https://...)` | span referencing a markDef | markDef: `{_type:"link", _key:"m-N", href:"/path"}`; span's `marks: ["m-N"]`. |
| Bold italic `***text***` | span with `marks: ["strong", "em"]` | |
| Bold link `**[text](/path)**` | span with `marks: ["m-N", "strong"]` | |
| `---` horizontal rule | drop | The live template doesn't render hr; use the section change implicitly via H2. |
| `<!-- comment -->` | drop | HTML comments are metadata for us, not content. |
| Code fences, blockquotes, images in body | ASK FIRST | None appear in the live corpus; don't silently emit them. |
| `**Related reading:**` section + its bulleted list | **drop** | The template auto-renders 3 related posts at the bottom. Never emit Related reading into post body — it would duplicate. |
| Trailing `**[Contact Us](...)**` or similar sign-off CTA | **drop** | The template renders a prominent "Contact Us →" button (primary-500 pill) automatically after every post body. Never emit in-body Contact CTAs. Applies to any trailing markdown block that is clearly a company-voice close-out call (e.g. "Contact Us", "Book a call", "Get in touch") — if the post's final paragraph under the final H2 is just that single link, drop the whole section including the H2. When in doubt, ask. |

### Quick Answer callout (`*Quick Answer: ...*` paragraph after H2)

Plain italic paragraph. No wrapper.

```json
{"_type":"block","_key":"b-N","style":"normal","children":[{"_type":"span","_key":"s-N","text":"Quick Answer: ...","marks":["em"]}]}
```

### Insight callout (`**Liyana's Insight:**` + italic paragraph)

Two separate blocks:

```json
{"_type":"block","style":"normal","children":[{"_type":"span","text":"Liyana's Insight:","marks":["strong"]}]},
{"_type":"block","style":"normal","children":[{"_type":"span","text":"Insight paragraph text","marks":["em"]}]}
```

### CTA section

The closing section (typically an H2 + body paragraph + bold link). Encode the Contact link as a combined `link+strong` span:

```json
{"_type":"block","style":"normal","children":[
  {"_type":"span","text":"Contact Us","marks":["m-N","strong"]}
], "markDefs":[{"_type":"link","_key":"m-N","href":"/contact/"}]}
```

`/contact/` is the canonical URL. Watch for `[Contact Us](#)` placeholders — flag before publish.

## Workflow

### 1. Receive the markdown

Either:
- Pasted in chat → save to `/Users/nicholasburrage/Documents/GitHub/AAI WEBSITE/posts/<slug>.md` first, then read back. (Gives us a source-of-truth file.)
- Path provided by user → read directly.

Propose `AAI WEBSITE/posts/<slug>.md` as the canonical file location and ask before creating the directory if it doesn't exist.

### 2. Parse

Extract: slug (front-matter or filename or H1-derived), title, byline name, excerpt (first bolded lede if present), featured_image, meta_description, post_date, body markdown.

### 3. Pre-publish checks — stop and ask if any fail

- [ ] Slug is valid kebab-case, no spaces, no special chars.
- [ ] Title is non-empty.
- [ ] Byline resolves to a known byline in D1 (`Nick Burrage` | `Liyana van Wyk` | `Ambitions`). If it's anything else, ask.
- [ ] No `(#)` placeholder links remain. Report every line containing one.
- [ ] All internal links (`[text](/slug)`) resolve to real posts/pages. Validate via `mcp__ambitions-ai-cms__content_list` (check `posts` and `pages` collections) plus the service-page folder list from `src/pages/*/index.astro`.
- [ ] Featured image either has a real src or is explicitly "none".
- [ ] CTA link is `/contact/`, not `#`.

### 4. Resolve target: create or update

```
content_get({collection: "posts", id: "<slug>"})
```

- If returns a post: remember the `_rev` token (on the response root, NOT inside `item`). We're updating.
- If 404/not found: we're creating.

### 5. Convert body markdown → Portable Text

Per the rules above. Generate stable `_key` values. Verify:
- Every `markDefs` entry has a span somewhere with the matching `_key` in its `marks` array.
- Every non-standard mark in `marks` (i.e. not `"strong"` or `"em"`) maps to a `markDefs._key` in the same block.

### 6. Show the diff and ask for go-ahead

For updates: show the user a concise diff — what changes in `title`, `content` block count, `excerpt`, `meta_description`, `featured_image`, and byline target. For creates: show the fields that will be set. Do **not** auto-proceed.

### 7. Write

**Update path:**
```
content_update({
  collection: "posts",
  id: "<slug>",
  _rev: "<token from step 4>",
  data: {
    title: "...",
    content: [/* portable text blocks */],
    excerpt: "...",                  // only if changed
    meta_description: "...",         // only if changed
    featured_image: {...} | null,    // only if changed
    post_date: "...",                // only if changed
    updated_date: "<today ISO>"      // set on every update
  }
})
```

Only include fields that are actually changing — unspecified fields are left untouched.

**Create path:**
```
content_create({
  collection: "posts",
  slug: "<slug>",
  status: "draft",                   // never create as published
  data: { title, content, excerpt, meta_description, featured_image, post_date }
})
```

### 8. Publish

```
content_publish({collection: "posts", id: "<slug>"})
```

Only after step 7 succeeds. For updates, this promotes the new draft revision to live.

### 9. Reassign byline if needed

Byline is a D1 relation, not a post field. If the byline needs to change:

```sql
UPDATE ec_posts SET primary_byline_id = '<new_byline_id>', updated_at = datetime('now') WHERE id = '<post_id>';
UPDATE _emdash_content_bylines SET byline_id = '<new_byline_id>' WHERE content_id = '<post_id>';
```

Byline IDs (stable — check with `SELECT id, display_name, slug FROM _emdash_bylines` if unsure):

| Author | byline_id | slug |
|--------|-----------|------|
| Nick Burrage | `01KNCVYA4V2H9HQXZ0HWWWMA49` | `nick-burrage` |
| Liyana van Wyk | `01KNCWG6D3S5BZD2BM4XT53ZYP` | `liyana-van-wyk` |
| Ambitions (generic) | `01KNCVYEBPWYV5EV5CP05T5EAH` | `ambitions` |

Run via: `cd /Users/nicholasburrage/Documents/GitHub/my-ambitionai-site && npx wrangler d1 execute my-emdash-site --remote --command="..."`

### 10. Verify on live page

Fetch the live URL with a cache-bust query param:

```bash
curl -sL "https://my-ambitionai-site.nb-e51.workers.dev/<slug>/?v=$(date +%s)"
```

Check:
- Title rendered correctly in `<h1>`
- Byline link goes to right author page
- Author photo matches author
- JSON-LD `author.@id` matches (`#nick-burrage` or `#liyana-van-wyk` or `#organization`)
- First H2 of body is present
- `<h3>FAQ</h3>` section renders
- No `(#)` links in the rendered HTML

### 11. Report back

One tight summary: slug, live URL, what changed, any warnings, byline applied.

## Byline swap (no content change)

When the user just wants "re-attribute this post to Liyana" with no content rewrite, skip the MCP dance entirely. Two UPDATEs:

```bash
cd /Users/nicholasburrage/Documents/GitHub/my-ambitionai-site && \
npx wrangler d1 execute my-emdash-site --remote --command="\
  UPDATE ec_posts SET primary_byline_id = '<BYLINE_ID>', updated_at = datetime('now') WHERE slug = '<SLUG>'; \
  UPDATE _emdash_content_bylines SET byline_id = '<BYLINE_ID>' WHERE content_id = (SELECT id FROM ec_posts WHERE slug = '<SLUG>'); "
```

Then verify as in step 10.

## Safety rules

1. **Never auto-publish a new post.** `content_create` must use `status: "draft"`. User confirms, then we call `content_publish`.
2. **Always use `_rev`** on updates — prevents clobbering concurrent edits.
3. **Never bypass verification.** The live page must be fetched and sanity-checked after every write. Report what you verified, not just "done".
4. **Do not invent custom block types.** The site renderer (`src/pages/[slug].astro` via PortableText) handles only the block types already in the corpus. New block types need renderer changes too — that's a separate piece of work.
5. **Do not write to `src/pages/[slug].astro` or any site code** as part of this skill unless explicitly asked. This skill is content-only.
6. **If anything fails mid-flow**, stop and report. Do not retry blindly. The most common failures:
   - `_rev` mismatch → fetch again and re-diff.
   - Validation failure on a field → check schema with `schema_get_collection`.
   - Placeholder link slipped through → rerun the pre-publish check.
   - `Cannot determine content ownership: content has no authorId` → the post has `author_id IS NULL` in D1 (typically WP-imported posts). Fix once with: `UPDATE ec_posts SET author_id = '01KN8JJTTXPTJFN4810K19HYK8' WHERE id = '<post_id>';` then re-fetch `_rev` (updated_at changed) and retry. The bulk one-off was already applied 2026-04-18, so new posts created via MCP should not hit this.

## Quick reference

- Site repo: `/Users/nicholasburrage/Documents/GitHub/my-ambitionai-site`
- Markdown source folder (proposed): `/Users/nicholasburrage/Documents/GitHub/AAI WEBSITE/posts/`
- Live URL template: `https://my-ambitionai-site.nb-e51.workers.dev/<slug>/`
- Admin (emergency only, don't use by default): `https://my-ambitionai-site.nb-e51.workers.dev/_emdash/admin`
- Related skill: `.claude/skills/ambitions-ai-site.md` (stack, deploy, image hosting)
