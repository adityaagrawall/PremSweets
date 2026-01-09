document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. LOADER LOGIC
       ========================================= */
    const loader = document.getElementById('loader');
    const video = loader ? loader.querySelector('video') : null;
    
    function finishLoading() {
        if (!loader) return;
        loader.classList.add('slide-up'); 
        
        setTimeout(() => {
            loader.style.display = 'none'; 
            revealInitial(); 
        }, 1200); 
    }

    // Safety Timer (6 seconds)
    let safetyTimer = setTimeout(finishLoading, 6000); 

    // Play Logic
    if (video) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                video.classList.add('playing');
            }).catch(error => {
                console.warn("Autoplay blocked:", error);
                clearTimeout(safetyTimer);
                finishLoading();
            });
        }
        video.addEventListener('ended', () => {
            clearTimeout(safetyTimer);
            finishLoading();
        });
        video.addEventListener('error', () => {
            clearTimeout(safetyTimer);
            finishLoading();
        });
    } else {
        clearTimeout(safetyTimer);
        finishLoading();
    }

    /* =========================================
       2. SCROLL REVEAL ANIMATION
       ========================================= */
    const observerOptions = {
        threshold: 0.15 
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => scrollObserver.observe(el));

    function revealInitial() {
        // Updated selector to match your new Hero class
        const heroElements = document.querySelectorAll('.hero-image-wrapper .reveal-on-scroll, .hero-premium .reveal-on-scroll');
        heroElements.forEach(el => el.classList.add('active'));
    }

    /* =========================================
       3. MOBILE MENU LOGIC
       ========================================= */
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawer = document.getElementById('closeDrawer');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(mobileToggle && mobileDrawer) {
        mobileToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('open');
        });
    }

    if(closeDrawer && mobileDrawer) {
        closeDrawer.addEventListener('click', () => {
            mobileDrawer.classList.remove('open');
        });
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if(mobileDrawer) mobileDrawer.classList.remove('open');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (mobileDrawer && mobileDrawer.classList.contains('open') && 
            !mobileDrawer.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
            mobileDrawer.classList.remove('open');
        }
    });

    /* =========================================
       4. COUNTER ANIMATION (ROBUST FIX)
       ========================================= */
       const counters = document.querySelectorAll('.count-number');
    
       if (counters.length > 0) {
           const counterObserver = new IntersectionObserver((entries, observer) => {
               entries.forEach(entry => {
                   // Check if the number is actually visible on screen
                   if (entry.isIntersecting) {
                       const counter = entry.target;
                       
                       // Stop observing immediately so it runs only once
                       observer.unobserve(counter);
   
                       // CRITICAL: Add a delay so the section fades in FIRST, then we count
                       setTimeout(() => {
                           const target = +counter.getAttribute('data-target'); 
                           
                           // Fallback: If no target is found, just show 50
                           if (!target) {
                               counter.innerText = "50"; 
                               return;
                           }
   
                           const duration = 2000; // Animation takes 2.5 seconds (slower is better)
                           const increment = target / (duration / 20); 
   
                           let current = 0;
                           const updateCount = () => {
                               current += increment;
                               if (current < target) {
                                   counter.innerText = Math.ceil(current);
                                   setTimeout(updateCount, 20);
                               } else {
                                   counter.innerText = target; // Ensure it finishes on exactly 50
                               }
                           };
                           updateCount();
                           
                       }, 500); // 500ms delay to wait for fade-in
                   }
               });
           }, { threshold: 0.2 }); // Trigger when 20% of the number is visible
   
           counters.forEach(counter => counterObserver.observe(counter));
       }

    /* =========================================
       5. PARALLAX & SMOOTH SCROLL
       ========================================= */
    // Parallax (Only if heroBg exists)
    const heroBg = document.getElementById('heroBg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            if (scrollPosition < 800) { 
                heroBg.style.transform = `translateY(${scrollPosition * 0.5}px) scale(1.1)`;
            }
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Only prevents default if it's a hash link, not a page link
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if(target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // --- SMART NAVBAR LOGIC ---
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // 1. Hide/Show based on scroll direction
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // User is scrolling DOWN -> Hide Navbar
            navbar.classList.add('nav-hidden');
        } else {
            // User is scrolling UP -> Show Navbar
            navbar.classList.remove('nav-hidden');
        }

        // 2. Add Shadow/Glass effect only when scrolled away from top
        if (currentScrollY > 10) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }

        lastScrollY = currentScrollY;
    });

});