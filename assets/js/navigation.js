/**
 * WonderPlay - Unified Navigation, Dropdowns & Active State Engine
 * Handles automatic path detection, desktop navbar dropdowns, mobile drawer accordions,
 * active states for public/dashboard/admin portals, and responsive resize auto-reset.
 */

(function () {
  // ============================================================================
  // 1. GLOBAL ACTIVE STATE DETECTOR
  // ============================================================================
  function setActiveNavigation() {
    const pathname = window.location.pathname.toLowerCase().replace(/\\/g, '/');
    let currentFile = pathname.split('/').pop() || 'index.html';
    if (currentFile === '' || currentFile === '/') currentFile = 'index.html';

    const isAdmin = pathname.includes('/admin/') || pathname.endsWith('/admin');
    const isDashboard = (pathname.includes('/dashboard/') || pathname.endsWith('/dashboard')) && !isAdmin;
    const isHome = (currentFile === 'index.html' || currentFile === 'home2.html') && !isAdmin && !isDashboard;

    // --- 1.1 Public Desktop Navigation ---
    const desktopLinks = document.querySelectorAll('#main-header nav a, #main-header .nav-link-item');
    const dropdownWrappers = document.querySelectorAll('#main-header .dropdown-wrapper');

    desktopLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase().replace(/\\/g, '/');
      if (!href) return;
      const linkFile = href.split('/').pop();

      // Don't mark triggers directly here
      if (link.classList.contains('dropdown-trigger')) return;

      if (!isAdmin && !isDashboard && (linkFile === currentFile || (currentFile === 'index.html' && (linkFile === '' || linkFile === 'index.html')))) {
        link.classList.add('active', 'nav-link-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active', 'nav-link-active');
        link.removeAttribute('aria-current');
      }
    });

    // Handle Dropdown Triggers
    dropdownWrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.dropdown-trigger');
      const triggerText = trigger?.querySelector('span')?.textContent?.trim()?.toLowerCase();
      if (!trigger) return;

      let isTriggerActive = false;

      if (triggerText === 'home' && isHome) {
        isTriggerActive = true;
      } else if (triggerText === 'dashboard' && (isAdmin || isDashboard)) {
        isTriggerActive = true;
      }

      if (isTriggerActive) {
        trigger.classList.add('active', 'nav-link-active', 'text-primary');
        trigger.setAttribute('aria-current', 'page');
      } else {
        trigger.classList.remove('active', 'nav-link-active', 'text-primary');
        trigger.removeAttribute('aria-current');
      }

      // Highlight specific sub-items inside this dropdown
      wrapper.querySelectorAll('.dropdown-menu a').forEach(item => {
        const href = item.getAttribute('href')?.toLowerCase().replace(/\\/g, '/');
        if (!href) return;

        let isItemActive = false;
        if (isAdmin && href.includes('/admin/')) {
          isItemActive = true;
        } else if (isDashboard && href.includes('/dashboard/')) {
          isItemActive = true;
        } else if (isHome) {
          const itemFile = href.split('/').pop();
          if (itemFile === currentFile || (currentFile === 'index.html' && (itemFile === '' || itemFile === 'index.html'))) {
            isItemActive = true;
          }
        }

        if (isItemActive) {
          item.classList.add('active', 'dropdown-item-active');
        } else {
          item.classList.remove('active', 'dropdown-item-active');
        }
      });
    });

    // --- 1.2 Mobile Drawer Navigation ---
    const mobileLinks = document.querySelectorAll('#mobile-drawer a, #mobile-drawer .mobile-nav-link');
    mobileLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase().replace(/\\/g, '/');
      if (!href) return;
      const linkFile = href.split('/').pop();

      let isMobileActive = false;
      if (isAdmin && href.includes('/admin/')) {
        isMobileActive = true;
      } else if (isDashboard && href.includes('/dashboard/')) {
        isMobileActive = true;
      } else if (!isAdmin && !isDashboard && (linkFile === currentFile || (currentFile === 'index.html' && (linkFile === '' || linkFile === 'index.html')))) {
        isMobileActive = true;
      }

      if (isMobileActive) {
        link.classList.add('active', 'nav-link-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active', 'nav-link-active');
        link.removeAttribute('aria-current');
      }
    });

    // --- 1.3 Admin & Dashboard Sidebar Links ---
    const sidebarLinks = document.querySelectorAll('aside a, .sidebar-nav-link');
    sidebarLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase().replace(/\\/g, '/');
      if (!href) return;
      const linkFile = href.split('/').pop().split('?')[0].split('#')[0];

      // Exclude sign-out button
      if (href.includes('login.html')) return;

      let isSidebarActive = false;
      if (linkFile === currentFile) {
        isSidebarActive = true;
      } else if (currentFile === 'parent-details.html' && linkFile === 'parents.html') {
        isSidebarActive = true;
      } else if (currentFile === 'book-session.html' && linkFile === 'book-visit.html') {
        isSidebarActive = true;
      } else if (currentFile === 'memberships.html' && linkFile === 'membership.html') {
        isSidebarActive = true;
      } else if ((currentFile === 'birthday-bookings.html' || currentFile === 'party-bookings.html') && linkFile === 'birthday-parties.html') {
        isSidebarActive = true;
      }

      if (link.closest('#dashboard-sidebar') || link.classList.contains('sidebar-nav-link')) {
        if (isSidebarActive) {
          link.classList.remove('text-text-main', 'hover:bg-primary-light', 'hover:text-primary');
          link.classList.add('bg-primary', 'text-white', 'active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('bg-primary', 'text-white', 'active');
          link.classList.add('text-text-main', 'hover:bg-primary-light', 'hover:text-primary');
          link.removeAttribute('aria-current');
        }
      } else if (link.closest('#admin-sidebar')) {
        if (isSidebarActive) {
          link.classList.remove('text-text-main', 'hover:bg-surface-alt', 'hover:text-primary');
          link.classList.add('bg-primary', 'text-white', 'active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('bg-primary', 'text-white', 'active');
          link.classList.add('text-text-main', 'hover:bg-surface-alt', 'hover:text-primary');
          link.removeAttribute('aria-current');
        }
      } else {
        if (isSidebarActive) {
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');
        } else {
          link.classList.remove('active');
          link.removeAttribute('aria-current');
        }
      }
    });

    // --- 1.4 Dashboard Mobile Quick Bar Links ---
    const quickBarLinks = document.querySelectorAll('main .overflow-x-auto a');
    quickBarLinks.forEach(link => {
      const href = link.getAttribute('href')?.toLowerCase().replace(/\\/g, '/');
      if (!href) return;
      const linkFile = href.split('/').pop().split('?')[0].split('#')[0];

      let isQuickActive = (linkFile === currentFile);
      if (currentFile === 'book-session.html' && (linkFile === 'book-visit.html' || linkFile === 'book-session.html')) isQuickActive = true;
      if (currentFile === 'memberships.html' && (linkFile === 'membership.html' || linkFile === 'memberships.html')) isQuickActive = true;
      if ((currentFile === 'birthday-bookings.html' || currentFile === 'party-bookings.html') && (linkFile === 'birthday-parties.html' || linkFile === 'birthday-bookings.html' || linkFile === 'party-bookings.html')) isQuickActive = true;

      if (isQuickActive) {
        link.classList.remove('bg-surface', 'border', 'border-border', 'text-text-main');
        link.classList.add('bg-primary', 'text-white');
      } else {
        link.classList.remove('bg-primary', 'text-white');
        link.classList.add('bg-surface', 'border', 'border-border', 'text-text-main');
      }
    });
  }

  // ============================================================================
  // 2. DROPDOWNS, DRAWER & RESPONSIVE EVENT HANDLERS
  // ============================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const navHeader = document.getElementById('main-header');

    // Sticky header with dynamic blur effect
    if (navHeader) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
          navHeader.classList.add('shadow-md', 'backdrop-blur-md');
          navHeader.style.backgroundColor = document.documentElement.classList.contains('dark')
            ? 'rgba(33, 26, 56, 0.95)'
            : 'rgba(255, 248, 240, 0.95)';
        } else {
          navHeader.classList.remove('shadow-md', 'backdrop-blur-md');
          navHeader.style.backgroundColor = '';
        }
      }, { passive: true });
    }

    // Desktop Dropdowns Manager (Hover & Click & Keyboard)
    document.querySelectorAll('.dropdown-wrapper').forEach(wrapper => {
      const btn = wrapper.querySelector('.dropdown-trigger');
      const menu = wrapper.querySelector('.dropdown-menu');
      const arrow = wrapper.querySelector('.dropdown-arrow');

      if (btn && menu) {
        function openMenu() {
          menu.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
          menu.classList.add('opacity-100', 'visible', 'pointer-events-auto');
          btn.setAttribute('aria-expanded', 'true');
          if (arrow) arrow.classList.add('rotate-180');
        }

        function closeMenu() {
          menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
          menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
          btn.setAttribute('aria-expanded', 'false');
          if (arrow) arrow.classList.remove('rotate-180');
        }

        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = menu.classList.contains('visible');
          document.querySelectorAll('.dropdown-menu').forEach(m => {
            if (m !== menu) {
              m.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
              m.classList.add('opacity-0', 'invisible', 'pointer-events-none');
            }
          });
          document.querySelectorAll('.dropdown-arrow').forEach(a => {
            if (a !== arrow) a.classList.remove('rotate-180');
          });
          if (isOpen) {
            closeMenu();
          } else {
            openMenu();
          }
        });

        wrapper.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1280) openMenu();
        });

        wrapper.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 1280) closeMenu();
        });

        wrapper.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') closeMenu();
        });
      }
    });

    // Close desktop dropdowns on document click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
          menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        });
        document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
          arrow.classList.remove('rotate-180');
        });
        document.querySelectorAll('.dropdown-trigger').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Mobile Navigation Drawer Functions
    function openDrawer() {
      if (!mobileDrawer || !drawerOverlay) return;
      mobileDrawer.classList.add('open');
      mobileDrawer.classList.remove('translate-x-full', '-translate-x-full');
      drawerOverlay.classList.remove('hidden', 'opacity-0');
      drawerOverlay.classList.add('opacity-100');
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
    }

    function closeDrawer() {
      if (!mobileDrawer || !drawerOverlay) return;
      mobileDrawer.classList.remove('open');

      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      if (isRtl) {
        mobileDrawer.classList.add('-translate-x-full');
      } else {
        mobileDrawer.classList.add('translate-x-full');
      }

      drawerOverlay.classList.remove('opacity-100');
      drawerOverlay.classList.add('opacity-0');
      setTimeout(() => {
        drawerOverlay.classList.add('hidden');
      }, 250);

      document.body.style.overflow = '';
      document.body.classList.remove('menu-open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.style.transform = '';
      mobileDrawer.style.left = '';
      mobileDrawer.style.right = '';
    }

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileDrawer && mobileDrawer.classList.contains('open');
        if (isOpen) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    }

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer when clicking any link inside it
    if (mobileDrawer) {
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          closeDrawer();
        });
      });
    }

    // ESC key closes drawer and dropdowns
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (mobileDrawer && mobileDrawer.classList.contains('open')) {
          closeDrawer();
        }
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
          menu.classList.add('opacity-0', 'invisible', 'pointer-events-none');
        });
        document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
          arrow.classList.remove('rotate-180');
        });
      }
    });

    // Mobile submenu accordions
    document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const submenu = btn.nextElementSibling;
        const icon = btn.querySelector('.dropdown-arrow') || btn.querySelector('[data-lucide="chevron-down"]');
        if (submenu) {
          const isHidden = submenu.classList.contains('hidden');
          submenu.classList.toggle('hidden');
          if (icon) {
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        }
      });
    });

    // Viewport resize auto-close (>= 1024px)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth >= 1024) {
          closeDrawer();
        }
      }, 50);
    });

    // Initialize global active navigation
    setActiveNavigation();
  });
})();
