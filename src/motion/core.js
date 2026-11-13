/* DentCare motion system
 * ------------------------------------------------------------------
 * One place for durations, easings and reusable helpers so every
 * section animates with the same vocabulary.
 *
 * Responsibilities (kept separate on purpose):
 *   GSAP + ScrollTrigger : everything scroll-driven, reveals, intro
 *   Lenis                : smooth wheel scrolling only (touch stays native)
 *   Framer Motion        : React UI transitions (mobile menu, back-to-top)
 *   CSS                  : hover / focus / button micro-interactions
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };

// Durations (seconds) — micro 150-300ms, UI 250-450ms, scroll reveals 500-900ms, cinematic 800-1200ms.
export const dur = { micro: 0.25, ui: 0.4, reveal: 0.8, cinematic: 1.1 };
// One smooth "expo-out" family, no bounce.
export const ease = { out: 'expo.out', soft: 'power3.out', inOut: 'power3.inOut', scrub: 'none' };
export const stagger = { tight: 0.06, base: 0.1, loose: 0.14 };

export const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Header height in px (sticky header, excludes the top bar). */
export const headerH = () => {
  const h = document.getElementById('site-header');
  return h ? h.offsetHeight : 80;
};

/* ---- Lenis singleton (created by startSmoothScroll) ---- */
let lenisInstance = null;
export const setLenis = (l) => { lenisInstance = l; };
export const getLenis = () => lenisInstance;

/**
 * Split an element's text into masked words so each can slide up.
 * Preserves inline children (gradient <span>, <br>) and keeps the text readable by
 * assistive tech (words stay in normal text flow). Idempotent per element.
 */
export function splitWords(el) {
  if (el._dcWords) return el._dcWords;
  const words = [];
  (function walk(node) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          const w = document.createElement('span'); w.className = 'w';
          const i = document.createElement('span'); i.className = 'wi'; i.textContent = p;
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
}

/** Single-character split (phone roll-in, footer wordmark). `mask` wraps each char in a clipping box. */
export function splitChars(el, opts = {}) {
  if (el._dcChars) return el._dcChars;
  const text = el.textContent, chars = [];
  el.textContent = '';
  Array.from(text).forEach((c) => {
    if (c === ' ') { el.appendChild(document.createTextNode(' ')); return; }
    const i = document.createElement('span');
    i.className = opts.cls || 'wi';
    i.textContent = c;
    if (opts.mask) {
      const w = document.createElement('span'); w.className = 'w'; w.appendChild(i); el.appendChild(w);
    } else { el.appendChild(i); }
    chars.push(i);
  });
  el._dcChars = chars;
  return chars;
}

/** Run fn once when `trigger` reaches `start`. Cleaned up by gsap.matchMedia. */
export const once = (trigger, fn, start) =>
  ScrollTrigger.create({ trigger, start: start || 'top 85%', once: true, onEnter: fn });

/** Fade + rise a list of elements into place when `trigger` enters. */
export function riseIn(targets, trigger, opts = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: opts.y == null ? 28 : opts.y, x: opts.x || 0 });
  once(trigger, () => {
    gsap.to(els, {
      opacity: 1, y: 0, x: 0,
      duration: opts.duration || dur.reveal,
      ease: ease.out,
      stagger: opts.stagger == null ? stagger.base : opts.stagger,
      delay: opts.delay || 0,
      clearProps: 'transform,opacity',
    });
  }, opts.start);
}

/** Same idea for lists that wrap onto several rows / columns. `from`/`to` add extra props (e.g. rotationX). */
export function batchIn(targets, opts = {}) {
  const els = gsap.utils.toArray(targets);
  if (!els.length) return;
  gsap.set(els, { opacity: 0, y: opts.y == null ? 50 : opts.y, x: opts.x || 0, scale: opts.scale || 1, ...(opts.from || {}) });
  ScrollTrigger.batch(els, {
    start: opts.start || 'top 90%',
    once: true,
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1, y: 0, x: 0, scale: 1,
        duration: opts.duration || dur.cinematic * 0.85,
        ease: ease.out,
        stagger: opts.stagger == null ? stagger.base : opts.stagger,
        clearProps: 'transform,opacity',
        ...(opts.to || {}),
      });
      if (opts.onBatch) opts.onBatch(batch);
    },
  });
}

/** Smooth scroll to an element or a pixel offset (Lenis when active, native otherwise). */
export function scrollTo(target, opts = {}) {
  const off = opts.offset || 0;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: off,
      immediate: !!opts.immediate,
      duration: opts.duration || 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
    return;
  }
  const y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.pageYOffset + off;
  window.scrollTo({ top: y, behavior: opts.immediate || prefersReduced() ? 'auto' : 'smooth' });
}
