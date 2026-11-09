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

  // Calculator Mode Switcher Elements
  const tabModeWeight = document.getElementById('tabModeWeight');
  const tabModeVolume = document.getElementById('tabModeVolume');
  const calcWeightGroup = document.getElementById('calcWeightGroup');
  const calcVolumeGroup = document.getElementById('calcVolumeGroup');
  const volLength = document.getElementById('volLength');
  const volWidth = document.getElementById('volWidth');
  const volHeight = document.getElementById('volHeight');
  const volCalculatedWeight = document.getElementById('volCalculatedWeight');

  let currentCalcMode = 'weight'; // 'weight' or 'volume'

  const formatRupiah = (number) => {
    return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const getEffectiveWeight = () => {
    if (currentCalcMode === 'volume') {
      const p = parseFloat(volLength?.value) || 0;
      const l = parseFloat(volWidth?.value) || 0;
      const t = parseFloat(volHeight?.value) || 0;
      // Standar Kargo Udara/Darat/Laut: (P x L x T) / 4000
      const volKg = Math.max(1, Math.ceil((p * l * t) / 4000));
      if (volCalculatedWeight) {
        volCalculatedWeight.textContent = volKg;
      }
      return volKg;
    } else {
      let weight = parseFloat(calcWeight?.value);
      if (isNaN(weight) || weight <= 0) {
        weight = 1;
      }
      return weight;
    }
  };

  const updateCalculator = () => {
    if (!calcDest || !resRate || !resLead || !resTotal || !calcWaBtn) return;

    const selectedOption = calcDest.options[calcDest.selectedIndex];
    if (!selectedOption || !selectedOption.dataset.price) return;

    const pricePerKg = parseInt(selectedOption.dataset.price, 10) || 3500;
    const leadTime = selectedOption.dataset.lead || '4-7 Hari';
    const cityName = selectedOption.text.split(' - ')[0]
      .replace(' (Prioritas)', '')
      .replace(' (Termurah)', '')
      .replace(' (Promo Tonase)', '');

    const weight = getEffectiveWeight();
    const totalEstimate = pricePerKg * weight;

    // Display formatted outputs
    resRate.textContent = formatRupiah(pricePerKg);
    resLead.textContent = leadTime;
    resTotal.textContent = formatRupiah(totalEstimate);

    // Build pre-filled WhatsApp greeting message
    const isPromo = selectedOption.value === 'batam-promo';
    const modeNote = currentCalcMode === 'volume' 
      ? ` (Hitungan Kubikasi Volume ${volLength?.value || 0}x${volWidth?.value || 0}x${volHeight?.value || 0} cm)` 
      : '';

    const waText = encodeURIComponent(
      `Halo Admin SL Express, saya ingin konfirmasi pengiriman kargo:\n` +
      `- Rute: Jakarta ke ${cityName}${isPromo ? ' (Promo Spesial Rp3.500/kg)' : ''}\n` +
      `- Estimasi Berat: ${weight} Kg${modeNote}\n` +
      `- Estimasi Tarif: ${formatRupiah(pricePerKg)}/Kg (Total: ${formatRupiah(totalEstimate)})\n` +
      `- Lead Time: ${leadTime}\n\n` +
      `Mohon info ketersediaan slot armada dan jadwal kapal terdekat. Terima kasih.`
    );

    calcWaBtn.href = `https://wa.me/628111319553?text=${waText}`;
  };

  if (tabModeWeight && tabModeVolume) {
    tabModeWeight.addEventListener('click', () => {
      currentCalcMode = 'weight';
      tabModeWeight.classList.add('active');
      tabModeWeight.setAttribute('aria-selected', 'true');
      tabModeVolume.classList.remove('active');
      tabModeVolume.setAttribute('aria-selected', 'false');
      if (calcWeightGroup) calcWeightGroup.style.display = 'block';
      if (calcVolumeGroup) calcVolumeGroup.style.display = 'none';
      updateCalculator();
    });

    tabModeVolume.addEventListener('click', () => {
      currentCalcMode = 'volume';
      tabModeVolume.classList.add('active');
      tabModeVolume.setAttribute('aria-selected', 'true');
      tabModeWeight.classList.remove('active');
      tabModeWeight.setAttribute('aria-selected', 'false');
      if (calcWeightGroup) calcWeightGroup.style.display = 'none';
      if (calcVolumeGroup) calcVolumeGroup.style.display = 'block';
      updateCalculator();
    });
  }

  [volLength, volWidth, volHeight].forEach(inp => {
    if (inp) inp.addEventListener('input', updateCalculator);
  });

  if (calcDest && calcWeight) {
    // Set initial default to Batam Promo
    calcDest.value = 'batam-promo';
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

  // =========================================================================
  // 10. BOOKING & PICKUP CONSULTATION MODAL
  // =========================================================================
  const modalTriggers = document.querySelectorAll('.modal-trigger-btn');
  const bookingModal = document.getElementById('bookingModalBackdrop');
  const closeBookingModal = document.getElementById('closeBookingModal');
  const bookingModalForm = document.getElementById('bookingModalForm');

  const openModal = () => {
    if (bookingModal) {
      bookingModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (bookingModal) {
      bookingModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  if (closeBookingModal) {
    closeBookingModal.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && bookingModal && bookingModal.classList.contains('active')) {
      closeModal();
    }
  });

  if (bookingModalForm) {
    bookingModalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookName')?.value || '-';
      const wa = document.getElementById('bookWa')?.value || '-';
      const origin = document.getElementById('bookOrigin')?.value || 'Jakarta';
      const dest = document.getElementById('bookDest')?.value || '-';
      const itemType = document.getElementById('bookItemType')?.value || '-';
      const estWeight = document.getElementById('bookEstWeight')?.value || '-';
      const notes = document.getElementById('bookNotes')?.value || '-';

      const needsPickup = document.getElementById('checkPickup')?.checked ? 'Ya (Jemput Jakarta)' : 'Tidak (Drop Gudang Cipayung)';
      const needsPacking = document.getElementById('checkPacking')?.checked ? 'Ya (Packing Kayu)' : 'Tidak';
      const needsInsurance = document.getElementById('checkInsurance')?.checked ? 'Ya (Asuransi)' : 'Tidak';

      const msg = encodeURIComponent(
        `Halo Admin SL Express, saya ingin mengajukan permintaan penjemputan/pengiriman kargo:\n\n` +
        `*Data Pengirim:*\n` +
        `- Nama/Perusahaan: ${name}\n` +
        `- No. WhatsApp: ${wa}\n` +
        `- Lokasi Penjemputan: ${origin}\n` +
        `- Kota Tujuan: ${dest}\n\n` +
        `*Rincian Barang:*\n` +
        `- Jenis Barang: ${itemType}\n` +
        `- Estimasi Bobot/Volume: ${estWeight}\n\n` +
        `*Layanan Tambahan:*\n` +
        `- Penjemputan: ${needsPickup}\n` +
        `- Packing Kayu: ${needsPacking}\n` +
        `- Asuransi: ${needsInsurance}\n\n` +
        `*Catatan Khusus:*\n${notes}\n\n` +
        `Mohon konfirmasi jadwal dan estimasi biayanya. Terima kasih.`
      );

      closeModal();
      window.open(`https://wa.me/628111319553?text=${msg}`, '_blank');
    });
  }

  // =========================================================================
  // 11. PREMIUM GALLERY LIGHTBOX POPUP MODAL
  // =========================================================================
  const galleryCards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('galleryLightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxBadge = document.getElementById('lightboxBadge');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const currentImgIdx = document.getElementById('currentImgIdx');
  const totalImgCount = document.getElementById('totalImgCount');

  if (galleryCards.length && lightbox && lightboxImg) {
    const galleryItems = Array.from(galleryCards).map(card => {
      const img = card.querySelector('.gallery-img');
      const badge = card.querySelector('.gallery-badge');
      const title = card.querySelector('.caption-title');
      const desc = card.querySelector('.caption-text');

      return {
        src: card.dataset.src || (img ? img.getAttribute('src') : ''),
        alt: img ? img.getAttribute('alt') : 'Aktivitas Operasional SL Express',
        title: card.dataset.title || (title ? title.textContent : ''),
        badge: card.dataset.badge || (badge ? badge.textContent.trim() : 'Operasional'),
        desc: card.dataset.desc || (desc ? desc.textContent : '')
      };
    });

    if (totalImgCount) {
      totalImgCount.textContent = galleryItems.length;
    }

    let currentPhotoIndex = 0;

    const renderLightboxContent = (index) => {
      const item = galleryItems[index];
      if (!item) return;

      if (lightboxImg) {
        lightboxImg.classList.add('fade-out');
        setTimeout(() => {
          lightboxImg.src = item.src;
          lightboxImg.alt = item.alt;
          lightboxImg.classList.remove('fade-out');
        }, 120);
      }

      if (currentImgIdx) {
        currentImgIdx.textContent = index + 1;
      }

      if (lightboxTitle) {
        lightboxTitle.textContent = item.title;
      }

      if (lightboxBadge) {
        lightboxBadge.innerHTML = `<i class="fa-solid fa-camera"></i> ${item.badge}`;
      }

      if (lightboxDesc) {
        lightboxDesc.textContent = item.desc;
      }
    };

    const openLightbox = (index) => {
      currentPhotoIndex = index;
      renderLightboxContent(currentPhotoIndex);
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const nextPhoto = () => {
      currentPhotoIndex = (currentPhotoIndex + 1) % galleryItems.length;
      renderLightboxContent(currentPhotoIndex);
    };

    const prevPhoto = () => {
      currentPhotoIndex = (currentPhotoIndex - 1 + galleryItems.length) % galleryItems.length;
      renderLightboxContent(currentPhotoIndex);
    };

    galleryCards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(idx);
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxBackdrop) {
      lightboxBackdrop.addEventListener('click', closeLightbox);
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextPhoto();
      });
    }

    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevPhoto();
      });
    }

    // Keyboard Shortcuts (Arrow Left, Arrow Right, Escape)
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextPhoto();
      } else if (e.key === 'ArrowLeft') {
        prevPhoto();
      }
    });

    // Touch Swipe Gesture on Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          nextPhoto(); // Swipe left -> Next
        } else {
          prevPhoto(); // Swipe right -> Prev
        }
      }
    };
  }

});

