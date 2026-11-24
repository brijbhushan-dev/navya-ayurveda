/* Legal pages: highlight the section being read in the left menu and keep it in view. */
(function () {
  var nav = document.getElementById('legalNav');
  if (!nav) return;
  var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  var sections = Array.prototype.slice.call(document.querySelectorAll('.legal-sec'));
  var lockUntil = 0;

  function setActive(id) {
    links.forEach(function (a) {
      var on = a === map[id];
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    var a = map[id];
    if (!a) return;
    // scroll only the menu box (never the page) so the active item stays visible
    var top = a.offsetTop, bottom = top + a.offsetHeight, box = nav.closest('.legal-nav');
    if (top < box.scrollTop + 40) box.scrollTo({ top: Math.max(0, top - 60), behavior: 'smooth' });
    else if (bottom > box.scrollTop + box.clientHeight - 20) box.scrollTo({ top: bottom - box.clientHeight + 60, behavior: 'smooth' });
  }

  links.forEach(function (a) {
    a.addEventListener('click', function () {
      lockUntil = Date.now() + 900; // ignore spy updates while the page is scrolling to the clicked section
      setActive(a.getAttribute('href').slice(1));
    });
  });

  function spy() {
    if (Date.now() < lockUntil) return;
    var line = 140, current = sections[0].id;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top - line <= 0) current = s.id; });
    // at the very bottom, make sure the last section is the active one
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1].id;
    setActive(current);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { spy(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', spy);
  spy();
})();
