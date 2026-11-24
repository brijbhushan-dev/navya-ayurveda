/* Home hero slider: autoplay, progress ticks, arrows, swipe, keyboard, pause, parallax. */
(function () {
  var root = document.getElementById('heroSlider');
  if (!root) return;

  var copies = root.querySelectorAll('.hs-copy');
  var imgs = root.querySelectorAll('.hs-img');
  var chips = root.querySelectorAll('.hs-chipset');
  var bgs = root.querySelectorAll('.hs-bgs i');
  var ticks = root.querySelectorAll('.hs-ticks button');
  var num = document.getElementById('hsNum');
  var pauseBtn = document.getElementById('hsPause');
  var caps = root.querySelectorAll('.hs-cap');
  var peek = document.getElementById('hsPeek');
  var peekImg = peek.querySelector('img');
  var total = copies.length;
  var delay = parseInt(root.getAttribute('data-autoplay'), 10) || 6500;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0, timer = null, userPaused = reduce, hoverPaused = false, hidden = false;

  root.style.setProperty('--hs-dur', delay + 'ms');

  // split headings into masked words so each one can slide up in turn
  function splitWords(node, counter) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'), inner = document.createElement('span');
          w.className = 'w'; inner.textContent = part; inner.style.setProperty('--i', counter.n++);
          w.appendChild(inner); frag.appendChild(w);
        });
        node.replaceChild(frag, n);
      } else if (n.nodeType === 1) { splitWords(n, counter); }
    });
  }
  copies.forEach(function (c) {
    var h = c.querySelector('h1,h2'); if (!h) return;
    h.setAttribute('aria-label', h.textContent);
    splitWords(h, { n: 0 });
    Array.prototype.forEach.call(h.querySelectorAll('.w'), function (w) { w.setAttribute('aria-hidden', 'true'); });
  });

  // floating pollen specks
  if (!reduce) {
    var box = root.querySelector('.hs-particles');
    for (var p = 0; p < 14; p++) {
      var d = document.createElement('i');
      d.style.left = (Math.random() * 100) + '%';
      d.style.setProperty('--s', (4 + Math.random() * 8).toFixed(1) + 'px');
      d.style.setProperty('--t', (9 + Math.random() * 10).toFixed(1) + 's');
      d.style.setProperty('--d', (-Math.random() * 18).toFixed(1) + 's');
      d.style.setProperty('--x', ((Math.random() - .5) * 120).toFixed(0) + 'px');
      box.appendChild(d);
    }
  }

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function show(i, fromUser) {
    index = (i + total) % total;
    for (var k = 0; k < total; k++) {
      var on = k === index;
      copies[k].classList.toggle('is-active', on);
      copies[k].setAttribute('aria-hidden', on ? 'false' : 'true');
      imgs[k].classList.toggle('is-active', on);
      chips[k].classList.toggle('is-active', on);
      bgs[k].classList.toggle('on', on);
      ticks[k].classList.toggle('is-active', on);
      ticks[k].classList.toggle('is-done', k < index);
      ticks[k].setAttribute('aria-current', on ? 'true' : 'false');
      var links = copies[k].querySelectorAll('a');
      for (var j = 0; j < links.length; j++) links[j].tabIndex = on ? 0 : -1;
    }
    num.textContent = pad(index + 1);
    for (var c = 0; c < total; c++) caps[c].classList.toggle('is-active', c === index);
    var nx = (index + 1) % total;
    peek.classList.add('swap');
    setTimeout(function () { peekImg.src = imgs[nx].getAttribute('src'); peek.classList.remove('swap'); }, 350);
    num.classList.remove('flip'); void num.offsetWidth; num.classList.add('flip');
    root.querySelector('.hs-copies').setAttribute('aria-live', userPaused || fromUser ? 'polite' : 'off');
    schedule();
  }

  function canRun() { return !userPaused && !hoverPaused && !hidden; }

  function schedule() {
    clearTimeout(timer);
    // restart the progress fill so the bar and the timer always stay in sync
    var bar = ticks[index].querySelector('.t-bar i');
    bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    root.classList.toggle('is-running', canRun());
    if (canRun()) timer = setTimeout(function () { show(index + 1); }, delay);
  }

  function setPaused(p) {
    userPaused = p;
    pauseBtn.setAttribute('aria-label', p ? 'Play slideshow' : 'Pause slideshow');
    pauseBtn.innerHTML = '<i class="fa-solid ' + (p ? 'fa-play' : 'fa-pause') + '"></i>';
    root.classList.toggle('is-paused', p);
    schedule();
  }

  peek.addEventListener('click', function () { show(index + 1, true); });
  document.getElementById('hsNext').addEventListener('click', function () { show(index + 1, true); });
  document.getElementById('hsPrev').addEventListener('click', function () { show(index - 1, true); });
  pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });
  ticks.forEach(function (b) { b.addEventListener('click', function () { show(parseInt(b.getAttribute('data-i'), 10), true); }); });

  // pause while the pointer or keyboard focus is inside the slider text/controls
  var hold = root.querySelector('.hs-inner');
  hold.addEventListener('mouseenter', function () { hoverPaused = true; schedule(); });
  hold.addEventListener('mouseleave', function () { hoverPaused = false; schedule(); });
  hold.addEventListener('focusin', function () { hoverPaused = true; schedule(); });
  hold.addEventListener('focusout', function () { hoverPaused = false; schedule(); });
  document.addEventListener('visibilitychange', function () { hidden = document.hidden; schedule(); });

  // keyboard
  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(index + 1, true); }
    else if (e.key === 'ArrowLeft') { show(index - 1, true); }
  });

  // swipe
  var sx = 0, sy = 0, tracking = false;
  root.addEventListener('touchstart', function (e) { var t = e.touches[0]; sx = t.clientX; sy = t.clientY; tracking = true; }, { passive: true });
  root.addEventListener('touchend', function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) show(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  // soft mouse parallax (desktop, motion allowed)
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    var raf = null, mx = 0, my = 0;
    root.addEventListener('mousemove', function (e) {
      var r = root.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(function () {
        root.style.setProperty('--mx', mx.toFixed(3)); root.style.setProperty('--my', my.toFixed(3)); raf = null;
      });
    });
  }

  setPaused(userPaused);
  show(0);
})();
