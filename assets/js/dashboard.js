/**
 * WonderPlay - Parent / Customer Dashboard Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check-In QR Pass Modal trigger
  const qrPassBtn = document.getElementById('view-qr-pass-btn');
  const qrModal = document.getElementById('qr-pass-modal');
  if (qrPassBtn && qrModal) {
    qrPassBtn.addEventListener('click', (e) => {
      e.preventDefault();
      qrModal.classList.remove('hidden');
    });
  }

  // Reschedule Booking Modal trigger
  document.querySelectorAll('.btn-reschedule').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookingId = btn.getAttribute('data-id') || 'WP-98214';
      if (window.showToast) {
        window.showToast(`Rescheduling slot for ${bookingId}. Opening scheduler...`, 'info');
      }
    });
  });

  // Cancel Booking Action
  document.querySelectorAll('.btn-cancel-booking').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('Are you sure you want to cancel this play session booking?')) {
        const row = btn.closest('tr') || btn.closest('.booking-card-item');
        if (row) {
          row.style.opacity = '0.5';
          const badge = row.querySelector('.status-badge');
          if (badge) {
            badge.className = 'status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
            badge.textContent = 'Cancelled';
          }
        }
        if (window.showToast) {
          window.showToast('Booking cancelled. Refund credited to your wallet.', 'success');
        }
      }
    });
  });

  // Filter Visit History
  const historyTabs = document.querySelectorAll('.history-filter-btn');
  const historyRows = document.querySelectorAll('.history-row-item');
  if (historyTabs.length && historyRows.length) {
    historyTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-status');
        historyTabs.forEach(t => {
          t.classList.remove('bg-primary', 'text-white');
          t.classList.add('bg-white', 'text-text-main', 'dark:bg-surface');
        });
        tab.classList.add('bg-primary', 'text-white');
        tab.classList.remove('bg-white', 'text-text-main', 'dark:bg-surface');

        historyRows.forEach(row => {
          const status = row.getAttribute('data-row-status');
          if (filter === 'all' || status === filter) {
            row.classList.remove('hidden');
          } else {
            row.classList.add('hidden');
          }
        });
      });
    });
  }

  // Initialize Responsive Mobile/Tablet Dashboard Drawer Navigation
  initDashboardDrawer();
});

/**
 * Responsive Side Navigation Drawer for Parent Portal Dashboard
 * Supports 360px and 768px viewports, LTR/RTL, smooth transitions, overlay, and keyboard navigation.
 */
function initDashboardDrawer() {
  const hamburgerBtn = document.getElementById('dashboard-hamburger-btn');
  const sidebar = document.getElementById('dashboard-sidebar');
  const overlay = document.getElementById('dashboard-drawer-overlay');
  const closeBtn = document.getElementById('dashboard-close-drawer-btn');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (err) {
      console.warn('Lucide icon error', err);
    }
  }

  if (!sidebar) return;

  function openDrawer() {
    sidebar.classList.add('drawer-open');
    if (overlay) {
      overlay.classList.remove('hidden');
      void overlay.offsetWidth; // Force reflow for smooth opacity transition
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');
    }
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
  }

  function closeDrawer() {
    sidebar.classList.remove('drawer-open');
    if (overlay) {
      overlay.classList.remove('opacity-100');
      overlay.classList.add('opacity-0');
      setTimeout(() => {
        if (!sidebar.classList.contains('drawer-open')) {
          overlay.classList.add('hidden');
        }
      }, 300);
    }
    if (hamburgerBtn) {
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sidebar.classList.contains('drawer-open');
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      closeDrawer();
    });
  }

  // Keyboard accessibility: ESC closes the drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });

  // Close drawer when clicking any link inside sidebar on mobile/tablet viewports (< 1024px)
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        closeDrawer();
      }
    });
  });

  // Close drawer if window is resized to desktop width (>= 1024px)
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024 && sidebar.classList.contains('drawer-open')) {
      closeDrawer();
    }
  });
}

