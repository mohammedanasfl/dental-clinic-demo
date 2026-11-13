/* DentCare motion system
 * ------------------------------------------------------------------
 * One place for durations, easings and reusable helpers so every
 * section animates with the same vocabulary.
 *
 * Responsibilities (kept separate on purpose):
 *   GSAP + ScrollTrigger : everything scroll-driven, reveals, intro, menu
 *   Lenis                : smooth wheel scrolling only (touch stays native)
 *   CSS                  : hover / focus / button micro-interactions
 */
(function () {
  'use strict';
  if (!window.gsap || !window.ScrollTrigger) return;

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  var DC = (window.DentCare = window.DentCare || {});

  // Durations (seconds) — see brief: micro 150-300ms, UI 250-450ms,
  // scroll reveals 500-900ms, cinematic 800-1200ms.
  DC.dur = { micro: 0.25, ui: 0.4, reveal: 0.8, cinematic: 1.1 };
  // Easings — one smooth "expo-out" family, no bounce.
  DC.ease = { out: 'expo.out', soft: 'power3.out', inOut: 'power3.inOut', scrub: 'none' };
  DC.stagger = { tight: 0.06, base: 0.1, loose: 0.14 };

  DC.prefersReduced = function () {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  /** Header height in px (sticky header, excludes the top bar). */
  DC.headerH = function () {
    var h = document.getElementById('site-header');
    return h ? h.offsetHeight : 80;
  };

  /**
   * Split an element's text into masked words so each can slide up.
   * Preserves inline children (e.g. gradient <span>, <br>) and keeps the
   * text readable by assistive tech (words stay in normal text flow).
   * Idempotent: calling twice returns the same word list.
   */
  DC.splitWords = function (el) {
    if (el._dcWords) return el._dcWords;
    var words = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var parts = child.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'w';
            var i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
            w.appendChild(i); frag.appendChild(w); words.push(i);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== 'BR') {
          walk(child);
        }
      });
    })(el);
    el._dcWords = words;
    return words;
  };

  /**
   * Split an element's text into single characters (used for the phone number
   * roll-in and the footer wordmark). `mask:true` wraps each in a clipping box.
   */
  DC.splitChars = function (el, opts) {
    if (el._dcChars) return el._dcChars;
    opts = opts || {};
    var text = el.textContent, chars = [];
    el.textContent = '';
    Array.from(text).forEach(function (c) {
      if (c === ' ') { el.appendChild(document.createTextNode('\u00a0')); return; }
      var i = document.createElement('span');
      i.className = opts.cls || 'wi';
      i.textContent = c;
      if (opts.mask) {
        var w = document.createElement('span'); w.className = 'w'; w.appendChild(i); el.appendChild(w);
      } else { el.appendChild(i); }
      chars.push(i);
    });
    el._dcChars = chars;
    return chars;
  };

  /** Run fn once when `trigger` reaches `start`. Cleaned up by gsap.matchMedia. */
  DC.once = function (trigger, fn, start) {
    return ScrollTrigger.create({ trigger: trigger, start: start || 'top 85%', once: true, onEnter: fn });
  };

  /** Fade + rise a list of elements into place when `trigger` enters. */
  DC.riseIn = function (targets, trigger, opts) {
    opts = opts || {};
    var els = gsap.utils.toArray(targets);
    if (!els.length) return;
    gsap.set(els, { opacity: 0, y: opts.y == null ? 28 : opts.y, x: opts.x || 0 });
    DC.once(trigger, function () {
      gsap.to(els, {
        opacity: 1, y: 0, x: 0,
        duration: opts.duration || DC.dur.reveal,
        ease: DC.ease.out,
        stagger: opts.stagger == null ? DC.stagger.base : opts.stagger,
        delay: opts.delay || 0,
        clearProps: 'transform,opacity'
      });
    }, opts.start);
  };

  /** Same idea for lists that wrap onto several rows / columns. `from`/`to` add extra props (e.g. rotationX). */
  DC.batchIn = function (targets, opts) {
    opts = opts || {};
    var els = gsap.utils.toArray(targets);
    if (!els.length) return;
    gsap.set(els, Object.assign({ opacity: 0, y: opts.y == null ? 50 : opts.y, x: opts.x || 0, scale: opts.scale || 1 }, opts.from || {}));
    ScrollTrigger.batch(els, {
      start: opts.start || 'top 90%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, Object.assign({
          opacity: 1, y: 0, x: 0, scale: 1,
          duration: opts.duration || DC.dur.cinematic * 0.85,
          ease: DC.ease.out,
          stagger: opts.stagger == null ? DC.stagger.base : opts.stagger,
          clearProps: 'transform,opacity'
        }, opts.to || {}));
        if (opts.onBatch) opts.onBatch(batch);
      }
    });
  };

  /** Smooth scroll to an element or a pixel offset (Lenis when active). */
  DC.scrollTo = function (target, opts) {
    opts = opts || {};
    var off = opts.offset || 0;
    if (DC.lenis) {
      DC.lenis.scrollTo(target, {
        offset: off,
        immediate: !!opts.immediate,
        duration: opts.duration || 1.3,
        easing: function (t) { return 1 - Math.pow(1 - t, 4); }
      });
      return;
    }
    var y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.pageYOffset + off;
    window.scrollTo({ top: y, behavior: opts.immediate || DC.prefersReduced() ? 'auto' : 'smooth' });
  };
})();
