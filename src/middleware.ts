import { defineMiddleware } from 'astro:middleware';

/**
 * Permanent 301 redirects.
 * Keys: incoming path (with trailing slash).
 * Values: destination path.
 */
const redirects: Record<string, string> = {
  '/nick-burrage/':                       '/authors/nick-burrage/',
  '/digital-marketing-company/nick-burrage/': '/authors/nick-burrage/',
  // Legacy WordPress category URLs → Learning Centre
  '/category/they-ask-you-answer/':       '/learning-centre/',
  '/category/digital-marketing/':         '/learning-centre/',
  '/category/sales-marketing-strategy/':  '/learning-centre/',
  '/category/website-optimisation/':      '/learning-centre/',
  // Renamed new-site categories (April 2026 tidy-up)
  '/category/ai-visibility/':             '/category/seo-aeo/',
  '/category/seo/':                       '/category/seo-aeo/',
  '/category/content-marketing/':         '/category/endless-customers/',
  '/category/social-media/':              '/learning-centre/',
  '/category/website-design/':            '/category/websites/',
  '/2025-marketing-tools/':               '/learning-centre/',
  '/seo-isnt-dead-its-evolved/':         '/geo-vs-seo-vs-aeo/',
  '/june-july-2025-google-core-update/': '/geo-vs-seo-vs-aeo/',
  '/google-march-core-update/':          '/geo-vs-seo-vs-aeo/',
  '/seo-trends-in-2025/':                '/geo-vs-seo-vs-aeo/',
  '/they-ask-you-answer-coaching-alternatives/': '/learning-centre/',
  '/they-ask-you-answer-coaching-and-content/':  '/endless-customers-coaching/',
  '/write-a-service-page/':                      '/website-design/',
  '/how-to-drive-great-seo-through-a-pillar-page/': '/entity-seo-for-geo/',
  '/content-marketing-and-seo/':                 '/endless-customers-coaching/',
  '/seo-for-blogs/':                             '/entity-seo-for-geo/',
  '/how-long-will-my-digital-marketing-take/':   '/seo-cost-uk/',
  '/power-words/':                               '/endless-customers-coaching/',
  '/subheadings/':                               '/endless-customers-coaching/',
  '/secrets-of-seo/':                            '/entity-seo-for-geo/',
  '/before-you-engage-a-web-design-agency/':     '/website-design/',
  '/semantic-keywords/':                         '/entity-seo-for-geo/',
  '/inbound-marketing-creating-content/':        '/content-marketing/',
  '/great-blog-post/':                           '/endless-customers-coaching/',
  '/content-marketing-problems/':                '/content-marketing/',
  '/they-ask-you-answer-book-summary/':          '/endless-customers-by-marcus-sheridan-book-summary-review/',
  '/marcus-sheridan/':                           '/endless-customers-coaching/',
  '/mastering-the-pinterest-algorithm/':         '/learning-centre/',
  '/mastering-the-youtube-shorts-algorithm/':    '/learning-centre/',
  '/tiktok-algorithm/':                          '/learning-centre/',
  '/perfect-instagram-reel/':                    '/learning-centre/',
  '/instagram-reel-algorithm/':                  '/learning-centre/',
  '/instagram/':                                 '/learning-centre/',
  '/facebook/':                                  '/learning-centre/',
  '/should-i-be-using-radio-ads/':               '/learning-centre/',
  '/is-seo-dead/':                               '/geo-vs-seo-vs-aeo/',
  '/digital-marketing-essentials-for-2022/':     '/learning-centre/',
  '/birth-of-the-ambitions-agency/':             '/about/',
  '/top-display-ad-agency/':                     '/learning-centre/',
  '/top-10-tips-for-creating-google-display-ads/': '/learning-centre/',
  '/why-systeme-io/':                            '/learning-centre/',
  '/metricool-unlocked/':                        '/learning-centre/',
  '/does-my-brand-need-an-update/':              '/learning-centre/',
  '/cost-of-bad-brand-design/':                  '/learning-centre/',
  '/how-to-create-a-company-brand-book/':        '/learning-centre/',
  '/hubspot-might-be-right-for-your-business/':  '/learning-centre/',
  '/best-digital-marketing-agency-in-devon/':    '/about/',
  '/unleash-the-power-of-social-listening/':     '/learning-centre/',
  '/social-media-article/':                      '/learning-centre/',
  '/six-digital-marketing-metrics/':             '/learning-centre/',
  '/set-marketing-budget/':                      '/learning-centre/',
  '/complete-digital-footprint/':                '/learning-centre/',
  '/digital-marketing-channels/':                '/learning-centre/',
  '/digital-marketing-coach/':                   '/learning-centre/',
  '/inbound/':                                   '/endless-customers-coaching/',
  '/inbound-marketing/':                         '/learning-centre/',
  '/search-engine-marketing/':                   '/entity-seo-for-geo/',
  '/content-marketing/':                         '/endless-customers-coaching/',
  '/social-media-marketing/':                    '/endless-customers-coaching/',
  '/digital-marketing/':                         '/',
  '/they-ask-you-answer/':                       '/endless-customers-coaching/',
  '/find-your-ideal-website-design-agency/':     '/website-design/',
  '/website-design-agency-understand-google/':   '/website-design/',
  '/web-design-agency-red-flag/':                '/website-design/',
  '/website-design-agency/':                     '/website-design/',
  '/they-ask-you-answer-for-hubspot-agencies/':  '/endless-customers-coaching/',
  '/website-optimisation-guide-for-leaders/':    '/website-design/',
  '/content-is-king/':                           '/endless-customers-coaching/',
  '/website-development/':                       '/website-design/',
  '/linkedin-for-business-growth/':              '/learning-centre/',
  '/leveraging-linkedin/':                       '/learning-centre/',
  '/content-repurposing/':                       '/endless-customers-coaching/',
  '/drive-website-traffic/':                     '/19-trust-signals-ai-recommends-your-business/',
  '/website-speed/':                             '/website-design/',
  '/make-your-website-load-faster/':             '/website-design/',
  '/user-experience/':                           '/website-design/',
  '/5-sales-tips-for-success-in-2023/':          '/endless-customers-coaching/',
  '/10-core-principles-of-they-ask-you-answer/': '/endless-customers-coaching/',
  '/marketing-trends/':                          '/endless-customers-coaching/',
  '/5-big-problems-they-ask-you-answer/':        '/endless-customers-coaching/',
  '/remarketing-in-digital-marketing/':          '/learning-centre/',
  '/10-seo-tips-in-2023/':                       '/learning-centre/',
  '/give-great-feedback-on-logo-design/':        '/website-design/',
  '/assumptions-and-agency-relationships/':      '/learning-centre/',
  '/small-business-website/':                    '/website-design/',
};

export const onRequest = defineMiddleware(({ request }, next) => {
  const url = new URL(request.url);

  // Normalise to trailing slash for lookup
  const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';

  const destination = redirects[path];
  if (destination) {
    return new Response(null, {
      status: 301,
      headers: { Location: destination },
    });
  }

  return next();
});
