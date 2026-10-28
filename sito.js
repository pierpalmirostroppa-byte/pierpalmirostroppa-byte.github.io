// Comandi della pagina: menu delle lingue, foto ingrandite, comparsa delle sezioni.
(function () {
  var html = document.documentElement;

  // la lingua scelta dal menu viene ricordata per le visite successive
  document.querySelectorAll('[data-lingua]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('lingua', a.getAttribute('data-lingua')); } catch (e) {}
    });
  });
  // il menu delle lingue si chiude toccando fuori
  var menu = document.querySelector('.lingue');
  if (menu) document.addEventListener('click', function (e) { if (!menu.contains(e.target)) menu.removeAttribute('open'); });

  // foto ingrandite
  var lb = document.querySelector('.lightbox');
  var foto = Array.prototype.slice.call(document.querySelectorAll('.galleria .foto'));
  if (lb && foto.length && lb.showModal) {
    var img = lb.querySelector('img'), n = 0;
    var visibile = function (b) {
      var ims = b.querySelectorAll('img');
      for (var i = 0; i < ims.length; i++) if (getComputedStyle(ims[i]).display !== 'none') return ims[i];
      return ims[0];
    };
    var mostra = function (i) {
      n = (i + foto.length) % foto.length;
      var v = visibile(foto[n]);
      img.src = v.currentSrc || v.src;
      img.alt = v.alt;
    };
    foto.forEach(function (b, i) { b.addEventListener('click', function () { mostra(i); lb.showModal(); }); });
    lb.querySelector('.lb-chiudi').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lb-prima').addEventListener('click', function () { mostra(n - 1); });
    lb.querySelector('.lb-dopo').addEventListener('click', function () { mostra(n + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostra(n - 1);
      if (e.key === 'ArrowRight') mostra(n + 1);
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) mostra(dx < 0 ? n + 1 : n - 1);
      x0 = null;
    });
  }

  // le sezioni compaiono mentre si scorre
  if ('IntersectionObserver' in window) {
    var els = document.querySelectorAll('.carta, .punto, .tester-in, .numeri li, .scheda, .box, .mini, .contatti-in');
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) {
        if (!v.isIntersecting) return;
        var el = v.target;
        el.classList.add('vista');
        io.unobserve(el);
        // finita la comparsa, tornano le animazioni normali (passaggio del mouse)
        setTimeout(function () { el.classList.remove('appare', 'vista'); el.style.transitionDelay = ''; }, 1100);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el, i) {
      el.classList.add('appare');
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
    html.classList.add('js-pronto');
  }
})();
