/**
 * WonderPlay - RTL Layout Switcher Engine
 */

(function () {
  const RTL_KEY = 'wonderplay_dir';

  function safeCreateIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
      } catch (err) {
        // Silently catch invalid icon names
      }
    }
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      const text = btn.querySelector('.rtl-btn-text');
      if (text) {
        text.textContent = 'RTL';
      }
    });

    safeCreateIcons();
  }

  const savedDir = localStorage.getItem(RTL_KEY) || 'ltr';
  applyDirection(savedDir);

  document.addEventListener('DOMContentLoaded', () => {
    applyDirection(savedDir);

    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        localStorage.setItem(RTL_KEY, newDir);
        applyDirection(newDir);
      });
    });
  });

  window.toggleDirection = function () {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
    localStorage.setItem(RTL_KEY, newDir);
    applyDirection(newDir);
  };
})();
