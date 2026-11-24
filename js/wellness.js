/* Ayurvedic Wellness page: dosha tabs */
(function () {
  var tabs = document.querySelectorAll('.dosha-tab');
  if (!tabs.length) return;
  var panels = document.querySelectorAll('.dosha-panel');

  function select(name, focus) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-dosha') === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(function (p) { p.classList.toggle('active', p.id === 'dosha-' + name); });
  }

  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t.getAttribute('data-dosha')); });
    t.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft') n = tabs[(i - 1 + tabs.length) % tabs.length];
      if (n) { e.preventDefault(); select(n.getAttribute('data-dosha'), true); }
    });
  });
  select('vata');
})();
