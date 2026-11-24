/* Shared header and footer. Edit SITE once and every page updates. */
(function () {
  var SITE = {
    name: 'Navya Ayurveda',
    instagram: '#',
    facebook: '#', // TODO: add Facebook page URL
    phone: '+91 97111 01482',
    phoneHref: 'tel:+919711101482',
    email: 'brijpant88@gmail.com',
    address: 'Your address line, City, State, India', // TODO
    hours: 'Mon to Sat, 10:00 AM to 6:00 PM', // TODO
    whatsapp: '' // add number like 919999999999 to enable WhatsApp CTA
  };
  window.DAKSH_SITE = SITE;

  var pages = [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'about', label: 'About Us', href: 'about.html' },
    { key: 'career', label: 'Career', href: 'career.html' },
    { key: 'faq', label: 'FAQ', href: 'faq.html' },
    { key: 'contact', label: 'Contact Us', href: 'contact.html' }
  ];
  var current = document.body.getAttribute('data-page');

  var links = pages.map(function (p) {
    var on = p.key === current;
    return '<li class="nav-item"><a class="nav-link' + (on ? ' active' : '') + '" href="' + p.href + '"' + (on ? ' aria-current="page"' : '') + '>' + p.label + '</a></li>';
  }).join('');

  var brand = function (cls) {
    return '<a class="brand ' + (cls || '') + '" href="index.html" aria-label="Navya Ayurveda home"><img src="img/logo.svg" alt="" width="48" height="48"><span class="brand-text"><b>Navya</b><small>Ayurveda</small></span></a>';
  };

  var header =
    '<a class="skip-link" href="#main">Skip to content</a>' +
    '<div class="topbar d-none d-lg-block"><div class="container d-flex justify-content-between align-items-center">' +
    '<div><a href="' + SITE.phoneHref + '"><i class="fa-solid fa-phone me-2"></i>' + SITE.phone + '</a><span class="sep">|</span><a href="mailto:' + SITE.email + '"><i class="fa-regular fa-envelope me-2"></i>' + SITE.email + '</a></div>' +
    '<div><i class="fa-regular fa-clock me-2"></i>' + SITE.hours + '</div></div></div>' +
    '<header class="site-header" id="siteHeader"><nav class="navbar navbar-expand-lg" aria-label="Main navigation"><div class="container">' +
    brand() +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="burger"></span></button>' +
    '<div class="collapse navbar-collapse" id="mainNav">' +
    '<ul class="navbar-nav mx-auto mb-2 mb-lg-0">' + links + '</ul>' +
    '<div class="d-flex align-items-center gap-3 mobile-actions">' +
    '<div class="social-mini"><a href="' + SITE.instagram + '" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="' + SITE.facebook + '" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a><a class="d-lg-none" href="' + SITE.phoneHref + '" aria-label="Call us"><i class="fa-solid fa-phone"></i></a></div>' +
    '<a class="btn-daksh" href="contact.html">Contact Us <i class="fa-solid fa-arrow-right-long"></i></a>' +
    '</div></div></div></nav></header>';

  var footer =
    '<footer class="site-footer"><div class="container"><div class="row g-5">' +
    '<div class="col-lg-4 col-md-6 foot-brand">' + brand() +
    '<p class="mt-3 pe-lg-4">A wellness brand inspired by Ayurveda. We share calm, natural and balanced living rooted in Indian heritage.</p>' +
    '<div class="foot-social"><a href="' + SITE.instagram + '" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><a href="' + SITE.facebook + '" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a></div></div>' +
    '<div class="col-12 col-lg-2 foot-col"><h4><button type="button" class="foot-acc" aria-expanded="false" aria-controls="fqLinks"><span>Quick Links</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></h4><div class="foot-panel" id="fqLinks"><ul class="foot-links">' +
    pages.map(function (p) { return '<li><a href="' + p.href + '">' + p.label + '</a></li>'; }).join('') + '</ul></div></div>' +
    '<div class="col-12 col-lg-3 foot-col"><h4><button type="button" class="foot-acc" aria-expanded="false" aria-controls="fxLinks"><span>Explore</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></h4><div class="foot-panel" id="fxLinks"><ul class="foot-links">' +
    '<li><a href="ayurvedic-wellness.html">Ayurvedic Wellness</a></li><li><a href="our-philosophy.html">Our Philosophy</a></li><li><a href="career.html#jobs">Career Opportunities</a></li><li><a href="faq.html">Frequently Asked Questions</a></li></ul></div></div>' +
    '<div class="col-12 col-lg-3 foot-col"><h4><button type="button" class="foot-acc" aria-expanded="false" aria-controls="fgLinks"><span>Get in Touch</span><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button></h4><div class="foot-panel" id="fgLinks"><ul class="foot-contact">' +
    '<li><i class="fa-solid fa-phone"></i><a href="' + SITE.phoneHref + '">' + SITE.phone + '</a></li>' +
    '<li><i class="fa-regular fa-envelope"></i><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li>' +
    '<li><i class="fa-solid fa-location-dot"></i><span>' + SITE.address + '</span></li>' +
    '<li><i class="fa-regular fa-clock"></i><span>' + SITE.hours + '</span></li></ul></div></div>' +
    '</div><div class="foot-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">' +
    '<span>&copy; <span id="yr"></span> Navya Ayurveda. All rights reserved.</span>' +
    '<span><a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a></span></div></div></footer>' +
    '<button class="back-top" id="backTop" aria-label="Back to top"><i class="fa-solid fa-chevron-up"></i></button>';

  var h = document.getElementById('site-header'), f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
  // footer accordions (below 992px); always open on desktop
  var accs = document.querySelectorAll('.foot-acc'), mq = window.matchMedia('(min-width: 992px)');
  function syncAcc() {
    accs.forEach(function (b) {
      var open = b.closest('.foot-col').classList.contains('open');
      b.tabIndex = mq.matches ? -1 : 0;
      b.setAttribute('aria-expanded', mq.matches || open ? 'true' : 'false');
    });
  }
  accs.forEach(function (b) {
    b.addEventListener('click', function () {
      var col = b.closest('.foot-col'), open = col.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  if (mq.addEventListener) mq.addEventListener('change', syncAcc); else mq.addListener(syncAcc);
  syncAcc();
  var y = document.getElementById('yr'); if (y) y.textContent = new Date().getFullYear();
})();
