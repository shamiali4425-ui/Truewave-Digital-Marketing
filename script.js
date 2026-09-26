/**
 * TRUEWAVE DIGITAL MARKETING - MAIN JAVASCRIPT
 * Pure Vanilla JavaScript (ES6+)
 * Provides interactive features, animations, navigation, form validation, and accessible modals.
 */

function initApp() {
  'use strict';

  /* ==========================================================================
     1. STICKY HEADER & SCROLL BEHAVIOR
     ========================================================================== */
  const header = document.getElementById('site-header');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header styling on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Back to top click handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION HAMBURGER & DRAWER
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  function openMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.add('open');
    }
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'true');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove('open');
    }
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu after clicking any mobile navigation link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile menu on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     3. ACTIVE NAVIGATION LINK HIGHLIGHTING ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function updateActiveNavLink() {
    const scrollPosition = (window.scrollY || window.pageYOffset) + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  /* ==========================================================================
     4. ANIMATED STATS COUNTERS (IntersectionObserver)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeProgress * target);

      el.textContent = `${currentCount}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCount);
  }

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statsSection = document.getElementById('stats');
    if (statsSection) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsCounted) {
            statsCounted = true;
            statNumbers.forEach(numEl => animateCounter(numEl));
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      statsObserver.observe(statsSection);
    }
  }

  /* ==========================================================================
     5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Unobserve after reveal to retain performance
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     6. FAQ ACCORDION (One Open at a Time with Smooth Animation)
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerPanel = item.querySelector('.faq-answer');

    if (questionBtn && answerPanel) {
      questionBtn.addEventListener('click', () => {
        const isCurrentlyOpen = item.classList.contains('active');

        // Close all items
        faqItems.forEach(otherItem => {
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherPanel = otherItem.querySelector('.faq-answer');

          otherItem.classList.remove('active');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) {
            otherPanel.style.maxHeight = null;
            otherPanel.setAttribute('hidden', '');
          }
        });

        // If not open before, open this item
        if (!isCurrentlyOpen) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answerPanel.removeAttribute('hidden');
          answerPanel.style.maxHeight = `${answerPanel.scrollHeight + 20}px`;
        }
      });
    }
  });

  /* ==========================================================================
     7. SERVICE DETAILS MODAL & INQUIRY PRE-SELECTION
     ========================================================================== */
  const serviceModal = document.getElementById('service-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCancelBtn = document.getElementById('modal-cancel-btn');
  const modalInquireBtn = document.getElementById('modal-inquire-btn');
  const serviceButtons = document.querySelectorAll('.service-learn-more');
  const serviceTargetLinks = document.querySelectorAll('.service-link');

  const serviceData = {
    'Search Engine Optimization': {
      tag: 'Search Engine Optimization (SEO)',
      description: 'Our comprehensive search engine optimization service helps businesses expand discoverability on Google and major search engines. We target high-intent search queries that drive qualified buyers to your website.',
      deliverables: [
        'Comprehensive technical website audit & indexation fixes',
        'Keyword intent mapping & high-value search discovery',
        'On-page content optimization & structural metadata tuning',
        'Local SEO & Google Business Profile optimization',
        'Authoritative domain signals & monthly ranking reports'
      ]
    },
    'Social Media Marketing': {
      tag: 'Social Media Marketing',
      description: 'Build a cohesive, professional social presence that fosters genuine brand credibility and sustained engagement with your target audience across modern channels.',
      deliverables: [
        'Multi-platform content strategy & editorial calendar',
        'Custom graphics, carousels, and video copy concepts',
        'Active community engagement & brand sentiment tracking',
        'Hashtag & trending topic positioning',
        'Cross-platform monthly analytics & growth reporting'
      ]
    },
    'Paid Advertising': {
      tag: 'Paid Advertising (PPC / Search / Display)',
      description: 'Execute targeted digital ad campaigns designed for cost-effective customer acquisition. We continuously optimize targeting, creative testing, and bidding strategies to maximize return on ad spend (ROAS).',
      deliverables: [
        'Google Ads Search, Display & Performance Max setup',
        'High-intent audience retargeting frameworks',
        'Ad copy writing & iterative A/B creative testing',
        'Negative keyword filtering & budget preservation',
        'Conversion tracking verification & attribution analysis'
      ]
    },
    'Content Marketing': {
      tag: 'Content Marketing & Brand Storytelling',
      description: 'Position your brand as an industry thought leader. We produce purposeful, high-quality content that educates prospects, answers customer questions, and drives organic discovery.',
      deliverables: [
        'SEO-driven long-form blog articles & resource guides',
        'Case studies & customer success narrative development',
        'Lead magnet creation (whitepapers, checklists, guides)',
        'Content refresh & topical authority clustering',
        'Brand voice documentation & stylistic guidelines'
      ]
    },
    'Website & Conversion Optimization': {
      tag: 'Website & Conversion Optimization',
      description: 'Turn your existing website traffic into higher inquiry volumes. We analyze user friction, layout clarity, and page velocity to elevate user engagement and conversion percentages.',
      deliverables: [
        'Complete UX friction audit & funnel analysis',
        'Strategic Call-To-Action (CTA) placement & hierarchy refinement',
        'Mobile responsiveness & layout speed optimization',
        'A/B testing for key conversion landing pages',
        'Form optimization & abandonment reduction techniques'
      ]
    },
    'Digital Marketing Strategy': {
      tag: 'Comprehensive Digital Marketing Strategy',
      description: 'A holistic omnichannel growth roadmap. We integrate market positioning, competitor analysis, and multi-channel marketing tactics into an actionable execution schedule.',
      deliverables: [
        'Full competitor & marketplace digital footprint audit',
        'Target customer persona & journey mapping',
        'Omnichannel channel allocation & budget recommendations',
        'Milestone-based 90-day implementation timeline',
        'Executive KPI scorecards & growth tracking'
      ]
    }
  };

  let activeModalServiceName = '';

  function openServiceModal(serviceName) {
    const details = serviceData[serviceName] || {
      tag: serviceName,
      description: 'Detailed digital marketing service package tailored to your business needs.',
      deliverables: ['Custom tailored strategy', 'Implementation & execution', 'Analytics reporting']
    };

    activeModalServiceName = serviceName;
    if (modalTitle) modalTitle.textContent = serviceName;

    if (modalBody) {
      modalBody.innerHTML = `
        <p style="margin-bottom: 20px; color: #cbd5e1; font-size: 0.95rem;">${details.description}</p>
        <h4 style="color: #ffffff; font-family: var(--font-heading); font-size: 1rem; margin-bottom: 12px;">Key Deliverables & Capabilities:</h4>
        <ul style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px;">
          ${details.deliverables.map(d => `<li style="font-size: 0.875rem; color: #94a3b8; display: flex; gap: 8px;"><span style="color: #38bdf8; font-weight: bold;">✓</span> ${d}</li>`).join('')}
        </ul>
      `;
    }

    if (serviceModal) {
      serviceModal.classList.add('open');
      serviceModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeServiceModal() {
    if (serviceModal) {
      serviceModal.classList.remove('open');
      serviceModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service');
      openServiceModal(serviceName);
    });
  });

  // Footer service links can also open or jump to contact with pre-selection
  serviceTargetLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetService = link.getAttribute('data-service-target');
      if (targetService) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
          serviceSelect.value = targetService;
        }
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeServiceModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeServiceModal);

  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => {
      if (e.target === serviceModal) closeServiceModal();
    });
  }

  if (modalInquireBtn) {
    modalInquireBtn.addEventListener('click', () => {
      closeServiceModal();
      const serviceSelect = document.getElementById('service');
      if (serviceSelect && activeModalServiceName) {
        serviceSelect.value = activeModalServiceName;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus first field
        setTimeout(() => {
          const nameInput = document.getElementById('fullName');
          if (nameInput) nameInput.focus();
        }, 500);
      }
    });
  }

  /* ==========================================================================
     8. PRIVACY POLICY & TERMS OF SERVICE MODALS
     ========================================================================== */
  const privacyModal = document.getElementById('privacy-modal');
  const termsModal = document.getElementById('terms-modal');
  const openPrivacyBtn = document.getElementById('open-privacy-btn');
  const openTermsBtn = document.getElementById('open-terms-btn');
  const privacyCloseBtn = document.getElementById('privacy-close-btn');
  const privacyConfirmBtn = document.getElementById('privacy-confirm-btn');
  const termsCloseBtn = document.getElementById('terms-close-btn');
  const termsConfirmBtn = document.getElementById('terms-confirm-btn');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openPrivacyBtn) openPrivacyBtn.addEventListener('click', () => openModal(privacyModal));
  if (openTermsBtn) openTermsBtn.addEventListener('click', () => openModal(termsModal));

  if (privacyCloseBtn) privacyCloseBtn.addEventListener('click', () => closeModal(privacyModal));
  if (privacyConfirmBtn) privacyConfirmBtn.addEventListener('click', () => closeModal(privacyModal));
  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal(privacyModal);
    });
  }

  if (termsCloseBtn) termsCloseBtn.addEventListener('click', () => closeModal(termsModal));
  if (termsConfirmBtn) termsConfirmBtn.addEventListener('click', () => closeModal(termsModal));
  if (termsModal) {
    termsModal.addEventListener('click', (e) => {
      if (e.target === termsModal) closeModal(termsModal);
    });
  }

  // Global Escape key handler for all modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeServiceModal();
      closeModal(privacyModal);
      closeModal(termsModal);
    }
  });

  /* ==========================================================================
     9. TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    toast.innerHTML = `
      <span style="color: ${type === 'success' ? '#10b981' : '#38bdf8'}; font-weight: bold;">●</span>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  /* ==========================================================================
     10. CONTACT FORM CLIENT-SIDE VALIDATION & SUBMISSION
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const messageTextarea = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');
  const formSuccessAlert = document.getElementById('form-success-alert');
  const formErrorAlert = document.getElementById('form-error-alert');
  const submitBtn = document.getElementById('submit-btn');

  // Real-time character counter for message
  if (messageTextarea && charCounter) {
    messageTextarea.addEventListener('input', () => {
      const len = messageTextarea.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len > 900) {
        charCounter.style.color = '#fb7185';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // Email format regex
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Phone regex (allowing standard formats)
  const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  function clearFieldError(fieldName) {
    const group = document.getElementById(`group-${fieldName}`);
    const errorEl = document.getElementById(`error-${fieldName}`);
    if (group) group.classList.remove('has-error');
    if (errorEl) errorEl.textContent = '';
  }

  function setFieldError(fieldName, message) {
    const group = document.getElementById(`group-${fieldName}`);
    const errorEl = document.getElementById(`error-${fieldName}`);
    if (group) group.classList.add('has-error');
    if (errorEl) errorEl.textContent = message;
  }

  // Real-time validation blur listeners
  const inputFields = ['fullName', 'email', 'phone', 'service', 'message'];
  inputFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
      field.addEventListener('input', () => clearFieldError(fieldId));
      field.addEventListener('blur', () => validateField(fieldId));
    }
  });

  function validateField(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    const value = field.value.trim();

    if (fieldId === 'fullName') {
      if (!value) {
        setFieldError('fullName', 'Please enter your full name.');
        return false;
      } else if (value.length < 2) {
        setFieldError('fullName', 'Full name must be at least 2 characters.');
        return false;
      }
    }

    if (fieldId === 'email') {
      if (!value) {
        setFieldError('email', 'Please provide your email address.');
        return false;
      } else if (!emailPattern.test(value)) {
        setFieldError('email', 'Please enter a valid email address (e.g. name@domain.com).');
        return false;
      }
    }

    if (fieldId === 'phone') {
      if (value && (value.length < 7 || !phonePattern.test(value))) {
        setFieldError('phone', 'Please enter a valid phone number format.');
        return false;
      }
    }

    if (fieldId === 'service') {
      if (!value) {
        setFieldError('service', 'Please select a primary service area.');
        return false;
      }
    }

    if (fieldId === 'message') {
      if (!value) {
        setFieldError('message', 'Please share a brief summary of your marketing goals.');
        return false;
      } else if (value.length < 10) {
        setFieldError('message', 'Please provide a little more detail (at least 10 characters).');
        return false;
      }
    }

    clearFieldError(fieldId);
    return true;
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset top alerts
      if (formSuccessAlert) formSuccessAlert.hidden = true;
      if (formErrorAlert) formErrorAlert.hidden = true;

      // Validate all fields
      let isFormValid = true;
      inputFields.forEach(fieldId => {
        const isValid = validateField(fieldId);
        if (!isValid) isFormValid = false;
      });

      if (!isFormValid) {
        if (formErrorAlert) formErrorAlert.hidden = false;
        // Scroll to the first error field
        const firstError = contactForm.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Collect validated form data (ready for backend / API connection)
      const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        company: document.getElementById('company').value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim(),
        submittedAt: new Date().toISOString()
      };

      // Button loading state animation
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = `
          <span style="display:inline-block; animation: spin-slow 1s linear infinite;">⏳</span>
          <span>Transmitting Inquiry...</span>
        `;

        // Simulate seamless async submission process
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalHtml;

          // Display success state
          if (formSuccessAlert) formSuccessAlert.hidden = false;
          contactForm.reset();
          if (charCounter) charCounter.textContent = '0 / 1000';

          // Show floating toast confirmation
          showToast('Inquiry received! We will be in touch shortly.', 'success');

          // Smooth scroll to confirmation message
          formSuccessAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 600);
      }
    });
  }
}

// Bulletproof execution ensuring initApp runs whether loaded before or after DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
