/* DentCare app shell: smooth scroll, navigation, mobile menu, forms, extras. */
(function () {
  'use strict';
  var DC = window.DentCare;
  var root = document.documentElement;

  function fail(err) {
    // Never leave the page hidden if something goes wrong.
    root.classList.remove('motion');
    if (window.console) console.error('[DentCare]', err);
  }
  if (!DC || !window.gsap || !window.ScrollTrigger) { fail('animation libraries missing'); return; }

  var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var CONTACT_EMAIL = 'info@example.com';
  var CONTACT_PHONE = '+012 345 6789';

  /* ---------- smooth scrolling (Lenis, wheel only, never on reduced motion) ---------- */
  function initScroll() {
    if (DC.prefersReduced() || !window.Lenis) return;
    var lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    DC.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- sticky header: transparent -> solid, active section, back to top ---------- */
  function initHeader() {
    var header = $('#site-header');
    var toTop = $('#to-top');
    var ticking = false;
    function update() {
      var y = window.pageYOffset;
      header.classList.toggle('is-solid', y > 20);
      toTop.classList.toggle('is-visible', y > 700);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();

    toTop.addEventListener('click', function () { DC.scrollTo(0, { duration: 1.6 }); });

    // Active nav state: the lowest section whose band crosses the middle of the viewport.
    var ids = ['hero', 'about', 'services', 'appointment', 'dentists', 'contact'];
    var seen = {};
    var links = $$('[data-nav]');
    function paint() {
      var current = null;
      ids.forEach(function (id) { if (seen[id]) current = id; });
      links.forEach(function (a) {
        var on = a.getAttribute('data-nav') === current;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { seen[e.target.id] = e.isIntersecting; });
      paint();
    }, { rootMargin: '-45% 0px -54% 0px' });
    ids.forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------- anchors: smooth scroll with header offset, no dead "#" jumps ---------- */
  function initAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var hash = a.getAttribute('href');
      if (hash === '#') { e.preventDefault(); return; } // placeholder links stay inert
      var target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      closeMenu(true);
      goTo(target, hash);
      if (history.pushState) history.pushState(null, '', hash);
    });
  }
  function goTo(target, hash, immediate) {
    var offset = hash === '#hero' ? 0 : -(DC.headerH() + 4);
    if (hash === '#hero') { DC.scrollTo(0, { immediate: immediate }); }
    else { DC.scrollTo(target, { offset: offset, immediate: immediate }); }
    // keep keyboard / screen-reader context in step with the scroll
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  /* ---------- mobile menu ---------- */
  var menu, toggle, header, menuOpen = false, lastFocus = null;
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true; lastFocus = document.activeElement;
    menu.style.paddingTop = Math.round(header.getBoundingClientRect().bottom) + 'px';
    header.classList.add('menu-open');
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    if (DC.lenis) DC.lenis.stop(); else document.body.style.overflow = 'hidden';
    var anim = !DC.prefersReduced();
    if (anim) {
      gsap.fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: DC.ease.out, clearProps: 'clipPath' });
      gsap.fromTo($$('.mlink, .mnav__foot > *', menu), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.7, ease: DC.ease.out, stagger: 0.06, delay: 0.12, clearProps: 'transform,opacity' });
    }
    var first = $('.mlink', menu); if (first) first.focus({ preventScroll: true });
  }
  function closeMenu(instant) {
    if (!menuOpen) return;
    menuOpen = false;
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    if (DC.lenis) DC.lenis.start(); else document.body.style.overflow = '';
    function done() {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      gsap.set(menu, { clearProps: 'clipPath' });
    }
    if (instant || DC.prefersReduced()) { done(); }
    else { gsap.to(menu, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.4, ease: 'power3.in', onComplete: done }); }
    if (!instant && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function initMenu() {
    menu = $('#mobile-menu'); toggle = $('#menu-toggle'); header = $('#site-header');
    toggle.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });
    document.addEventListener('keydown', function (e) {
      if (!menuOpen) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key === 'Tab') { // keep focus inside the open menu
        var f = $$('a[href], button', menu).concat([toggle]).filter(function (el) { return el.offsetParent !== null; });
        var i = f.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (m) { if (m.matches) closeMenu(true); });
  }

  /* ---------- forms: real hand-off to the visitor's mail app (no fake success) ---------- */
  function initForms() {
    $$('form[data-mailto]').forEach(function (form) {
      var status = $('.form-status', form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); status.textContent = ''; return; }
        var kind = form.getAttribute('data-mailto');
        var d = {};
        $$('input, select, textarea', form).forEach(function (el) { if (el.name) d[el.name] = el.value.trim(); });
        var subject, lines;
        if (kind === 'appointment') {
          subject = 'Appointment request: ' + d.service;
          lines = ['Service: ' + d.service, 'Preferred doctor: ' + d.doctor, 'Name: ' + d.name, 'Phone: ' + d.phone, 'Preferred date: ' + d.date];
        } else {
          subject = 'Website enquiry: ' + d.subject;
          lines = ['Name: ' + d.name, 'Email: ' + d.email, 'Subject: ' + d.subject, '', d.message];
        }
        status.textContent = 'Opening your email app with your details. If nothing opens, email ' + CONTACT_EMAIL + ' or call ' + CONTACT_PHONE + '.';
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      });
    });

    // booking stepper reflects real progress through the form
    var appt = $('#appointment-form');
    if (appt) {
      var steps = $$('.step', $('#stepper')), lines = $$('.step-line', $('#stepper'));
      var update = function () {
        var v = function (n) { return appt.elements[n].value.trim(); };
        var ok = [!!v('service'), !!v('date'), !!(v('name') && v('phone'))];
        var current = ok.indexOf(false); // -1 once everything is filled in
        steps.forEach(function (s, i) {
          s.classList.toggle('is-done', current === -1 || i < current);
          s.classList.toggle('is-current', i === current);
        });
        lines.forEach(function (l, i) { l.classList.toggle('is-done', current === -1 || i < current); });
      };
      ['input', 'change'].forEach(function (ev) { appt.addEventListener(ev, update); });
    }
  }

  /* ---------- magnetic buttons (fine pointers only) ---------- */
  function initMagnetic() {
    var mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
      var cleanups = [];
      $$('[data-magnetic]').forEach(function (btn) {
        var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        function move(e) {
          var r = btn.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        }
        function leave() { xTo(0); yTo(0); }
        btn.addEventListener('pointermove', move);
        btn.addEventListener('pointerleave', leave);
        cleanups.push(function () {
          btn.removeEventListener('pointermove', move);
          btn.removeEventListener('pointerleave', leave);
          gsap.set(btn, { clearProps: 'x,y' });
        });
      });
      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });
  }

  /* ---------- service cards: 3D tilt + cursor spotlight (fine pointers only) ---------- */
  function initTilt() {
    var mm = gsap.matchMedia();
    mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', function () {
      var cleanups = [];
      $$('[data-tilt]').forEach(function (card) {
        var rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        var ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
        function move(e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 12); rx(-(py - 0.5) * 12);
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
        }
        function leave() { rx(0); ry(0); }
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        cleanups.push(function () {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', leave);
          gsap.set(card, { clearProps: 'rotationX,rotationY' });
        });
      });
      return function () { cleanups.forEach(function (fn) { fn(); }); };
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    try {
      initScroll();
      initHeader();
      initAnchors();
      initMenu();
      initForms();
      DC.initHero();
      DC.initSections();
      initMagnetic();
      initTilt();

      // Layout can shift once fonts / images are in: recalc pinned distances.
      var refresh = function () { ScrollTrigger.refresh(); };
      window.addEventListener('load', function () {
        refresh();
        if (location.hash.length > 1) {
          var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (t) goTo(t, location.hash, true);
        }
      });
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

      window.__dcReady = true;
    } catch (err) { fail(err); }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
