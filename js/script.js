document.addEventListener("DOMContentLoaded", () => {
  // Number Counting Animation
  const counters = document.querySelectorAll(".stat-number");
  const speed = 200; // The lower the slower

  const animateCounters = () => {
    counters.forEach((counter) => {
      const updateCount = () => {
        const target = +counter.getAttribute("data-target"); // Target number
        const count = +counter.innerText.replace("+", ""); // Current number (remove +)
        const inc = target / speed; // Increment step

        if (count < target) {
          counter.innerText = Math.ceil(count + inc) + "+";
          setTimeout(updateCount, 20);
        } else {
          counter.innerText = target + "+";
        }
      };
      updateCount();
    });
  };

  // Intersection Observer to start animation when in view
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect(); // Run only once
        }
      });
    },
    { threshold: 0.5 }
  );

  const statsSection = document.querySelector(".hero-stats");
  if (statsSection) {
    observer.observe(statsSection);
  }
});

/* =========================================
   SMART STICKY NAVBAR LOGIC
   ========================================= */
document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const topBar = document.querySelector('.top-bar');
  const body = document.body;

  // Config
  const scrollThreshold = 10; // Minimum scroll diff to trigger action
  let lastScrollY = window.scrollY;
  let ticking = false;

  // Helper to get element heights
  const getTopBarHeight = () => topBar ? topBar.offsetHeight : 0;
  const getNavbarHeight = () => navbar ? navbar.offsetHeight : 0;

  const updateNavbar = () => {
    const currentScrollY = window.scrollY;
    const topBarHeight = getTopBarHeight();
    const navbarHeight = getNavbarHeight();

    // 1. STICKY ACTIVATION LOGIC
    // If we've scrolled past the top bar, make navbar sticky
    if (currentScrollY > topBarHeight) {
      if (!navbar.classList.contains('navbar-smart')) {
        navbar.classList.add('navbar-smart');
        // Add padding to body to prevent content jump 
        body.style.paddingTop = navbarHeight + 'px';
      }
    } else {
      // At the top: remove sticky
      if (navbar.classList.contains('navbar-smart')) {
        navbar.classList.remove('navbar-smart');
        navbar.classList.remove('navbar-hidden');
        body.style.paddingTop = '0';
      }
    }

    // 2. AUTO-HIDE LOGIC
    // Only active if we are in "smart" mode
    if (navbar.classList.contains('navbar-smart')) {
      const diff = currentScrollY - lastScrollY;

      // Allow small movements without flickering
      if (Math.abs(diff) > scrollThreshold) {
        if (diff > 0) {
          // SCROLL DOWN -> Hide
          navbar.classList.add('navbar-hidden');

          // Close any open mobile menu to prevent weird detachment
          const navbarCollapse = document.querySelector('.navbar-collapse');
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        } else {
          // SCROLL UP -> Show
          navbar.classList.remove('navbar-hidden');
        }
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  });

  // Handle Resize
  window.addEventListener('resize', () => {
    // Optional: Recalc logic if needed
  });
});
