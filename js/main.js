/* analambert.com — motion
   Reveals, counters, scroll-driven background, nav state.
   No dependencies. Skips everything if the visitor prefers reduced motion. */

(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- nav weight after scroll ---------- */
  var nav = document.querySelector('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- hero headline: wrap words, stagger in ---------- */
  var h1 = document.querySelector('header h1');
  if (h1 && !reduce) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3 && child.textContent.trim()) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (part.trim()) {
              var s = document.createElement('span');
              s.className = 'w';
              s.textContent = part;
              frag.appendChild(s);
            } else if (part) {
              frag.appendChild(document.createTextNode(part));
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(h1);
    var words = h1.querySelectorAll('.w');
    words.forEach(function (w, i) {
      w.style.transitionDelay = (i * 70) + 'ms';
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { h1.classList.add('lit'); });
    });
  } else if (h1) {
    h1.classList.add('lit');
  }

  /* ---------- reveal on scroll ---------- */
  var targets = document.querySelectorAll(
    'section h2, .card, .flag, .about-grid > *, .cta-btn, .cs-body > *, .cs-meta > div'
  );
  targets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
        el.style.transitionDelay = Math.min(siblings, 4) * 80 + 'ms';
        el.classList.add('in');
        revealObs.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    targets.forEach(function (el) { revealObs.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- stats count up ---------- */
  var strip = document.querySelector('.strip');
  if (strip && 'IntersectionObserver' in window) {
    var statObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        strip.querySelectorAll('.n').forEach(function (n) {
          var plus = n.querySelector('span');
          var target = parseInt(n.textContent.replace(/\D/g, ''), 10);
          if (!target || reduce) return;
          var start = null, dur = 1100;
          var tick = function (ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            n.firstChild.nodeValue = Math.round(target * eased);
            if (p < 1) requestAnimationFrame(tick);
            else n.firstChild.nodeValue = target;
          };
          n.firstChild.nodeValue = '0';
          if (plus) plus.style.opacity = '1';
          requestAnimationFrame(tick);
        });
        statObs.disconnect();
      });
    }, { threshold: 0.4 });
    statObs.observe(strip);
  }

  /* ---------- scroll-driven page background ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    var zones = document.querySelectorAll('[data-bg]');
    if (zones.length) {
      var bgObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            document.body.style.backgroundColor = entry.target.getAttribute('data-bg');
          }
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      zones.forEach(function (z) { bgObs.observe(z); });
    }
  }
})();
