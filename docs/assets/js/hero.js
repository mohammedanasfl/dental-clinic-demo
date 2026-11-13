/* Hero — cinematic intro + a pinned, scroll-driven film.
 *
 * Desktop (>=1024px wide, >=640px tall, motion allowed):
 *   The 4:5 image card is really a "window" onto a full-bleed stage. While the
 *   hero is pinned (~1.6 screens of scrolling) the story plays out, scrubbed by
 *   the scrollbar:
 *     1. the copy lifts away (words slide out of their masks) and the window
 *        expands into a full-bleed, slowly pushing photograph;
 *     2. chapter one lands in big type, an outlined wordmark drifts across;
 *     3. a circular iris opens onto the second photograph, chapter two lands;
 *     4. the booking call-to-action arrives, then the pin releases and the
 *        About section slides over the hero like a curtain.
 *
 * Tablet / mobile: no pin. Intro, a light parallax drift, arrows swap slides.
 * Reduced motion: no intro, no stage, no pin; arrows swap slides instantly.
 */
(function () {
  'use strict';
  var DC = window.DentCare;
  if (!DC) return;
  var gsap = window.gsap;

  var root = document.documentElement;
  var STAGE_MQ = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
  var CARD_HIDDEN = 'inset(100% 0% 0% 0%)', CARD_SHOWN = 'inset(0% 0% 0% 0%)';
  var IRIS_HIDDEN = 'circle(0% at 50% 72%)', IRIS_SHOWN = 'circle(150% at 50% 72%)';
  var FULL = 'inset(0px 0px 0px 0px round 0px)';

  DC.initHero = function () {
    var q = function (s) { return document.querySelector(s); };
    var qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

    var hero = q('#hero'); if (!hero) return;
    var copy = q('[data-hero-copy]'), h1 = q('#hero-title');
    var media = q('[data-hero-media]');
    var slide1 = q('.hero__slide--1'), slide2 = q('#hero-slide2');
    var img1 = slide1.querySelector('img'), img2 = slide2.querySelector('img');
    var glassA = q('[data-hero-glass="a"]'), glassB = q('[data-hero-glass="b"]');
    var blobA = q('[data-hero-blob="a"]'), blobB = q('[data-hero-blob="b"]');
    var stage = q('[data-hero-stage]');
    var sSlide1 = q('.hero__sslide--1'), sSlide2 = q('[data-stage-slide2]');
    var sImg1 = sSlide1.querySelector('img'), sImg2 = sSlide2.querySelector('img');
    var veil = q('.hero__veil'), marquee = q('[data-hero-marquee]'), marqueeText = marquee.firstElementChild;
    var spot = q('.hero__spot');
    var capsEl = q('.hero__caps');
    var cap1 = q('[data-cap="1"]'), cap2 = q('[data-cap="2"]');
    var ocac = q('.hero__ocac'), hud = q('[data-hero-hud]');
    var nos = qa('[data-hero-no]'), fills = qa('[data-hero-fill]'), counters = qa('[data-hero-counter]');
    var motionOn = root.classList.contains('motion');

    var idx = 0;
    var pinnedTrigger = null;

    function setIdx(i) {
      if (i === idx) return;
      idx = i;
      nos.forEach(function (n) { n.textContent = i ? '02' : '01'; });
      counters.forEach(function (c) { c.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of 2'); });
    }

    /** The card's box as an inset() inside the hero — where the stage starts. `grow` shrinks it for the intro. */
    function windowRect(grow) {
      var h = hero.getBoundingClientRect(), m = media.getBoundingClientRect();
      var t = m.top - h.top, l = m.left - h.left, r = h.right - m.right, b = h.bottom - m.bottom;
      if (grow) { var dx = m.width * grow, dy = m.height * grow; t += dy; b += dy; l += dx; r += dx; }
      return 'inset(' + t.toFixed(1) + 'px ' + r.toFixed(1) + 'px ' + b.toFixed(1) + 'px ' + l.toFixed(1) + 'px round ' + (grow ? 28 : 16) + 'px)';
    }

    /* ---------- headline words (shared by intro + scroll story) ---------- */
    var words = DC.splitWords(h1);
    gsap.set(words, { yPercent: 112 });
    h1.style.visibility = 'visible';

    /* ---------- intro ----------
     * Text first: the headline starts rising right away (fonts are self-hosted + preloaded),
     * everything is on screen in ~1.5s, and a watchdog snaps it to the end state on slow
     * devices so the hero can never sit half-drawn. */
    var cue = q('.hero__cue');
    function playIntro() {
      var D = DC.dur, E = DC.ease;
      var staged = root.classList.contains('hero-stage');
      var header = q('#site-header');
      var tl = gsap.timeline({ defaults: { ease: E.out } });
      tl.fromTo([q('.topbar'), header], { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, clearProps: 'transform' }, 0)
        .fromTo([blobA, blobB], { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 0)
        .fromTo(copy.querySelector('.pill'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.05)
        .to(words, { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0.1)
        .fromTo(copy.querySelector('.hero__sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.45)
        .set(copy.querySelector('.hero__cta'), { opacity: 1 }, 0)
        .fromTo(copy.querySelectorAll('.hero__cta > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: DC.stagger.base, clearProps: 'transform' }, 0.6)
        .fromTo(copy.querySelector('.hero__meta'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.75)
        .fromTo([glassA, glassB], { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, stagger: DC.stagger.loose }, 0.7);

      if (staged) {
        tl.set(stage, { opacity: 1 }, 0)
          .fromTo(stage, { clipPath: function () { return windowRect(0.1); } }, { clipPath: function () { return windowRect(); }, duration: 1.2, ease: 'power4.inOut' }, 0)
          .fromTo(sSlide1, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0)
          .fromTo(media, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' }, 0.3)
          .fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.5);
      } else {
        tl.fromTo(media, { opacity: 1, clipPath: 'inset(10% 10% 10% 10% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath' }, 0)
          .fromTo(slide1, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
      }
      // watchdog: never leave the hero half-drawn on a slow device
      window.setTimeout(function () { if (tl.progress() < 1) tl.progress(1); }, 3200);
      return tl;
    }

    if (motionOn) {
      // Wait only briefly (max ~0.5s) for the font + hero image, then go.
      var heroImg = window.matchMedia(STAGE_MQ).matches ? sImg1 : img1;
      var imgReady = heroImg.decode ? heroImg.decode().catch(function () {}) : Promise.resolve();
      var fontsReady = document.fonts && document.fonts.load ? document.fonts.load('600 56px Outfit') : Promise.resolve();
      var timeout = new Promise(function (r) { setTimeout(r, 500); });
      Promise.race([Promise.all([imgReady, fontsReady]), timeout]).then(playIntro);
    } else {
      gsap.set(words, { yPercent: 0 });
    }

    /* ---------- slide control (non-pinned + reduced motion) ---------- */
    function goTo(target, instant) {
      if (target === idx) return;
      var show = !!target;
      if (instant) {
        gsap.set(slide2, { clipPath: show ? CARD_SHOWN : CARD_HIDDEN });
        gsap.set(img2, { scale: 1 });
        gsap.set(fills, { scaleX: show ? 1 : 0.5 });
      } else {
        gsap.to(slide2, { clipPath: show ? CARD_SHOWN : CARD_HIDDEN, duration: 1, ease: 'power3.inOut', overwrite: true });
        gsap.fromTo(img2, { scale: show ? 1.2 : 1 }, { scale: 1, duration: 1.2, ease: 'power3.out', overwrite: true });
        gsap.to(fills, { scaleX: show ? 1 : 0.5, duration: 0.8, ease: 'power3.out' });
      }
      setIdx(target);
    }
    function step() {
      var target = idx ? 0 : 1;
      if (pinnedTrigger) {
        var st = pinnedTrigger, span = st.end - st.start;
        DC.scrollTo(st.start + span * (target ? 0.9 : 0.42), { duration: 1.5 });
      } else {
        goTo(target, DC.prefersReduced());
      }
    }
    qa('[data-hero-prev], [data-hero-next]').forEach(function (b) { b.addEventListener('click', step); });

    /* ---------- scroll behaviour ---------- */
    var mm = gsap.matchMedia();

    // Desktop: the pinned film.
    mm.add(STAGE_MQ, function () {
      root.classList.add('hero-stage');
      gsap.set(stage, { clipPath: windowRect() });
      idx = 0; nos.forEach(function (n) { n.textContent = '01'; });

      var w1 = DC.splitWords(cap1), w2 = DC.splitWords(cap2);
      gsap.set(w1.concat(w2), { yPercent: 112 });
      var rest = [copy.querySelector('.pill'), copy.querySelector('.hero__sub'), copy.querySelector('.hero__cta'), copy.querySelector('.hero__meta')];

      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: function () { return 'top ' + DC.headerH() + 'px'; },
          end: function () { return '+=' + Math.round(window.innerHeight * 1.6); },
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) {
            setIdx(self.progress >= 0.6 ? 1 : 0);
            // once the copy has faded out, take it out of the tab order too
            copy.style.visibility = self.progress > 0.2 ? 'hidden' : '';
            capsEl.style.visibility = self.progress > 0.22 ? 'visible' : '';
          }
        }
      });
      pinnedTrigger = tl.scrollTrigger;

      // 1. copy leaves, window expands into the full-bleed stage
      // Explicit start values (immediateRender:false): the intro owns the first ~2s, so the scroll
      // timeline must never record the pre-intro "hidden" state as its own starting point.
      var NR = { immediateRender: false };
      tl.fromTo(media, { opacity: 1 }, Object.assign({ opacity: 0, duration: 0.06 }, NR), 0)
        .fromTo(cue, { opacity: 1 }, Object.assign({ opacity: 0, duration: 0.04 }, NR), 0)
        .fromTo(words, { yPercent: 0 }, Object.assign({ yPercent: -115, duration: 0.14, stagger: 0.012, ease: 'power2.in' }, NR), 0)
        .fromTo(rest, { opacity: 1, y: 0 }, Object.assign({ opacity: 0, y: -30, duration: 0.12, stagger: 0.02 }, NR), 0)
        .fromTo(glassA, { x: 0, y: 0, opacity: 1 }, Object.assign({ x: -140, y: 80, opacity: 0, duration: 0.2 }, NR), 0)
        .fromTo(glassB, { x: 0, y: 0, opacity: 1 }, Object.assign({ x: 140, y: -60, opacity: 0, duration: 0.2 }, NR), 0)
        .fromTo([blobA, blobB], { opacity: 1 }, Object.assign({ opacity: 0, duration: 0.15 }, NR), 0)
        .fromTo(stage, { clipPath: function () { return windowRect(); } }, { clipPath: FULL, ease: 'power2.inOut', duration: 0.34, immediateRender: false }, 0.02)
        .to(sImg1, { scale: 1.18, duration: 1 }, 0)
        .to(veil, { opacity: 1, duration: 0.3 }, 0.1)
        .to(spot, { opacity: 1, duration: 0.2 }, 0.3)
        // 2. chapter one + outlined wordmark + HUD
        .to(w1, { yPercent: 0, duration: 0.16, stagger: 0.025, ease: 'power3.out' }, 0.26)
        .to(marquee, { opacity: 1, duration: 0.15 }, 0.3)
        .fromTo(marqueeText, { xPercent: 4 }, { xPercent: -30, duration: 0.8 }, 0.25)
        .fromTo(hud, { y: 20 }, { y: 0, autoAlpha: 1, duration: 0.1 }, 0.34)
        // 3. iris to the second photograph, chapter two
        .to(w1, { yPercent: -115, duration: 0.12, stagger: 0.015, ease: 'power2.in' }, 0.52)
        .fromTo(sSlide2, { clipPath: IRIS_HIDDEN }, { clipPath: IRIS_SHOWN, ease: 'power2.inOut', duration: 0.26, immediateRender: false }, 0.52)
        .fromTo(sImg2, { scale: 1.3 }, { scale: 1.08, duration: 0.48 }, 0.52)
        .to(fills, { scaleX: 1, duration: 0.26 }, 0.52)
        .to(w2, { yPercent: 0, duration: 0.16, stagger: 0.025, ease: 'power3.out' }, 0.68)
        // 4. call to action
        .fromTo(ocac, { y: 24 }, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.82);

      // pointer: parallax on the glass cards + image at rest, a cyan spotlight once the stage is full-bleed
      var hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      var mx = 0, my = 0, cx = 0, cy = 0, px = 0.5, py = 0.5;
      var onMove = function (e) {
        var r = hero.getBoundingClientRect();
        px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height;
        mx = px - 0.5; my = py - 0.5;
      };
      var drift = function () {
        var k = Math.max(0, 1 - (tl.scrollTrigger ? tl.scrollTrigger.progress : 0) * 8); // fades out as the stage expands
        cx += (mx * k - cx) * 0.08; cy += (my * k - cy) * 0.08;
        glassA.style.translate = (-cx * 28).toFixed(1) + 'px ' + (-cy * 18).toFixed(1) + 'px';
        glassB.style.translate = (cx * 36).toFixed(1) + 'px ' + (cy * 22).toFixed(1) + 'px';
        sSlide1.style.translate = (-cx * 14).toFixed(1) + 'px ' + (-cy * 10).toFixed(1) + 'px';
        stage.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
        stage.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
      };
      if (hover) { hero.addEventListener('pointermove', onMove); gsap.ticker.add(drift); }

      // keep the window glued to the card if layout shifts while still at rest
      var onRefresh = function () { if (tl.scrollTrigger && tl.scrollTrigger.progress === 0) gsap.set(stage, { clipPath: windowRect() }); };
      window.ScrollTrigger.addEventListener('refresh', onRefresh);

      return function () {
        window.ScrollTrigger.removeEventListener('refresh', onRefresh);
        hero.removeEventListener('pointermove', onMove); gsap.ticker.remove(drift);
        [glassA, glassB, sSlide1].forEach(function (el) { el.style.translate = ''; });
        root.classList.remove('hero-stage');
        copy.style.visibility = ''; capsEl.style.visibility = '';
        pinnedTrigger = null;
        idx = 0; nos.forEach(function (n) { n.textContent = '01'; });
        counters.forEach(function (c) { c.setAttribute('aria-label', 'Slide 1 of 2'); });
      };
    });

    // Tablet / mobile / short windows: no pin, just a gentle drift.
    mm.add('(max-width: 1023px), (max-height: 639px)', function () {
      if (DC.prefersReduced()) return;
      gsap.to(media, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      gsap.to(img1, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    });
  };
})();
