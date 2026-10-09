(function () {
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


  /* ---- backend (Supabase REST, no library) ---- */
  var CFG = window.URMA_CONFIG || {};
  var ONLINE = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  var BASE = (CFG.supabaseUrl || '').replace(/\/+$/, '') + '/rest/v1/';
  function api(path, body, prefer) {
    var headers = { 'apikey': CFG.supabaseAnonKey, 'Authorization': 'Bearer ' + CFG.supabaseAnonKey, 'Content-Type': 'application/json' };
    if (prefer) headers['Prefer'] = prefer;
    return fetch(BASE + path, { method: 'POST', headers: headers, body: JSON.stringify(body || {}) }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.status === 204 ? null : r.text().then(function (t) { return t ? JSON.parse(t) : null; });
    });
  }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---- "I'd try this" counter ---- */
  var cid = store('urma.cid');
  if (!cid) {
    cid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
    store('urma.cid', cid);
  }
  var mine = {}; try { (JSON.parse(store('urma.votes') || '[]')).forEach(function (s) { mine[s] = true; }); } catch (e) {}
  var counts = {}, loaded = false, note = document.getElementById('votenote');
  function renderVotes() {
    var total = 0;
    document.querySelectorAll('.vote').forEach(function (b) {
      var s = b.getAttribute('data-shape'), c = counts[s] || 0; total += c;
      b.setAttribute('aria-pressed', mine[s] ? 'true' : 'false');
      var vc = b.querySelector('.vcount');
      vc.hidden = !(ONLINE && loaded); vc.textContent = c;
      b.setAttribute('aria-label', 'I would try the ' + b.closest('.card').querySelector('h3').textContent + (ONLINE && loaded ? ', ' + c + ' votes' : ''));
    });
    if (note) note.textContent = (ONLINE && loaded) ? total + (total === 1 ? ' vote' : ' votes') + ' so far' : '';
  }
  function saveMine() { store('urma.votes', JSON.stringify(Object.keys(mine).filter(function (k) { return mine[k]; }))); }
  function loadCounts() {
    if (!ONLINE) return;
    api('rpc/vote_counts', {}).then(function (rows) {
      counts = {}; (rows || []).forEach(function (r) { counts[r.product] = Number(r.votes) || 0; });
      loaded = true; renderVotes();
    }).catch(function () { loaded = false; renderVotes(); });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.vote'); if (!b) return;
    var s = b.getAttribute('data-shape');
    if (!ONLINE) { setMode('try'); document.getElementById('feedback').scrollIntoView({ behavior: 'smooth' }); return; }
    if (b.classList.contains('is-busy')) return;
    var on = !mine[s];
    mine[s] = on; counts[s] = Math.max(0, (counts[s] || 0) + (on ? 1 : -1)); saveMine(); renderVotes();
    b.classList.add('is-busy');
    api(on ? 'rpc/cast_vote' : 'rpc/remove_vote', { p_product: s, p_client: cid }).then(function () {
      b.classList.remove('is-busy'); loadCounts();
    }).catch(function () {
      b.classList.remove('is-busy');
      mine[s] = !on; counts[s] = Math.max(0, (counts[s] || 0) + (on ? -1 : 1)); saveMine(); renderVotes();
      if (note) note.textContent = 'Your vote could not be saved. Please try again.';
    });
  });
  renderVotes(); loadCounts();

  /* ---- forms ---- */
  var leadform = document.getElementById('leadform'), fbform = document.getElementById('fbform'),
      card = document.querySelector('.fbcard');
  function setMode(m) {
    var r = document.getElementById(m === 'fb' ? 'm-fb' : 'm-try'); r.checked = true;
    leadform.hidden = m === 'fb'; fbform.hidden = m !== 'fb';
    document.querySelector('[data-copy="try"]').hidden = m === 'fb';
    document.querySelector('[data-copy="fb"]').hidden = m !== 'fb';
  }
  document.querySelectorAll('input[name="mode"]').forEach(function (r) { r.addEventListener('change', function () { setMode(r.value); }); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-mode]'); if (!a) return;
    setMode(a.getAttribute('data-mode'));
    var i = a.getAttribute('data-interest'); if (i) document.getElementById('l-interest').value = i;
  });

  function msgEl(f) { return f.querySelector('.formmsg'); }
  function fail(f, text) { var m = msgEl(f); m.className = 'formmsg err'; m.textContent = text; }
  function done(title, text) {
    card.classList.add('done');
    var t = document.createElement('div'); t.className = 'thanks'; t.setAttribute('role', 'status');
    t.innerHTML = '<h3></h3><p></p>'; t.querySelector('h3').textContent = title; t.querySelector('p').textContent = text;
    var again = document.createElement('button'); again.type = 'button'; again.className = 'btn'; again.style.marginTop = '20px'; again.textContent = 'Send another';
    again.addEventListener('click', function () { t.remove(); card.classList.remove('done'); leadform.reset(); fbform.reset(); [leadform, fbform].forEach(function (f) { msgEl(f).textContent = ''; }); });
    t.appendChild(again); card.appendChild(t);
  }
  function val(f, name) { var el = f.elements[name]; return el ? el.value.trim() : ''; }
  function nul(v) { return v === '' ? null : v; }
  function offline(f) { fail(f, 'Our form is not switched on yet. Please email us at ' + (CFG.email || 'hello@urma.ee') + '.'); }

  leadform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (val(leadform, 'website')) return;
    var name = val(leadform, 'name'), email = val(leadform, 'email'), company = val(leadform, 'company');
    if (!name || !company) { fail(leadform, 'Please add your name and company.'); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { fail(leadform, 'That email address is missing something.'); return; }
    if (!leadform.elements.consent.checked) { fail(leadform, 'Please tick the box so we know it is fine to contact you.'); return; }
    if (!ONLINE) { offline(leadform); return; }
    var btn = leadform.querySelector('button[type="submit"]'); btn.disabled = true;
    api('leads', { name: name, email: email, company: company, role: nul(val(leadform, 'role')), team_size: nul(val(leadform, 'team_size')),
      interest: nul(val(leadform, 'interest')), message: nul(val(leadform, 'message')), consent: true }, 'return=minimal')
      .then(function () { btn.disabled = false; done('Thanks, ' + name.split(' ')[0] + '.', 'We have your details and will get in touch about a trial.'); })
      .catch(function () { btn.disabled = false; fail(leadform, 'That did not go through. Please try again, or email ' + (CFG.email || 'hello@urma.ee') + '.'); });
  });

  fbform.addEventListener('submit', function (e) {
    e.preventDefault();
    if (val(fbform, 'website')) return;
    var noticed = val(fbform, 'noticed'), change = val(fbform, 'change_request'), context = val(fbform, 'context'), contact = val(fbform, 'contact');
    if (!noticed && !change && !context) { fail(fbform, 'Add at least one answer and we will read it.'); return; }
    if (contact && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) { fail(fbform, 'That email address is missing something. You can also leave it empty.'); return; }
    if (!ONLINE) { offline(fbform); return; }
    var btn = fbform.querySelector('button[type="submit"]'); btn.disabled = true;
    api('feedback', { product: nul(val(fbform, 'product')), noticed: nul(noticed), change_request: nul(change), context: nul(context), contact: nul(contact) }, 'return=minimal')
      .then(function () { btn.disabled = false; done('Thank you.', 'Every answer gets read by the people making these.'); })
      .catch(function () { btn.disabled = false; fail(fbform, 'That did not go through. Please try again, or email ' + (CFG.email || 'hello@urma.ee') + '.'); });
  });

  if (location.hash === '#feedback') setMode('try');
})();
