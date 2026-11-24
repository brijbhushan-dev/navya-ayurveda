document.addEventListener('DOMContentLoaded', function () {
  var header = document.getElementById('siteHeader');
  var back = document.getElementById('backTop');
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 10);
    if (back) back.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (back) back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Close mobile menu after selecting a link
  var nav = document.getElementById('mainNav');
  if (nav && window.bootstrap) {
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        if (nav.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(nav).hide();
      });
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    items.forEach(function (el) { io.observe(el); });
  } else items.forEach(function (el) { el.classList.add('in'); });

  // WhatsApp CTA (only when a real number is set)
  var wa = document.getElementById('waCta');
  if (wa && window.DAKSH_SITE && DAKSH_SITE.whatsapp) { wa.href = 'https://wa.me/' + DAKSH_SITE.whatsapp; wa.hidden = false; }

  // Form validation (front-end prototype, ready for backend integration)
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    var ok = form.parentElement.querySelector('.success-state');
    function check(el) {
      var v = (el.value || '').trim(), msg = '';
      if (el.required && !v) msg = 'This field is required.';
      else if (el.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Please enter a valid email address.';
      else if (el.type === 'tel' && v && !/^[+\d][\d\s\-]{7,16}$/.test(v)) msg = 'Please enter a valid phone number.';
      else if (el.type === 'file' && el.files.length) {
        var fl = el.files[0], ext = fl.name.split('.').pop().toLowerCase();
        if (['pdf', 'doc', 'docx'].indexOf(ext) < 0) msg = 'Upload a PDF, DOC or DOCX file.';
        else if (fl.size > 5 * 1024 * 1024) msg = 'File must be under 5 MB.';
      } else if (el.minLength > 0 && v && v.length < el.minLength) msg = 'Please write at least ' + el.minLength + ' characters.';
      el.classList.toggle('is-invalid', !!msg); el.classList.toggle('is-valid', !msg && !!v);
      var fb = el.parentElement.querySelector('.invalid-feedback'); if (fb) fb.textContent = msg;
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      return !msg;
    }
    var fields = form.querySelectorAll('input,select,textarea');
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { check(el); });
      el.addEventListener('input', function () { if (el.classList.contains('is-invalid')) check(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var good = true, first = null;
      fields.forEach(function (el) { if (!check(el)) { good = false; if (!first) first = el; } });
      if (!good) { first.focus(); return; }
      // Backend hook: send new FormData(form) to your endpoint here, e.g. fetch('/api/contact', {method:'POST', body:new FormData(form)})
      form.hidden = true; form.parentElement.querySelectorAll('.form-intro').forEach(function (n) { n.hidden = true; });
      if (ok) { ok.classList.add('show'); ok.focus(); ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
    var again = ok && ok.querySelector('[data-reset]');
    if (again) again.addEventListener('click', function () {
      form.reset(); form.hidden = false; fields.forEach(function (el) { el.classList.remove('is-valid', 'is-invalid'); });
      form.parentElement.querySelectorAll('.form-intro').forEach(function (n) { n.hidden = false; });
      ok.classList.remove('show');
    });
  });

  // Job "Apply now" preselects the position
  document.querySelectorAll('[data-apply]').forEach(function (b) {
    b.addEventListener('click', function () {
      var sel = document.getElementById('position'); if (sel) sel.value = b.getAttribute('data-apply');
    });
  });

  // FAQ accordion, search and filters
  var faqList = document.getElementById('faqList');
  if (faqList) {
    var itemsF = faqList.querySelectorAll('.faq-item'), cat = 'all', q = '';
    itemsF.forEach(function (it, i) {
      var btn = it.querySelector('.faq-q'), pane = it.querySelector('.faq-a');
      btn.id = 'fq' + i; pane.id = 'fa' + i; btn.setAttribute('aria-controls', pane.id); btn.setAttribute('aria-expanded', 'false');
      pane.setAttribute('role', 'region'); pane.setAttribute('aria-labelledby', btn.id);
      btn.addEventListener('click', function () {
        var open = !it.classList.contains('open');
        it.classList.toggle('open', open); btn.setAttribute('aria-expanded', open);
      });
    });
    function filter() {
      var shown = 0;
      itemsF.forEach(function (it) {
        var okc = cat === 'all' || it.dataset.cat === cat, okq = !q || it.textContent.toLowerCase().indexOf(q) > -1;
        it.hidden = !(okc && okq); if (!it.hidden) shown++;
      });
      document.getElementById('faqEmpty').style.display = shown ? 'none' : 'block';
    }
    document.querySelectorAll('.chip').forEach(function (c) {
      c.addEventListener('click', function () {
        document.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
        c.classList.add('active'); c.setAttribute('aria-pressed', 'true'); cat = c.dataset.cat; filter();
      });
    });
    document.getElementById('faqSearch').addEventListener('input', function (e) { q = e.target.value.trim().toLowerCase(); filter(); });
  }
});
