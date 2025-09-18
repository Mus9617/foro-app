(function () {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const target = link.getAttribute('href');
    if (!target) return;
    if (target.endsWith(current)) {
      link.classList.add('active', 'current');
    }
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const hero = document.querySelector('.hero');
  if (hero && !prefersReducedMotion.matches) {
    hero.addEventListener('mousemove', (event) => {
      const { clientX, clientY } = event;
      const { innerWidth, innerHeight } = window;
      const moveX = (clientX / innerWidth - 0.5) * 12;
      const moveY = (clientY / innerHeight - 0.5) * 12;
      hero.style.backgroundPosition = `${50 - moveX / 2}% ${50 - moveY / 2}%`;
    });
  }

  const revealSelectors = [
    '.section__inner',
    '.feature-card',
    '.insight-card',
    '.stat-card',
    '.showcase__media',
    '.showcase__content',
    '.timeline__item',
    '.callout',
    '.cta-group',
    '.docs-content article'
  ];
  const revealTargets = Array.from(new Set(document.querySelectorAll(revealSelectors.join(','))));

  if (revealTargets.length) {
    if (!prefersReducedMotion.matches && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

      revealTargets.forEach((el, index) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
        }
        el.style.setProperty('--reveal-delay', `${Math.min((index % 6) * 80, 320)}ms`);
        observer.observe(el);
      });
    } else {
      revealTargets.forEach((el) => {
        el.classList.add('reveal', 'is-visible');
      });
    }
  }

  const parallaxItems = Array.from(document.querySelectorAll('[data-parallax-layer]'));
  if (parallaxItems.length) {
    const applyParallax = () => {
      if (prefersReducedMotion.matches) {
        parallaxItems.forEach((item) => item.style.setProperty('--parallax-offset', '0px'));
        return;
      }
      parallaxItems.forEach((item) => {
        const strength = parseFloat(item.dataset.parallaxLayer);
        if (!strength) return;
        const rect = item.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * strength;
        item.style.setProperty('--parallax-offset', `${offset.toFixed(2)}px`);
      });
    };

    let ticking = false;
    const requestApply = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          applyParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    applyParallax();
    window.addEventListener('scroll', requestApply, { passive: true });
    window.addEventListener('resize', requestApply);
    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', requestApply);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
      prefersReducedMotion.addListener(requestApply);
    }
  }

  const pointerFine = window.matchMedia('(pointer: fine)');
  if (pointerFine.matches && !prefersReducedMotion.matches) {
    const cursorRing = document.createElement('span');
    cursorRing.className = 'cursor-ring';
    const cursorDot = document.createElement('span');
    cursorDot.className = 'cursor-dot';

    document.body.appendChild(cursorRing);
    document.body.appendChild(cursorDot);
    document.body.classList.add('cursor-enhanced');

    const setPosition = (x, y) => {
      cursorRing.style.left = `${x}px`;
      cursorRing.style.top = `${y}px`;
      cursorDot.style.left = `${x}px`;
      cursorDot.style.top = `${y}px`;
    };

    const showCursor = () => {
      cursorRing.classList.add('is-visible');
      cursorDot.classList.add('is-visible');
    };

    const hideCursor = () => {
      cursorRing.classList.remove('is-visible');
      cursorDot.classList.remove('is-visible');
    };

    document.addEventListener('mousemove', (event) => {
      setPosition(event.clientX, event.clientY);
      showCursor();
    });

    document.addEventListener('mouseenter', (event) => {
      setPosition(event.clientX, event.clientY);
      showCursor();
    });

    document.addEventListener('mouseleave', hideCursor);

    document.addEventListener('mousedown', () => {
      cursorRing.classList.add('is-press');
      cursorDot.classList.add('is-press');
    });

    document.addEventListener('mouseup', () => {
      cursorRing.classList.remove('is-press');
      cursorDot.classList.remove('is-press');
    });

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, .cursor-interactive';

    const updateHoverState = (isActive) => {
      if (isActive) {
        cursorRing.classList.add('is-hover');
      } else {
        cursorRing.classList.remove('is-hover');
      }
    };

    document.addEventListener('mouseover', (event) => {
      updateHoverState(Boolean(event.target.closest(interactiveSelector)));
    });

    document.addEventListener('mouseout', (event) => {
      if (!event.relatedTarget || !event.relatedTarget.closest(interactiveSelector)) {
        updateHoverState(false);
      }
    });

    const handleMotionChange = (event) => {
      if (event.matches) {
        hideCursor();
        document.body.classList.remove('cursor-enhanced');
      } else {
        showCursor();
        document.body.classList.add('cursor-enhanced');
      }
    };

    if (typeof prefersReducedMotion.addEventListener === 'function') {
      prefersReducedMotion.addEventListener('change', handleMotionChange);
    } else if (typeof prefersReducedMotion.addListener === 'function') {
      prefersReducedMotion.addListener(handleMotionChange);
    }
  }
})();
