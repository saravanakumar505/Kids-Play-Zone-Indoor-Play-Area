/**
 * WonderPlay - Admin Management Dashboard Engine
 * Includes SVG chart renderers, live capacity meters, and table search/filter.
 */

document.addEventListener('DOMContentLoaded', () => {
  const capacityMeters = [
    { id: 'meter-toddler', name: 'Toddler Cove', current: 18, max: 25, color: '#52D6B5' },
    { id: 'meter-softplay', name: 'Soft Play Wonderland', current: 36, max: 40, color: '#FF7043' },
    { id: 'meter-adventure', name: 'Adventure Arena', current: 42, max: 50, color: '#5B3FD3' },
    { id: 'meter-ninja', name: 'Ninja Warrior', current: 14, max: 30, color: '#FFB74D' }
  ];

  capacityMeters.forEach(item => {
    const el = document.getElementById(item.id);
    if (el) {
      const pct = Math.round((item.current / item.max) * 100);
      el.innerHTML = `
        <div class="flex justify-between items-center text-sm font-semibold mb-1.5">
          <span class="text-text-main">${item.name}</span>
          <span class="text-text-muted">${item.current} / ${item.max} (${pct}%)</span>
        </div>
        <div class="w-full bg-border rounded-full h-3 overflow-hidden">
          <div class="h-3 rounded-full transition-all duration-700" style="width: ${pct}%; background-color: ${item.color};"></div>
        </div>
      `;
    }
  });

  // Table Search and Filter Filter
  document.querySelectorAll('.admin-table-search').forEach(input => {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      const tableId = input.getAttribute('data-target-table');
      const table = document.getElementById(tableId);
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      }
    });
  });

  // Status Filter for Admin Tables
  document.querySelectorAll('.admin-status-filter').forEach(select => {
    select.addEventListener('change', () => {
      const val = select.value.toLowerCase();
      const tableId = select.getAttribute('data-target-table');
      const table = document.getElementById(tableId);
      if (table) {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const statusEl = row.querySelector('.status-badge');
          const statusText = statusEl ? statusEl.textContent.toLowerCase().trim() : '';
          if (val === 'all' || statusText.includes(val)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      }
    });
  });

  // Quick Action Buttons (Confirm, Cancel, Reschedule, Refund)
  document.querySelectorAll('.admin-btn-confirm').forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      if (row) {
        const badge = row.querySelector('.status-badge');
        if (badge) {
          badge.className = 'status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
          badge.textContent = 'Confirmed';
        }
      }
      if (window.showToast) window.showToast('Booking status updated to Confirmed.', 'success');
    });
  });

  document.querySelectorAll('.admin-btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Cancel this customer booking?')) {
        const row = btn.closest('tr');
        if (row) {
          const badge = row.querySelector('.status-badge');
          if (badge) {
            badge.className = 'status-badge inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            badge.textContent = 'Cancelled';
          }
        }
        if (window.showToast) window.showToast('Booking marked as Cancelled.', 'info');
      }
    });
  });

  // Initialize Responsive Mobile/Tablet Admin Drawer Navigation
  initAdminDrawer();
});

if (document.readyState !== 'loading') {
  initAdminDrawer();
}

/**
 * Responsive Side Navigation Drawer for Admin Console
 * Supports mobile and tablet screen widths, smooth transitions, overlay, and keyboard navigation.
 */
let adminDrawerInitialized = false;
function initAdminDrawer() {
  window.initAdminDrawer = initAdminDrawer;
  if (adminDrawerInitialized) return;

  const hamburgerBtn = document.getElementById('admin-hamburger-btn');
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-drawer-overlay');
  const closeBtn = document.getElementById('admin-close-drawer-btn');

  if (!sidebar || !hamburgerBtn) return;
  adminDrawerInitialized = true;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (err) {
      console.warn('Lucide icon error', err);
    }
  }

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

