(function () {
  var EMAIL = 'hello@urma.ee';

  /* ---- ticker ---- */
  var tick = document.getElementById('tick');
  var msgs = ['For minds that like to move', 'Designed and printed in Estonia', 'Try one and tell us what you think'];
  var line = msgs.map(function (m) { return '<span>' + m + ' &nbsp;✳</span>'; }).join('');
  tick.innerHTML = line + line + line + line;

  /* ---- mobile nav ---- */
  var burger = document.querySelector('.burger'), links = document.querySelector('.nav-links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  links.addEventListener('click', function () { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });

  /* ---- press-and-hold pucks ---- */
  document.querySelectorAll('.puck').forEach(function (el) {
    var on = function () { el.classList.add('is-on'); };
    var off = function () { el.classList.remove('is-on'); };
    el.addEventListener('mousedown', on);
    el.addEventListener('touchstart', function (e) { e.preventDefault(); on(); }, { passive: false });
    el.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') on(); });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel', 'keyup', 'blur'].forEach(function (ev) { el.addEventListener(ev, off); });
  });

  /* ---- photo dots ---- */
  document.addEventListener('click', function (e) {
    var d = e.target.closest('.dots button'); if (!d) return;
    var g = d.closest('.gal'), bs = [].slice.call(g.querySelectorAll('.dots button')), i = bs.indexOf(d);
    g.querySelectorAll('img').forEach(function (im, k) { im.classList.toggle('on', k === i); });
    bs.forEach(function (b, k) { b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
  });


  /* ---- feedback composer ---- */
  var form = document.getElementById('fbform'), obj = document.getElementById('obj'),
      rate = document.getElementById('rate'), msg = document.getElementById('msg'),
      msglabel = document.getElementById('msglabel'), result = document.getElementById('result'),
      out = document.getElementById('out'), mail = document.getElementById('mail'),
      copied = document.getElementById('copied'), go = document.getElementById('go');

  function mode() { return form.querySelector('input[name="mode"]:checked').value; }
  function syncMode() {
    var tried = mode() === 'tried';
    rate.hidden = !tried;
    msglabel.textContent = tried ? 'What did you notice' : 'Anything we should know';
    msg.placeholder = tried ? 'It was quiet enough for class, but I wanted it a little firmer.'
                            : 'I get restless in long meetings and would like something quiet.';
    go.textContent = 'Write my message';
    result.hidden = true;
  }
  form.querySelectorAll('input[name="mode"]').forEach(function (r) { r.addEventListener('change', syncMode); });

  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-pick]'); if (!a) return;
    var v = a.getAttribute('data-pick'), found = false;
    [].forEach.call(obj.options, function (o) { if ((o.value || o.text) === v) { obj.value = o.value || o.text; found = true; } });
    if (found) { result.hidden = true; }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var tried = mode() === 'tried', who = document.getElementById('who').value.trim(),
        where = document.getElementById('where').value, r = form.querySelector('input[name="rate"]:checked'),
        text = msg.value.trim(), lines = [];
    lines.push(tried ? 'URMA feedback' : 'I would like to try a URMA');
    lines.push('Object: ' + obj.value);
    if (tried && r) lines.push('How it felt: ' + r.value);
    if (where) lines.push('Where I use it: ' + where);
    if (text) lines.push('', text);
    if (who) lines.push('', who);
    var body = lines.join('\n');
    out.value = body;
    mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(tried ? 'URMA feedback: ' + obj.value : 'Try URMA: ' + obj.value) +
      '&body=' + encodeURIComponent(body);
    copied.textContent = '';
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  document.getElementById('copy').addEventListener('click', function () {
    function fallback() { out.focus(); out.select(); copied.textContent = '✳ Selected. Press copy on your keyboard.'; }
    try {
      navigator.clipboard.writeText(out.value).then(function () { copied.textContent = '✳ Copied.'; }, fallback);
    } catch (err) { fallback(); }
  });
})();
