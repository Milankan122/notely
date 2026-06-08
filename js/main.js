(function() {
  const THEME_KEY = 'notely-theme';

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcons(true);
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.hasAttribute('data-theme');
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, 'light');
      updateThemeIcons(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(THEME_KEY, 'dark');
      updateThemeIcons(true);
    }
  }

  function updateThemeIcons(isDark) {
    const sun = document.getElementById('icon-sun');
    const moon = document.getElementById('icon-moon');
    if (!sun || !moon) return;
    if (isDark) {
      sun.classList.add('hidden');
      moon.classList.remove('hidden');
    } else {
      moon.classList.add('hidden');
      sun.classList.remove('hidden');
    }
  }

  function initNav() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  function initDrawer() {
    const toggle = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const close = document.getElementById('drawer-close');
    if (!toggle || !drawer || !overlay) return;

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeFn() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', open);
    close.addEventListener('click', closeFn);
    overlay.addEventListener('click', closeFn);
  }

  function initBanner() {
    const banner = document.getElementById('announcement-banner');
    const close = document.getElementById('banner-close');
    if (!banner || !close) return;
    close.addEventListener('click', function() {
      banner.classList.add('dismissed');
    });
  }

  function initSectionAnimations() {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.section-animate, .stagger-children').forEach(function(el) {
      observer.observe(el);
    });
  }

  function initStickySummary() {
    const featuresWrap = document.querySelector('.features-wrapper');
    const summaryWrap = document.querySelector('.sticky-summary-wrap');
    if (!featuresWrap || !summaryWrap) return;

    const featureBlocks = document.querySelectorAll('.feature-block');
    const summaryContent = document.getElementById('summary-content');
    const progressDot = document.getElementById('summary-progress-dot');
    if (!summaryContent || !progressDot) return;

    const summaryData = [];
    featureBlocks.forEach(function(block) {
      const title = block.querySelector('h3')?.textContent || '';
      const desc = block.querySelector('p')?.textContent || '';
      const label = block.querySelector('.section-label')?.textContent || '';
      const icon = block.dataset.icon || 'edit';
      const img = block.dataset.img || '';
      summaryData.push({ title, desc, label, icon, img });
    });

    let activeIndex = 0;

    function renderSummary(index) {
      const data = summaryData[index];
      if (!data) return;
      summaryContent.classList.add('out');
      setTimeout(function() {
        const iconEl = summaryContent.querySelector('.sticky-summary-icon');
        const titleEl = summaryContent.querySelector('.sticky-summary-title');
        const descEl = summaryContent.querySelector('.sticky-summary-desc');
        const imgEl = summaryContent.querySelector('.sticky-summary-visual img');
        if (iconEl) {
          iconEl.innerHTML = '<span class="material-symbols-outlined">' + data.icon + '</span>';
          iconEl.classList.add('pulse');
          setTimeout(function() { iconEl.classList.remove('pulse'); }, 300);
        }
        if (titleEl) titleEl.textContent = data.title;
        if (descEl) descEl.textContent = data.desc;
        if (imgEl) imgEl.src = data.img;
        summaryContent.classList.remove('out');
      }, 200);
    }

    if (summaryData.length > 0) {
      renderSummary(0);
    }

    const blockObserver = new IntersectionObserver(function(entries) {
      let maxRatio = 0;
      let bestIndex = 0;
      entries.forEach(function(entry) {
        const idx = parseInt(entry.target.dataset.index);
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          bestIndex = idx;
        }
      });
      if (bestIndex !== activeIndex) {
        activeIndex = bestIndex;
        renderSummary(activeIndex);
      }
    }, { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -20% 0px' });

    featureBlocks.forEach(function(block) {
      blockObserver.observe(block);
    });

    function updateProgress() {
      const wrapRect = featuresWrap.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionTop = wrapRect.top;
      const sectionHeight = wrapRect.height;
      const progress = Math.max(0, Math.min(1, (viewportHeight / 2 - sectionTop) / sectionHeight));
      const dotMaxTravel = 100;
      progressDot.style.transform = 'translateY(' + (progress * dotMaxTravel) + 'px)';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initNav();
    initDrawer();
    initBanner();
    initSectionAnimations();
    initStickySummary();
    initSmoothScroll();

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const drawerThemeBtn = document.getElementById('drawer-theme-toggle');
    if (drawerThemeBtn) drawerThemeBtn.addEventListener('click', toggleTheme);
  });
})();
