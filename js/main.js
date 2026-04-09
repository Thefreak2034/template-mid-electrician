/* ============================================================
   Buzz Electrical — Mid-Tier Electrician Template
   Main JavaScript (Vanilla, IIFE)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. Mobile Nav Toggle ---------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const body = document.body;

  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.contains('active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close when clicking a mobile menu link
    var mobileLinks = mobileMenu.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMobileMenu();
      });
    });
  }

  /* ---------- 2. Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = document.getElementById('navbar').offsetHeight || 80;
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- 3. Navbar Scroll Shadow ---------- */
  var navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  if (navbar) {
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check
  }

  /* ---------- 4. Stats Counter ---------- */
  var statNumbers = document.querySelectorAll('.stat-number');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
    var duration = 2000;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutCubic(progress);
      var current = easedProgress * target;

      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      statObserver.observe(el);
    });
  }

  /* ---------- 5. Scroll Fade-In ---------- */
  var fadeElements = document.querySelectorAll('.fade-in');

  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    var fadeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, index) {
          if (entry.isIntersecting) {
            // Stagger animation by 80ms per sibling
            var siblings = entry.target.parentElement.querySelectorAll('.fade-in');
            var siblingIndex = Array.prototype.indexOf.call(siblings, entry.target);
            var delay = siblingIndex * 80;

            setTimeout(function () {
              entry.target.classList.add('fade-in-visible');
            }, delay);

            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    fadeElements.forEach(function (el) {
      fadeObserver.observe(el);
    });
  } else {
    // Fallback: make everything visible
    fadeElements.forEach(function (el) {
      el.classList.add('fade-in-visible');
    });
  }

  /* ---------- 6. FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var questionBtn = item.querySelector('.faq-question');

    if (questionBtn) {
      questionBtn.addEventListener('click', function () {
        var isActive = item.classList.contains('active');

        // Close all items first (single-open mode)
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('active');
          var otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          var answer = item.querySelector('.faq-answer');
          if (answer) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        }
      });
    }
  });

  // Initialize first active FAQ item's max-height
  var initialActive = document.querySelector('.faq-item.active .faq-answer');
  if (initialActive) {
    initialActive.style.maxHeight = initialActive.scrollHeight + 'px';
  }

  /* ---------- 7. Contact Form Validation ---------- */
  var contactForm = document.getElementById('contact-form');

  if (contactForm) {
    var formStatus = contactForm.querySelector('.form-status');

    function showFieldError(fieldId, message) {
      var field = contactForm.querySelector(fieldId);
      var errorEl = field ? field.parentElement.querySelector('.form-error') : null;
      if (errorEl) {
        errorEl.textContent = message;
      }
      if (field) {
        field.style.borderColor = '#d32f2f';
      }
    }

    function clearFieldError(fieldId) {
      var field = contactForm.querySelector(fieldId);
      var errorEl = field ? field.parentElement.querySelector('.form-error') : null;
      if (errorEl) {
        errorEl.textContent = '';
      }
      if (field) {
        field.style.borderColor = '';
      }
    }

    function clearAllErrors() {
      contactForm.querySelectorAll('.form-error').forEach(function (el) {
        el.textContent = '';
      });
      contactForm.querySelectorAll('input, textarea').forEach(function (el) {
        el.style.borderColor = '';
      });
      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    }

    function validateEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
      // Phone is required (canonical spec)
      if (!phone) return false;
      var cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 8 && cleaned.length <= 12;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      var name = contactForm.querySelector('#contact-name').value.trim();
      var email = contactForm.querySelector('#contact-email').value.trim();
      var phone = contactForm.querySelector('#contact-phone').value.trim();
      var message = contactForm.querySelector('#contact-message').value.trim();
      var honeypot = contactForm.querySelector('#hp-website').value;

      // Honeypot check — if filled, silently "succeed"
      if (honeypot) {
        if (formStatus) {
          formStatus.textContent = 'Thank you! We\'ll be in touch shortly.';
          formStatus.className = 'form-status success';
        }
        contactForm.reset();
        return;
      }

      var hasError = false;

      if (!name || name.length < 2) {
        showFieldError('#contact-name', 'Please enter your full name.');
        hasError = true;
      }

      if (!email) {
        showFieldError('#contact-email', 'Please enter your email address.');
        hasError = true;
      } else if (!validateEmail(email)) {
        showFieldError('#contact-email', 'Please enter a valid email address.');
        hasError = true;
      }

      if (!phone) {
        showFieldError('#contact-phone', 'Please enter your phone number.');
        hasError = true;
      } else if (!validatePhone(phone)) {
        showFieldError('#contact-phone', 'Please enter a valid phone number.');
        hasError = true;
      }
      // Message is optional — no validation

      if (hasError) return;

      // Disable submit button
      var submitBtn = contactForm.querySelector('.btn-submit');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Build form data
      var formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
        .then(function (response) {
          if (response.ok) {
            if (formStatus) {
              formStatus.textContent = 'Thank you! Your message has been sent. We\'ll be in touch shortly.';
              formStatus.className = 'form-status success';
            }
            contactForm.reset();
          } else {
            throw new Error('Server error');
          }
        })
        .catch(function () {
          if (formStatus) {
            formStatus.textContent = 'Something went wrong. Please call us at 0412 345 678 or try again later.';
            formStatus.className = 'form-status error';
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        });
    });

    // Clear individual field errors on input
    ['#contact-name', '#contact-email', '#contact-phone', '#contact-message'].forEach(function (id) {
      var field = contactForm.querySelector(id);
      if (field) {
        field.addEventListener('input', function () {
          clearFieldError(id);
        });
      }
    });
  }

  /* ---------- 8. Dynamic Copyright Year ---------- */
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();