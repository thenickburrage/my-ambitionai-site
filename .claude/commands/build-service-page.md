# Ambitions AI Service Page Builder

Build a complete, production-ready service page for the Ambitions AI website. This skill encapsulates every convention, design pattern, schema requirement, and structural rule established for this project.

---

## Before You Start

Ask the user for:
1. The service name (used for the URL slug, e.g. `your-ai-blueprint`)
2. The full page copy (every section — hero title, byline, body sections, FAQs, case studies, pull-out quotes, CTAs)
3. Any photos or images to include (paths relative to `public/images/`)
4. The named coach or author for the byline (usually Nick Burrage)
5. The starting price (for the `Offer` schema node)

Do not proceed until you have the copy. The copy drives everything.

---

## File Location

Service pages are **static Astro files**, not EmDash CMS pages.

```
src/pages/{service-slug}/index.astro
```

**They will not appear in the EmDash dashboard.** This is intentional — custom-designed service pages live in the codebase, not the database. Editing copy means editing the `.astro` file.

---

## Typography

Both fonts are already self-hosted via `@fontsource` and imported in `src/css/input.css`. No additional setup needed.

| Role | Font | CSS variable |
|------|------|--------------|
| Headings (H1–H4) | DM Serif Display | `--font-display` / `font-family: var(--font-display)` |
| Body / UI | Source Sans 3 | `--font-sans` (applied globally via `body`) |

Headings are set globally in `@layer base` in `input.css` — no per-page font declarations needed. Just use semantic heading elements.

**Tailwind note:** There is no `font-display` utility class. Use inline style or a custom class if you ever need to apply the display font to non-heading elements (e.g. pull-out quotes):
```html
<p style="font-family: var(--font-display)">…</p>
```
Or add a utility in `input.css`:
```css
.font-display { font-family: var(--font-display); }
```

---

## Page Template Structure

Every service page follows this section order. Sections may be renamed or merged to fit the copy, but the flow must be preserved.

```
1.  Hero
2.  Framing / Who this is for
3.  Problem section
4.  Guide / Coach section  ← includes photo
5.  Steps / Process section
6.  Outcomes section
7.  Results / Testimonials section
8.  Urgency section
9.  FAQ section
10. Final CTA
```

### Section Backgrounds (alternate for visual rhythm)

| Section | Background |
|---------|-----------|
| Hero | `bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950` with pink glow overlay |
| Framing | `bg-white` |
| Problem | `bg-gray-50 dark:bg-gray-900` |
| Guide/Coach | `bg-white` |
| Steps | `bg-gradient-to-br from-primary-500 to-accent-500` |
| Outcomes | `bg-white` |
| Results | `bg-gray-50 dark:bg-gray-900` |
| Urgency | `bg-gray-950` |
| FAQ | `bg-white` |
| Final CTA | `bg-gradient-to-br from-primary-500 to-accent-500` |

---

## Published / Updated Dates

Every service page carries a published date and an updated date, displayed beneath the byline in the hero. Store them as ISO strings (used in both the schema and the `<time>` elements), then derive the display strings from those:

```typescript
const publishedISO  = 'YYYY-MM-DD';   // Set on launch day — never change
const updatedISO    = 'YYYY-MM-DD';   // Update every time content is revised
const publishedDate = new Date(publishedISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const updatedDate   = new Date(updatedISO).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
```

Rendered in the hero directly below the authored-by line, using `<time datetime>` so the machine-readable date is embedded in the HTML:

```astro
<p class="mt-5 text-lg italic text-primary-300">
  Authored by [Name], [Credential]
</p>
<p class="mt-2 text-sm italic text-white/50">
  Published <time datetime={publishedISO}>{publishedDate}</time> &middot; Updated <time datetime={updatedISO}>{updatedDate}</time>
</p>
```

The ISO strings are also used directly in the `WebPage` schema node (see Schema section below).

---

## Hero Section Rules

- `<h1>` must be the **first heading** on the page and contain the full service name + headline
- Byline goes **below** the H1 as italic text: `*Authored by [Name], [Credential]*`
- Two CTA buttons: primary (solid pink) = "Book Your Free Explore Call" → `/contact/`; secondary (ghost) = "See How It Works" → `#three-steps` or similar anchor
- Pink radial glow: `absolute` div with `bg-primary-500 blur-[120px] opacity-20`

```astro
<section class="relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 py-20 lg:py-28">
  <div class="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
    <div class="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary-500 blur-[120px]"></div>
  </div>
  <div class="relative mx-auto max-w-4xl px-4 text-center lg:px-8">
    <h1 class="text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
      [Service Name]: [Full Headline]
    </h1>
    <p class="mt-5 text-lg italic text-primary-300">
      Authored by [Name], [Credential]
    </p>
    <div class="mt-10 flex flex-wrap justify-center gap-4">
      <a href="/contact/" class="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-600">
        Book Your Free Explore Call
      </a>
      <a href="#steps" class="inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/40 hover:bg-white/10">
        See How It Works
      </a>
    </div>
  </div>
</section>
```

---

## Guide / Coach Section Rules

- Two-column layout: photo left (`lg:col-span-2`), text right (`lg:col-span-3`)
- Photo: `overflow-hidden rounded-2xl shadow-xl`, full `object-cover`
- Always include a pull-out quote from the coach in this section
- Sub-headings use `<h3>` (page is already at H2 level for this section)

```astro
<div class="lg:grid lg:grid-cols-5 lg:gap-12 lg:items-start">
  <div class="mb-10 lg:col-span-2 lg:mb-0">
    <div class="overflow-hidden rounded-2xl shadow-xl">
      <img src="/images/[photo].png" alt="[Name], [Credential]" class="h-full w-full object-cover" loading="eager" />
    </div>
  </div>
  <div class="lg:col-span-3">
    <!-- H2 + bio content -->
  </div>
</div>
```

---

## Pull-Out Quotes

Any quote marked `[PULL-OUT QUOTE]` in the copy becomes a styled `<figure><blockquote>`. There are two variants:

**Inline (within a light section):**
```astro
<figure class="my-8 border-l-4 border-primary-500 pl-6">
  <blockquote>
    <p style="font-family: var(--font-display)" class="text-xl italic leading-snug text-gray-900 lg:text-2xl">
      "[Quote text]"
    </p>
  </blockquote>
  <figcaption class="mt-3 text-sm font-semibold text-primary-500">[Attribution]</figcaption>
</figure>
```

**Centred (in the results or urgency sections):**
```astro
<figure class="my-10 mx-auto max-w-2xl text-center">
  <blockquote>
    <p style="font-family: var(--font-display)" class="text-2xl italic leading-snug text-primary-400 lg:text-3xl">
      "[Quote text]"
    </p>
  </blockquote>
</figure>
```

---

## Voice-of-Customer Quotes (Problem Section)

Render customer frustration quotes as styled blockquotes with a pink left border:

```astro
<blockquote class="rounded-2xl border-l-4 border-primary-500 bg-white py-5 pl-6 pr-6 shadow-sm dark:bg-gray-800">
  <p class="text-lg italic text-gray-700 dark:text-gray-300 before:content-['\u2018'] after:content-['\u2019']">
    [Quote text — no surrounding quote marks needed, curly quotes added via CSS]
  </p>
</blockquote>
```

---

## CTA Buttons — Standard Variants

**Primary (solid pink):**
```html
<a href="/contact/" class="inline-flex items-center gap-2 rounded-full bg-primary-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30">
  Book Your Free Explore Call
</a>
```

**Secondary (ghost on dark):**
```html
<a href="/contact/" class="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10">
  Start Now
</a>
```

**Secondary (ghost on white, on gradient CTA section):**
```html
<a href="/contact/" class="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-100">
  Book Your Free Explore Call
</a>
```

All CTAs link to `/contact/` unless directed otherwise.

---

## FAQ Section

Use a simple divider layout — no JavaScript accordion needed:

```astro
<div class="divide-y divide-gray-100">
  {faqs.map(({ q, a }) => (
    <div class="py-6">
      <h3 class="text-lg text-gray-900">{q}</h3>
      <p class="mt-3 leading-relaxed text-gray-600">{a}</p>
    </div>
  ))}
</div>
```

---

## Schema Markup

Every service page requires **four schema nodes** in a `@graph` array, injected via the `head` slot in `Base.astro`. Together they cover: the page itself, the service being sold, the FAQ rich result, and the author.

### Head Slot Usage

```astro
<Base title="..." description="...">
  <script slot="head" type="application/ld+json" set:html={JSON.stringify(serviceSchema)} />
  <!-- page content -->
</Base>
```

### Schema Template

```typescript
const serviceSchema = {
  "@context": "https://schema.org",
  "@graph": [

    // 1. WebPage — dates, authorship, breadcrumb
    {
      "@type": "WebPage",
      "@id": "https://theambitionsagency.com/{slug}/#webpage",
      "url": "https://theambitionsagency.com/{slug}/",
      "name": "{Page title}",
      "description": "{Meta description}",
      "datePublished": publishedISO,   // ISO string from frontmatter
      "dateModified": updatedISO,      // ISO string from frontmatter
      "author": { "@id": "https://theambitionsagency.com/#{person-id}" },
      "publisher": { "@id": "https://theambitionsagency.com/#organization" },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theambitionsagency.com/" },
          { "@type": "ListItem", "position": 2, "name": "{Service Name}", "item": "https://theambitionsagency.com/{slug}/" }
        ]
      }
    },

    // 2. Service — what is being sold
    {
      "@type": "Service",
      "@id": "https://theambitionsagency.com/{slug}/#service",
      "name": "{Service Name}",
      "description": "{1–2 sentence description}",
      "url": "https://theambitionsagency.com/{slug}/",
      "serviceType": "{e.g. Business Coaching / AI Marketing / Sales Training}",
      "provider": {
        "@type": "ProfessionalService",
        "@id": "https://theambitionsagency.com/#organization",
        "name": "Ambitions AI",
        "url": "https://theambitionsagency.com"
      },
      "areaServed": [
        { "@type": "Country", "name": "United Kingdom" },
        { "@type": "Country", "name": "United States" }
      ],
      "offers": {
        "@type": "Offer",
        "price": "{starting price as number, e.g. 1500}",
        "priceCurrency": "GBP",
        "description": "Starting price per month",
        "availability": "https://schema.org/InStock",
        "url": "https://theambitionsagency.com/pricing/"
      }
    },

    // 3. FAQPage — enables FAQ rich results in Google Search
    {
      "@type": "FAQPage",
      "@id": "https://theambitionsagency.com/{slug}/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "{Question text exactly as it appears on the page}",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "{Answer text — plain text, no HTML}"
          }
        }
        // repeat for every FAQ on the page
      ]
    },

    // 4. Person — the named coach/author
    {
      "@type": "Person",
      "@id": "https://theambitionsagency.com/#{person-id}",
      "name": "{Full Name}",
      "jobTitle": "{Credential/Title}",
      "description": "{1–2 sentence bio}",
      "worksFor": { "@id": "https://theambitionsagency.com/#organization" }
    }

  ]
};
```

### Key rules

- `#organization` ties back to the global `ProfessionalService` in `Base.astro` — never change this ID
- Nick Burrage's established ID is `#nick-burrage` — reuse it on every page he authors
- `FAQPage` question text must match the visible H3 text on the page exactly
- `Answer.text` must be plain text — no HTML tags
- `datePublished` / `dateModified` must be ISO 8601 strings (`YYYY-MM-DD`) — use the `publishedISO` / `updatedISO` variables from frontmatter, not the formatted display strings
- Validate with Google's Rich Results Test after deploying

---

## HTML5 Outline Requirements

Check the page outline before deploying. It must read:
```
Untitled BODY
Untitled NAV  ← aria-label="Main navigation" already on Header.astro
[H1 — full service name + headline]
  [H2 — section headings]
    [H3 — sub-sections within a section]
```

Rules:
- H1 must be first, must include the service name
- No skipped heading levels (never jump H2 → H4)
- Section headings are H2. Sub-points within a section are H3.
- The steps section uses numbered labels (`01`, `02`…) as decorative text — the card titles are H3

---

## Build and Deploy

Always clean the dist folder before building:

```bash
rm -rf dist && npm run build && npm run deploy
```

The chunk size warning about fonts > 500 kB is expected and harmless — it's the self-hosted font files.

---

## Checklist Before Deploying

- [ ] H1 contains full service name and headline
- [ ] Byline is italic, below H1
- [ ] `publishedISO` and `updatedISO` set to today's date at the top of frontmatter
- [ ] `<time datetime>` elements used for both dates in the hero HTML
- [ ] No heading levels skipped in the outline
- [ ] Nick photo (or relevant image) in the coach/guide section
- [ ] All pull-out quotes rendered as `<figure><blockquote>`
- [ ] All CTAs link to `/contact/`
- [ ] All four schema nodes present: `WebPage`, `Service`, `FAQPage`, `Person`
- [ ] Schema injected via `slot="head"`
- [ ] `datePublished` / `dateModified` in schema use ISO strings, not display strings
- [ ] `FAQPage` includes every FAQ question from the page
- [ ] Schema `@id` for each node uses the correct slug / person ID
- [ ] `serviceType`, `price`, and `priceCurrency` are accurate
- [ ] Validated with Google Rich Results Test
- [ ] Page has been added to the header nav if needed (in `src/data/site.ts`)
- [ ] `rm -rf dist && npm run build && npm run deploy` run successfully
