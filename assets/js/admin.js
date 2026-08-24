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
});
