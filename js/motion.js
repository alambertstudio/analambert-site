/* analambert.com motion layer
   Scroll-driven background, reveals, count-up, hero stagger, nav state.
   All effects no-op under prefers-reduced-motion. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  /* ---- 1. scroll-driven page background ---- */
  var bgSections = document.querySelectorAll('[data-bg]');
  if (bgSections.length) {
    var bgObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) body.style.setProperty('--page-bg', e.target.dataset.bg);
      });
    }, { threshold: 0.35, rootMargin: '-10% 0px -40% 0px' });
    bgSections.forEach(function (s) { bgObs.observe(s); });
  }

  /* ---- 2. reveal on scroll, staggered, once only ---- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduce) {
      reveals.forEach(function (el) { el.classList.add('in'); });
    } else {
      var revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var sibs = Array.prototype.slice.call(e.target.parentNode.querySelectorAll('.reveal'));
          e.target.style.transitionDelay = (Math.min(sibs.indexOf(e.target), 5) * 80) + 'ms';
          e.target.classList.add('in');
          revObs.unobserve(e.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
      reveals.forEach(function (el) { revObs.observe(el); });
    }
  }

  /* ---- 3. stat count-up ---- */
  var strip = document.querySelector('.strip');
  if (strip && !reduce) {
    var counted = false;
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting || counted) return;
        counted = true;
        strip.querySelectorAll('.n').forEach(function (node) {
          var suffix = node.querySelector('span') ? node.querySelector('span').outerHTML : '';
          var target = parseInt(node.textContent.replace(/\D/g, ''), 10);
          if (isNaN(target)) return;
          var start = null, dur = 1200;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            node.innerHTML = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          node.innerHTML = '0' + suffix;
          requestAnimationFrame(step);
        });
      });
    }, { threshold: 0.5 });
    statObs.observe(strip);
  }

  /* ---- 4. hero entrance ---- */
  if (!reduce) {
    var heroBits = document.querySelectorAll('.hero .kicker, .hero h1, .hero .hero-sub, .cs-hero .kicker, .cs-hero h1');
    heroBits.forEach(function (el, i) {
      el.classList.add('hero-in');
      el.style.animationDelay = (i * 120) + 'ms';
    });
    var em = document.querySelector('.hero h1 em');
    if (em) setTimeout(function () { em.classList.add('swept'); }, 700);
  }

  /* ---- 5. nav state on scroll ---- */
  var nav = document.querySelector('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 80); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- 6. mobile hamburger menu ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      links.classList.toggle('open', open);
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) setOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 640) setOpen(false);
    });
  }
})();
