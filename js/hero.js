/* analambert.com hero layer
   Rotating disciplines in the hero, and nav inversion over the navy hero.
   Runs after motion.js. Both are independent: neither breaks if the other
   changes. No-ops if the hero markup is not on the page.

   To change the disciplines, edit AREAS. The pills, the rotation and the
   screen reader sentence all rebuild from that one array.
   To change the pace, edit HOLD. Below 2000 it starts to feel twitchy.
*/
(function () {
  var AREAS = ['brand', 'campaign', 'creative strategy', 'website', 'design system'];
  var HOLD = 2600;

  var rot = document.getElementById('rot');
  var track = document.getElementById('rotTrack');
  var areasEl = document.getElementById('areas');
  var srEl = document.getElementById('rotSr');
  if (!rot || !track || !areasEl || !srEl) return;

  /* the animated line is aria-hidden, so screen readers get the full list */
  srEl.textContent = 'So ask me about your ' + AREAS.join(', ') + '.';

  var words = AREAS.map(function (label) {
    var el = document.createElement('span');
    el.className = 'rot-word';
    el.textContent = label;
    track.appendChild(el);
    return el;
  });

  var pills = AREAS.map(function (label, i) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    b.addEventListener('click', function () { stop(); show(i); });
    li.appendChild(b);
    areasEl.appendChild(li);
    return b;
  });

  /* measured with the real rendered font so the brackets land exactly */
  var ghost = document.createElement('span');
  ghost.className = 'rot-measure';
  document.body.appendChild(ghost);

  var widths = [], current = 0, timer = null;

  function measure() {
    var cs = getComputedStyle(words[0]);
    ghost.style.fontFamily = cs.fontFamily;
    ghost.style.fontSize = cs.fontSize;
    ghost.style.fontWeight = cs.fontWeight;
    ghost.style.fontStyle = cs.fontStyle;
    ghost.style.fontStretch = cs.fontStretch;
    ghost.style.letterSpacing = cs.letterSpacing;
    widths = AREAS.map(function (label) {
      ghost.textContent = label;
      return ghost.offsetWidth;
    });
    track.style.width = widths[current] + 'px';
  }

  function show(i) {
    words[current].classList.remove('in');
    words[current].classList.add('out');
    pills[current].removeAttribute('aria-current');

    current = i;

    track.style.width = widths[current] + 'px';
    words[current].classList.remove('out');
    words[current].classList.add('in');
    pills[current].setAttribute('aria-current', 'true');
    start();
  }

  function start() {
    stop();
    timer = setTimeout(function () { show((current + 1) % AREAS.length); }, HOLD);
  }
  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  /* pause on hover and on keyboard focus so the line can be read */
  [rot, areasEl].forEach(function (el) {
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', stop);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { stop(); } else { start(); }
  });
  window.addEventListener('resize', measure);

  function init() {
    measure();
    words[0].classList.add('in');
    pills[0].setAttribute('aria-current', 'true');
    start();
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    init();
  }

  /* ---- nav inversion: white logo and links while the navy hero is behind ---- */
  var hero = document.getElementById('hero');
  var nav = document.querySelector('nav');
  if (!hero || !nav) return;
  if (!('IntersectionObserver' in window)) { nav.classList.add('on-dark'); return; }
  new IntersectionObserver(function (entries) {
    nav.classList.toggle('on-dark', entries[0].isIntersecting);
  }, { rootMargin: '-72px 0px 0px 0px', threshold: 0 }).observe(hero);
})();
