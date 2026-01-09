document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. SCROLL REVEAL ANIMATION (OPTIMIZED)
       ========================================= */
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
    if ('IntersectionObserver' in window && revealElements.length > 0) {
      const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
  
      revealElements.forEach(el => scrollObserver.observe(el));
    } else {
      // Fallback for very old browsers
      revealElements.forEach(el => el.classList.add('active'));
    }
  
    /* =========================================
       2. INITIAL HERO REVEAL (NO LOADER)
       ========================================= */
    function revealInitial() {
      const heroElements = document.querySelectorAll(
        '.hero-image-wrapper .reveal-on-scroll, .hero-premium .reveal-on-scroll'
      );
      heroElements.forEach(el => el.classList.add('active'));
    }
  
    // Reveal hero immediately (best UX)
    revealInitial();
  
    /* =========================================
       3. MOBILE MENU LOGIC (ROBUST)
       ========================================= */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');
  
    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener('click', () => {
        mobileDrawer.classList.add('open');
        document.body.style.overflow = 'hidden'; // prevent background scroll
      });
    }
  
    if (closeDrawer && mobileDrawer) {
      closeDrawer.addEventListener('click', closeMenu);
    }
  
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  
    function closeMenu() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileDrawer &&
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  
    /* =========================================
       4. COUNTER ANIMATION (PRO VERSION)
       ========================================= */
    const counters = document.querySelectorAll('.count-number');
  
    if ('IntersectionObserver' in window && counters.length > 0) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
  
          const counter = entry.target;
          observer.unobserve(counter);
  
          const target = +counter.dataset.target || 0;
          const duration = 2000;
          const stepTime = 20;
          const increment = target / (duration / stepTime);
          let current = 0;
  
          const updateCount = () => {
            current += increment;
            if (current < target) {
              counter.textContent = Math.ceil(current);
              setTimeout(updateCount, stepTime);
            } else {
              counter.textContent = target;
            }
          };
  
          // Delay slightly for visual polish
          setTimeout(updateCount, 400);
        });
      }, { threshold: 0.2 });
  
      counters.forEach(counter => counterObserver.observe(counter));
    }
  
    /* =========================================
       5. PARALLAX (THROTTLED FOR PERFORMANCE)
       ========================================= */
    const heroBg = document.getElementById('heroBg');
    let ticking = false;
  
    if (heroBg) {
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.pageYOffset;
            if (scrollY < 800) {
              heroBg.style.transform =
                `translateY(${scrollY * 0.4}px) scale(1.08)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  
    /* =========================================
       6. SMOOTH SCROLL (SAFE)
       ========================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId.length > 1) {
          const target = document.querySelector(targetId);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  
    /* =========================================
       7. SMART NAVBAR (PRO UX)
       ========================================= */
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
  
    if (navbar) {
      window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
  
        // Hide on scroll down
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          navbar.classList.add('nav-hidden');
        } else {
          navbar.classList.remove('nav-hidden');
        }
  
        // Add shadow/glass
        navbar.classList.toggle('nav-scrolled', currentScrollY > 10);
  
        lastScrollY = currentScrollY;
      });
    }
  
  });
  