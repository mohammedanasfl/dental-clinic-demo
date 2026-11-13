import { useEffect } from 'react';
import { getLenis, ScrollTrigger } from '../motion/core.js';
import { SCROLL_KEY, savedScroll } from '../utils/scrollMemory.js';
import { goToSection, revealPage } from '../utils/navigate.js';

/**
 * Where the visitor arrives, and remembering where they were.
 *
 * The page is rendered by React after the browser has already tried to restore the scroll position,
 * and the hero pin adds height later still — so native restoration lands on a too-short document.
 * We take it over:
 *   - remember the position (so a reload / back-forward returns to it),
 *   - on arrival place the visitor immediately (restored position, else the #hash section),
 *     re-place once fonts have settled and ScrollTrigger has measured the pins,
 *     and only then reveal the page (index.html hides it meanwhile) — no flash of the hero top.
 * Fresh visits with no hash are untouched. Never fights a visitor who has already started scrolling.
 */
export function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const save = () => {
      try { sessionStorage.setItem(SCROLL_KEY, String(window.pageYOffset)); } catch { /* storage unavailable */ }
    };
    window.addEventListener('pagehide', save);
    // pagehide is not guaranteed on every kind of reload, so also keep the value fresh while scrolling
    let debounce = null;
    const onScroll = () => { window.clearTimeout(debounce); debounce = window.setTimeout(save, 150); };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ---- arrival ----
    const y = savedScroll(); // read now, before our own scroll listener can overwrite it
    const hash = window.location.hash.length > 1 ? decodeURIComponent(window.location.hash.slice(1)) : '';
    const timers = [];
    let moved = false;
    const markMoved = () => { moved = true; };
    const moveEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'];

    if (y > 0 || hash) {
      moveEvents.forEach((t) => window.addEventListener(t, markMoved, { passive: true, once: true }));
      const place = () => {
        if (moved) return;
        if (y > 0) {
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
        } else {
          const t = document.getElementById(hash);
          if (t) goToSection(t, '#' + hash, true);
        }
      };
      place(); // right now: layout exists (images reserve their space), only fonts may still nudge it
      const settle = () => { ScrollTrigger.refresh(); place(); revealPage(); };
      const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      Promise.race([fontsReady, new Promise((r) => timers.push(window.setTimeout(r, 1200)))]).then(settle);
      // small silent corrections if late layout work shifts things
      const late = () => { place(); timers.push(window.setTimeout(place, 700)); };
      if (document.readyState === 'complete') late(); else window.addEventListener('load', late, { once: true });
    } else {
      revealPage();
    }

    return () => {
      window.removeEventListener('pagehide', save);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(debounce);
      timers.forEach((t) => window.clearTimeout(t));
      moveEvents.forEach((t) => window.removeEventListener(t, markMoved));
    };
  }, []);
}
