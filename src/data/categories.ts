// Learning Centre categories. Order here = order of the filter chips.
// `taxId` can be a single string or an array of strings. When an array,
// the category listing page treats the category as a merge of all listed
// taxonomy IDs (used by SEO & AEO which merged the old AI Visibility and
// SEO & Search taxonomies).
export const categories = [
  {
    slug: 'seo-aeo',
    label: 'SEO & AEO',
    taxId: ['tax_cat_seo', 'tax_cat_ai_visibility'],
    description: 'How to rank in Google and get cited by AI tools like ChatGPT, Perplexity, and Google AI Overviews — the combined SEO and Answer Engine Optimisation playbook.',
  },
  {
    slug: 'endless-customers',
    label: 'Endless Customers',
    taxId: 'tax_cat_content_marketing',
    description: "Guides to Marcus Sheridan's Endless Customers framework (formerly They Ask You Answer) and the content strategy that drives real business growth.",
  },
  {
    slug: 'websites',
    label: 'Websites',
    taxId: 'tax_cat_website',
    description: 'How to build, improve, and optimise a website that performs — from design to speed to UX to AI-era structure.',
  },
  {
    slug: 'ai-automations',
    label: 'AI Automations',
    taxId: 'tax_cat_ai_automations',
    description: 'Practical guides to the AI tools and workflows that save you time and help your business run smarter.',
  },
  {
    slug: 'reviews',
    label: 'Reviews',
    taxId: 'tax_cat_reviews',
    description: 'Why online reviews matter more than ever and how to collect, respond to, and use them to win more business.',
  },
] as const;

export type Category = typeof categories[number];
