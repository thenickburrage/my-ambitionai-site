/**
 * Agency Template - Main JavaScript
 */

// Initialize all modules
const init = (): void => {
  initThemeToggle();
  initMobileMenu();
  initHeaderScroll();
  initScrollAnimations();
};

/**
 * Dark mode toggle
 */
const initThemeToggle = (): void => {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
};

/**
 * Mobile menu toggle
 */
const initMobileMenu = (): void => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    menu.classList.toggle('hidden');

    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  });

  // Close menu on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking a link
  const menuLinks = menu.querySelectorAll('a');
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });
};

/**
 * Header scroll effect
 */
const initHeaderScroll = (): void => {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const updateHeader = (): void => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Initial check
  updateHeader();

  // Throttled scroll listener
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateHeader();
        ticking = false;
      });
      ticking = true;
    }
  });
};

/**
 * Scroll-triggered animations
 */
const initScrollAnimations = (): void => {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  animatedElements.forEach((el) => observer.observe(el));
};

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// TypeScript module declaration
export {};
