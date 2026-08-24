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
});
