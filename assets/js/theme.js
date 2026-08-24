/**
 * WonderPlay - Theme Switcher Engine (Light / Dark Mode)
 */

(function () {
  const THEME_KEY = 'wonderplay_theme';

  function safeCreateIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (err) {
        // Silently catch invalid icon names
      }
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Force instant compositor/layout repaint on sticky headers, sidebars & navigation
    const repaintTargets = document.querySelectorAll('header, #main-header, #mobile-drawer, aside, nav, .navbar-container');
    repaintTargets.forEach(el => {
      if (el) void el.offsetHeight;
    });
    void document.documentElement.offsetHeight;
    
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      if (icon) {
        icon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      }
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    });

    safeCreateIcons();
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(initialTheme);

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentIsDark = document.documentElement.classList.contains('dark');
        const newTheme = currentIsDark ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, newTheme);
        applyTheme(newTheme);
      });
    });
  });

  window.toggleTheme = function() {
    const currentIsDark = document.documentElement.classList.contains('dark');
    const newTheme = currentIsDark ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
  };
})();
