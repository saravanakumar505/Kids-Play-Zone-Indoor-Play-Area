/**
 * WonderPlay - Core UI Components, Animations & Utilities
 */

// Safe Lucide creator
function safeInitLucide(root = document) {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons({ root });
    } catch (e) {
      // Ignore missing or unsupported icon names safely
    }
  }
}

// Toast notification helper
window.showToast = function (message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast-item';

  let iconName = 'info';
  let badgeClass = 'text-primary bg-primary-light';
  if (type === 'success') {
    iconName = 'check-circle';
    badgeClass = 'text-mint bg-mint-light';
  } else if (type === 'error') {
    iconName = 'alert-circle';
    badgeClass = 'text-coral bg-coral-light';
  }

  toast.innerHTML = `
    <div class="w-8 h-8 rounded-full flex items-center justify-center ${badgeClass} shrink-0">
      <i data-lucide="${iconName}" class="w-4 h-4"></i>
    </div>
    <div class="flex-1 font-medium text-sm text-text-main">${message}</div>
    <button class="text-text-muted hover:text-text-main text-xs p-1" onclick="this.parentElement.remove()">
      <i data-lucide="x" class="w-3.5 h-3.5"></i>
    </button>
  `;

  container.appendChild(toast);
  safeInitLucide(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
};

// Modal Engine
function initModals() {
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) {
        openModal(modal);
      }
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-container');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        const modal = backdrop.closest('.modal-container');
        if (modal) {
          closeModal(modal);
        }
      }
    });
  });
}

function openModal(modal) {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  const content = modal.querySelector('.modal-content');
  if (content) {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }
}

function closeModal(modal) {
  const content = modal.querySelector('.modal-content');
  if (content) {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
  }
  setTimeout(() => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }, 200);
}

// Tab switcher
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(group => {
    const triggers = group.querySelectorAll('[data-tab-target]');
    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = trigger.getAttribute('data-tab-target');
        
        triggers.forEach(t => {
          t.classList.remove('active', 'bg-primary', 'text-white');
          t.classList.add('bg-white', 'text-text-main', 'dark:bg-surface');
        });

        trigger.classList.add('active', 'bg-primary', 'text-white');
        trigger.classList.remove('bg-white', 'text-text-main', 'dark:bg-surface');

        const container = group.closest('.tabs-wrapper') || document;
        container.querySelectorAll('[data-tab-pane]').forEach(pane => {
          if (pane.id === targetId) {
            pane.classList.remove('hidden');
          } else {
            pane.classList.add('hidden');
          }
        });
      });
    });
  });
}

// Accordion (FAQ)
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const icon = header.querySelector('.accordion-icon');
      const isOpen = !content.classList.contains('hidden');

      const parent = header.closest('.accordion-group');
      if (parent) {
        parent.querySelectorAll('.accordion-content').forEach(c => c.classList.add('hidden'));
        parent.querySelectorAll('.accordion-icon').forEach(i => {
          i.style.transform = 'rotate(0deg)';
        });
      }

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (icon) icon.style.transform = 'rotate(0deg)';
      }
    });
  });
}

// Animated Numerical Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter-val');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10) || 0;
        const duration = 1600;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = countTo / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= countTo) {
            target.textContent = countTo.toLocaleString() + (target.getAttribute('data-suffix') || '+');
            clearInterval(timer);
          } else {
            target.textContent = Math.floor(current).toLocaleString();
          }
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));
}

// Age Filter for Play Zones
function initZoneFilter() {
  const filterBtns = document.querySelectorAll('.zone-filter-btn');
  const zoneCards = document.querySelectorAll('.zone-item-card');

  if (!filterBtns.length || !zoneCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const ageGroup = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-white');
        b.classList.add('bg-white', 'text-text-main', 'dark:bg-surface');
      });

      btn.classList.add('bg-primary', 'text-white');
      btn.classList.remove('bg-white', 'text-text-main', 'dark:bg-surface');

      zoneCards.forEach(card => {
        const cardAges = card.getAttribute('data-age-group') || '';
        if (ageGroup === 'all' || cardAges.includes(ageGroup)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================================================
// GLOBAL SCROLL-TRIGGERED ANIMATION OBSERVER
// ============================================================================
function initGlobalScrollAnimations() {
  // If user prefers reduced motion, skip scroll animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Target sections, cards, and interactive blocks
  const animTargets = document.querySelectorAll('section > div, .card-playful, .zone-item-card, .accordion-group, .hero-content-block');
  
  if (!animTargets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  animTargets.forEach((el, index) => {
    // Avoid double attaching
    if (!el.classList.contains('reveal-init')) {
      el.classList.add('reveal-init');
      // Assign subtle stagger delay to grid siblings
      const siblingIndex = Array.from(el.parentElement?.children || []).indexOf(el);
      if (siblingIndex > 0 && siblingIndex <= 6) {
        el.classList.add(`stagger-${Math.min(siblingIndex, 6)}`);
      }
      observer.observe(el);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initTabs();
  initAccordions();
  initCounters();
  initZoneFilter();
  initGlobalScrollAnimations();
  safeInitLucide();
});
