export const categories = [
  {
    slug: 'ai-automations',
    label: 'AI Automations',
    taxId: 'tax_cat_ai_automations',
    description: 'Practical guides to the AI tools and workflows that save you time and help your business run smarter.',
  },
  {
    slug: 'ai-visibility',
    label: 'AI Visibility (GEO)',
    taxId: 'tax_cat_ai_visibility',
    description: 'How to get your business found and cited by AI search tools like ChatGPT, Perplexity, and Google AI Overviews.',
  },
  {
    slug: 'seo',
    label: 'SEO & Search',
    taxId: 'tax_cat_seo',
    description: 'Everything you need to rank higher in Google — from fundamentals to the latest algorithm changes.',
  },
  {
    slug: 'content-marketing',
    label: 'Content Marketing',
    taxId: 'tax_cat_content_marketing',
    description: 'How to create content that attracts the right people, builds trust, and drives sales.',
  },
  {
    slug: 'social-media',
    label: 'Social Media',
    taxId: 'tax_cat_social_media',
    description: 'Platform-by-platform guides to algorithms, content formats, and growth tactics that actually work.',
  },
  {
    slug: 'website-design',
    label: 'Website & Design',
    taxId: 'tax_cat_website',
    description: 'How to build, improve, and optimise a website that performs — from design to speed to UX.',
  },
] as const;

export type Category = typeof categories[number];
