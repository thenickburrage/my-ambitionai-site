import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { categories } from '@/data/categories';

export const prerender = false;

const PROD_ORIGIN = 'https://theambitionsagency.com';

// Slugs that exist as rows in ec_posts but must NOT appear in the sitemap
// (either because they have their own static route, because they are trust
// pages served from /src/pages, or because they are deliberately excluded
// from the blog listing).
const EXCLUDED_POST_SLUGS = new Set([
  'about', 'contact', 'pricing', 'learning-centre',
  'ai-use', 'code-of-ethics', 'editorial-standards', 'security',
  'data-protection-policy', 'privacy-policy', 'cookie-policy',
  'terms-and-conditions',
]);

// Every statically-routed URL that should be indexed.
const STATIC_PATHS: Array<{ path: string; priority: number; changefreq: string }> = [
  { path: '/',                           priority: 1.00, changefreq: 'weekly'  },
  { path: '/about/',                     priority: 0.80, changefreq: 'monthly' },
  { path: '/contact/',                   priority: 0.80, changefreq: 'monthly' },
  { path: '/pricing/',                   priority: 0.90, changefreq: 'monthly' },
  { path: '/learning-centre/',           priority: 0.90, changefreq: 'weekly'  },
  { path: '/seo-aeo/',                   priority: 0.90, changefreq: 'monthly' },
  { path: '/endless-customers-coaching/', priority: 0.90, changefreq: 'monthly' },
  { path: '/website-design/',            priority: 0.90, changefreq: 'monthly' },
  { path: '/ai-voice-agent/',            priority: 0.90, changefreq: 'monthly' },
  { path: '/ai-review-automation/',      priority: 0.90, changefreq: 'monthly' },
  { path: '/19-trust-signals/',          priority: 0.80, changefreq: 'monthly' },
  { path: '/no1-salesperson/',           priority: 0.70, changefreq: 'monthly' },
  { path: '/your-ai-blueprint/',         priority: 0.70, changefreq: 'monthly' },
  { path: '/authors/nick-burrage/',      priority: 0.70, changefreq: 'monthly' },
  { path: '/authors/liyana-van-wyk/',    priority: 0.70, changefreq: 'monthly' },
  // Trust and transparency
  { path: '/ai-use/',                    priority: 0.50, changefreq: 'yearly'  },
  { path: '/code-of-ethics/',            priority: 0.50, changefreq: 'yearly'  },
  { path: '/editorial-standards/',       priority: 0.50, changefreq: 'yearly'  },
  { path: '/security/',                  priority: 0.50, changefreq: 'yearly'  },
  { path: '/data-protection-policy/',    priority: 0.50, changefreq: 'yearly'  },
  { path: '/privacy-policy/',            priority: 0.50, changefreq: 'yearly'  },
  { path: '/cookie-policy/',             priority: 0.50, changefreq: 'yearly'  },
  { path: '/terms-and-conditions/',      priority: 0.50, changefreq: 'yearly'  },
];

type PostRow = {
  slug: string;
  post_date: string | null;
  published_at: string | null;
  updated_at: string | null;
};

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function iso(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export const GET: APIRoute = async () => {
  const envAny = env as any;
  const db = envAny.DB as D1Database | undefined;

  // Gather published posts (defensive: if DB is unavailable we still emit
  // the static URLs rather than failing the whole sitemap).
  let posts: PostRow[] = [];
  if (db) {
    try {
      const { results } = await db
        .prepare(
          `SELECT slug, post_date, published_at, updated_at
             FROM ec_posts
            WHERE status = 'published'
              AND deleted_at IS NULL
            ORDER BY COALESCE(post_date, published_at, created_at) DESC`,
        )
        .all<PostRow>();
      posts = results ?? [];
    } catch {
      posts = [];
    }
  }

  const urls: string[] = [];

  // 1. Static pages
  for (const entry of STATIC_PATHS) {
    urls.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(PROD_ORIGIN + entry.path)}</loc>\n` +
      `    <changefreq>${entry.changefreq}</changefreq>\n` +
      `    <priority>${entry.priority.toFixed(2)}</priority>\n` +
      `  </url>`,
    );
  }

  // 2. Categories
  for (const cat of categories) {
    urls.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(`${PROD_ORIGIN}/category/${cat.slug}/`)}</loc>\n` +
      `    <changefreq>weekly</changefreq>\n` +
      `    <priority>0.70</priority>\n` +
      `  </url>`,
    );
  }

  // 3. Published blog posts
  for (const post of posts) {
    if (EXCLUDED_POST_SLUGS.has(post.slug)) continue;
    const lastmod = iso(post.updated_at) || iso(post.published_at) || iso(post.post_date);
    urls.push(
      `  <url>\n` +
      `    <loc>${xmlEscape(`${PROD_ORIGIN}/${post.slug}/`)}</loc>\n` +
      (lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : '') +
      `    <changefreq>monthly</changefreq>\n` +
      `    <priority>0.64</priority>\n` +
      `  </url>`,
    );
  }

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.join('\n') +
    `\n</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
