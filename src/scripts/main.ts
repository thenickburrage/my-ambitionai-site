// ─── Dark mode toggle ────────────────────────────────────────────────────────

const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// ─── Mobile menu toggle ───────────────────────────────────────────────────────

const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu   = document.getElementById('mobile-menu');

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden');
    mobileToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

// ─── Header scroll state ─────────────────────────────────────────────────────

const header = document.querySelector('[data-header]');

if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
