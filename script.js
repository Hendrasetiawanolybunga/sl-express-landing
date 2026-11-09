/**
 * PT. Smail Logistik Express (SL Express) - Main JavaScript
 * Description: Real-time search, filters, instant shipping calculator, mobile navigation, and interactive UI
 * Author: Senior Frontend Web Developer & UI/UX Specialist
 * Pure Vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. DYNAMIC COPYRIGHT YEAR
  // =========================================================================
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 2. STICKY NAVBAR ON SCROLL
  // =========================================================================
  const navbar = document.getElementById('navbar');
  const handleScrollNavbar = () => {
    if (!navbar) return;
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  // =========================================================================
  // 3. MOBILE DRAWER NAVIGATION
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileClose = document.getElementById('mobileClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const openMobileMenu = () => {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    if (mobileToggle) {
      mobileToggle.classList.add('active');
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (!mobileDrawer || !drawerBackdrop) return;
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
    if (mobileToggle) {
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // =========================================================================
  // 4. ACTIVE NAVIGATION LINK (SCROLLSPY)
  // =========================================================================
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-menu .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        // Desktop links
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Mobile links
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // =========================================================================
  // 5. INTERACTIVE SHIPPING CALCULATOR (HERO WIDGET)
  // =========================================================================
  const calcDest = document.getElementById('calcDest');
  const calcWeight = document.getElementById('calcWeight');
  const resRate = document.getElementById('resRate');
  const resLead = document.getElementById('resLead');
  const resTotal = document.getElementById('resTotal');
  const calcWaBtn = document.getElementById('calcWaBtn');

  const formatRupiah = (number) => {
    return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const updateCalculator = () => {
    if (!calcDest || !calcWeight || !resRate || !resLead || !resTotal || !calcWaBtn) return;

    const selectedOption = calcDest.options[calcDest.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) return;

    const pricePerKg = parseInt(selectedOption.dataset.price, 10) || 8000;
    const leadTime = selectedOption.dataset.lead || '4-7 Hari';
    const cityName = selectedOption.text.split(' - ')[0].replace(' (Prioritas)', '').replace(' (Termurah)', '');

    let weight = parseFloat(calcWeight.value);
    if (isNaN(weight) || weight <= 0) {
      weight = 1;
    }

    const totalEstimate = pricePerKg * weight;

    // Display formatted outputs
    resRate.textContent = formatRupiah(pricePerKg);
    resLead.textContent = leadTime;
    resTotal.textContent = formatRupiah(totalEstimate);

    // Build pre-filled WhatsApp greeting message
    const waText = encodeURIComponent(
      `Halo Admin SL Express, saya ingin konfirmasi pengiriman kargo:\n` +
      `- Rute: Jakarta ke ${cityName}\n` +
      `- Estimasi Berat: ${weight} Kg\n` +
      `- Estimasi Tarif: ${formatRupiah(pricePerKg)}/Kg (Total: ${formatRupiah(totalEstimate)})\n` +
      `- Lead Time: ${leadTime}\n\n` +
      `Mohon info ketersediaan slot armada dan jadwal keberangkatan terdekat. Terima kasih.`
    );

    calcWaBtn.href = `https://wa.me/628111319553?text=${waText}`;
  };

  if (calcDest && calcWeight) {
    // Set initial default to Batam
    calcDest.value = 'batam';
    calcWeight.addEventListener('input', updateCalculator);
    calcDest.addEventListener('change', updateCalculator);
    updateCalculator();
  }

  // =========================================================================
  // 6. RUTE & TARIF REAL-TIME SEARCH & CATEGORY FILTER
  // =========================================================================
  const searchInput = document.getElementById('routeSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const tableRows = document.querySelectorAll('.route-row');
  const routeCountText = document.getElementById('routeCountText');
  const emptyState = document.getElementById('emptySearchState');
  const routeTable = document.getElementById('routeTable');

  let activeCategory = 'all';

  const filterTable = () => {
    if (!searchInput || !tableRows.length) return;

    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    tableRows.forEach(row => {
      const cityKeywords = (row.dataset.city || '').toLowerCase();
      const rowCategory = (row.dataset.category || '').toLowerCase();

      // Check category match
      const matchesCategory = (activeCategory === 'all') || (rowCategory === activeCategory);

      // Check search keyword match
      const matchesQuery = !query || cityKeywords.includes(query);

      if (matchesCategory && matchesQuery) {
        row.style.display = '';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });

    // Toggle clear search button
    if (clearSearchBtn) {
      clearSearchBtn.style.display = query.length > 0 ? 'block' : 'none';
    }

    // Update results count display
    if (routeCountText) {
      routeCountText.innerHTML = `Menampilkan <strong>${visibleCount}</strong> rute pengiriman`;
    }

    // Toggle empty state and table visibility
    if (emptyState && routeTable) {
      if (visibleCount === 0) {
        emptyState.style.display = 'block';
        routeTable.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        routeTable.style.display = 'table';
      }
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', filterTable);
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
        filterTable();
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter || 'all';
      filterTable();
    });
  });

  // =========================================================================
  // 7. FAQ ACCORDION
  // =========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items first for clean accordion behavior
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) {
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // If it wasn't active, activate it
      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 8. BACK TO TOP BUTTON
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTop');

  const toggleBackToTop = () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleBackToTop, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 9. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
  // =========================================================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

});

