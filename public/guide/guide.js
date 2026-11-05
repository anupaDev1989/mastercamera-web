(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fade sections in as they scroll into view
  if ('IntersectionObserver' in window && !reduceMotion) {
    root.classList.add('js');
    var revealEls = document.querySelectorAll('.split, figure.shot:not(.split figure):not(.shot-row figure), .shot-row, .mini-cards, .table-wrap');
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealObs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
      revealObs.observe(el);
    });
  }

  // Highlight the section you're reading in the contents bar
  var tocBar = document.querySelector('.toc .wrap');
  var links = {};
  document.querySelectorAll('.toc a[href^="#"]').forEach(function (a) {
    links[a.getAttribute('href').slice(1)] = a;
  });
  var current = null;
  function setActive(id) {
    if (id === current || !links[id]) return;
    if (current && links[current]) links[current].classList.remove('is-active');
    current = id;
    var a = links[id];
    a.classList.add('is-active');
    if (tocBar) {
      var target = a.offsetLeft - (tocBar.clientWidth - a.offsetWidth) / 2;
      tocBar.scrollTo({ left: target, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }
  if ('IntersectionObserver' in window) {
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('section.doc[id]').forEach(function (s) { sectionObs.observe(s); });
  }

  // Tap a screenshot to see it larger
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Enlarged screenshot');
  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  var big = document.createElement('img');
  big.alt = '';
  var cap = document.createElement('p');
  box.appendChild(closeBtn);
  box.appendChild(big);
  box.appendChild(cap);
  document.body.appendChild(box);

  var lastFocus = null;
  function openBox(img) {
    lastFocus = img;
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    var fc = img.closest('figure') && img.closest('figure').querySelector('figcaption');
    cap.textContent = fc ? fc.textContent : '';
    box.classList.add('is-open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }
  function closeBox() {
    if (!box.classList.contains('is-open')) return;
    box.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('figure.shot .shot-img').forEach(function (img) {
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.addEventListener('click', function () { openBox(img); });
    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBox(img); }
    });
  });
  box.addEventListener('click', closeBox);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeBox();
  });
})();
