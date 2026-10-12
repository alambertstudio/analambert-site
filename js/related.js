/* Related case studies carousel — arrow controls + disabled-state sync.
   Additive. Load after motion.js. Degrades to a swipeable track without JS. */
(function () {
  document.querySelectorAll('.rel').forEach(function (rel) {
    var track = rel.querySelector('.rel-track');
    var prev = rel.querySelector('[data-rel="prev"]');
    var next = rel.querySelector('[data-rel="next"]');
    if (!track || !prev || !next) return;

    function step() {
      var card = track.querySelector('.rel-card');
      if (!card) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap || '20') || 20;
      return card.getBoundingClientRect().width + gap;
    }

    function sync() {
      var max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
      // nothing to scroll: hide the controls entirely
      rel.querySelector('.rel-nav').style.display = max <= 2 ? 'none' : '';
    }

    prev.addEventListener('click', function () { track.scrollLeft -= step(); });
    next.addEventListener('click', function () { track.scrollLeft += step(); });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();
