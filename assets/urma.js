(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- ticker ---- */
  var tick = document.getElementById('tick');
  if (tick) {
    var msgs = ['For minds that like to move', 'Designed and printed in Estonia', 'Free shipping over \u20AC40'];
    var line = msgs.map(function (m) { return '<span>' + m + ' &nbsp;\u2733</span>'; }).join('');
    tick.innerHTML = line + line + line + line;
  }

  /* ---- mobile nav ---- */
  var burger = document.querySelector('.burger'), links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
  }

  /* ---- press-and-hold pucks ---- */
  document.querySelectorAll('.puck').forEach(function (el) {
    var on = function () { el.classList.add('is-on'); };
    var off = function () { el.classList.remove('is-on'); };
    el.addEventListener('mousedown', on);
    el.addEventListener('touchstart', function (e) { e.preventDefault(); on(); }, { passive: false });
    el.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') on(); });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel', 'keyup', 'blur'].forEach(function (ev) {
      el.addEventListener(ev, off);
    });
  });

  /* ---- product grids ---- */
  var PRODUCTS = [
    { slug: 'infinity-cube', n: 'Infinity Cube', r: 'Settle', p: 12, m: 'TPU 98A \u00B7 Matte',
      d: 'One piece, printed in a single run. Four faces turn into eight and back again, in a loop that does not end.',
      img: 'infinity-cube.webp', c: ['#1660E6', '#6E9BF2', '#0B3D96'] },
    { slug: 'knot', n: 'Knot', r: 'Settle', p: 22, m: 'TPU 95A \u00B7 Matte',
      d: 'One continuous loop with no beginning. Stretch it, twist it, drop it in a pocket.', c: ['#2470E9', '#7FA9F4', '#0A3684'] },
    { slug: 'spiral', n: 'Spiral', r: 'Settle', p: 19, m: 'TPU 92A \u00B7 Matte',
      d: 'A flat coil that winds tight and unwinds slowly. Runs through the fingers like a worry bead.', c: ['#3B7CEC', '#9CC0F7', '#1660E6'] },
    { slug: 'caterpillar', n: 'Caterpillar', r: 'Settle', p: 24, m: 'TPU 90A \u00B7 Matte',
      d: 'Twelve soft segments on a flexible spine. The softest thing we make, and the one people keep on the bedside table.', c: ['#1660E6', '#8FB4F5', '#0B3D96'] },
    { slug: 'spiral-focus', n: 'Spiral Focus', r: 'Play', p: 14, m: 'PLA \u00B7 Several colours',
      d: 'Ribs turn out from a square hole to eight points at the edge. Press the centre and it domes; twist it and it cones.',
      img: 'spiral-focus.webp', c: ['#F2A63C', '#E4802A', '#C25E12'] },
    { slug: 'dragon-egg', n: 'Dragon Egg', r: 'Play', p: 16, m: 'PLA \u00B7 Print-in-place',
      d: 'Overlapping scales on a hidden hinge. Squeeze and it opens; let go and it closes with a click.', c: ['#EE9A2A', '#F7BE6B', '#B87516'] },
    { slug: 'bolt', n: 'Bolt', r: 'Play', p: 14, m: 'PLA \u00B7 Print-in-place',
      d: 'Throw it forward, catch it back. Pocket-sized momentum, and the loudest thing in the range.', c: ['#F4B054', '#E08E1F', '#A8681A'] },
    { slug: 'orbit', n: 'Orbit', r: 'Play', p: 29, m: 'PLA \u00B7 Print-in-place',
      d: 'Planetary gears printed already meshed. The most satisfying mechanism we make, by a distance.', c: ['#F2A63C', '#D98A1E', '#8F5410'] }
  ];

  function card(it) {
    var art = it.img
      ? '<img src="assets/' + it.img + '" alt="' + it.n + '" loading="lazy" width="600" height="600">'
      : '<svg viewBox="0 0 529.9 532.09" aria-hidden="true"><use href="#rosette"/></svg>';
    return '<article class="card">' +
      '<div class="card-art" data-slug="' + it.slug + '" style="background:' + it.c[0] + '">' +
      '<span class="tag">' + it.r + '</span>' + art + '</div>' +
      '<div class="card-body"><h3>' + it.n + '</h3><p>' + it.d + '</p>' +
      '<p class="card-meta">' + it.m + '</p>' +
      '<div class="card-foot"><span class="price">\u20AC' + it.p + '</span>' +
      '<div class="swatches">' + it.c.map(function (col, j) {
        return '<button class="chip" style="background:' + col + ';width:19px;height:19px" data-slug="' + it.slug +
          '" data-c="' + col + '" aria-pressed="' + (j === 0) + '" aria-label="Colour ' + (j + 1) + ' of ' + it.n + '"></button>';
      }).join('') + '</div></div></div></article>';
  }

  document.querySelectorAll('[data-products]').forEach(function (host) {
    var want = host.dataset.products;
    var list = want === 'all' ? PRODUCTS : PRODUCTS.filter(function (p) { return p.r === want; });
    host.innerHTML = list.map(card).join('');
  });

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('.chip'); if (!chip || !chip.dataset.slug) return;
    var art = document.querySelector('.card-art[data-slug="' + chip.dataset.slug + '"]');
    if (art && !art.querySelector('img')) art.style.background = chip.dataset.c;
    if (art && art.querySelector('img')) art.style.background = chip.dataset.c;
    chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip); });
  });

  /* ---- PDP swatches ---- */
  document.querySelectorAll('.pdp .swatches .chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var art = document.querySelector('.pdp-art');
      if (art) art.style.background = chip.dataset.c;
      chip.parentNode.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip); });
    });
  });

  /* ---- email capture ---- */
  document.querySelectorAll('[data-signup]').forEach(function (form) {
    var input = form.querySelector('input'), said = form.parentNode.querySelector('.said');
    var btn = form.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var v = (input.value || '').trim();
      if (!said) return;
      if (!/^\S+@\S+\.\S+$/.test(v)) { said.textContent = '\u2733 That address is missing something.'; }
      else { said.textContent = '\u2733 You\u2019re on the list.'; input.value = ''; }
      said.classList.add('on');
    });
  });

  /* ---- contact / wholesale forms (front-end only) ---- */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    var btn = form.querySelector('[type="submit"], .btn-ink, .btn-blue');
    var said = form.querySelector('.said');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var missing = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
      if (!said) return;
      if (missing.length) { said.textContent = '\u2733 Fill in the required fields.'; missing[0].focus(); }
      else { said.textContent = '\u2733 Sent. We read emails \u2014 you\u2019ll hear back within one working day.'; }
      said.classList.add('on');
    });
  });

  /* ---- reveals ---- */
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv').forEach(function (n) { io.observe(n); });
  } else {
    document.querySelectorAll('.rv').forEach(function (n) { n.classList.add('in'); });
  }
})();
