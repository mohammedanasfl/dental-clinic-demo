import { useEffect } from 'react';
import { getLenis } from '../motion/core.js';

const KEY = 'dentcare:scrollY';

/** The remembered scroll position — only when the visitor is returning (reload / back-forward), else 0. */
export function savedScroll() {
  const nav = performance.getEntriesByType('navigation')[0];
  if (!nav || (nav.type !== 'reload' && nav.type !== 'back_forward')) return 0;
  try { return parseFloat(sessionStorage.getItem(KEY) || '0') || 0; } catch { return 0; }
}

/**
 * The page is rendered by React after the browser has already tried to restore the scroll position,
 * and the hero pin adds height later still — so native restoration lands on a too-short document.
 * Take it over: remember where the visitor was, and put them back on reload / back-forward once the
 * layout (pin spacers included) exists. Fresh navigations and #hash links are left alone.
 */
export function useScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

    const save = () => {
      try { sessionStorage.setItem(KEY, String(window.pageYOffset)); } catch { /* storage unavailable */ }
    };
    window.addEventListener('pagehide', save);
    // pagehide is not guaranteed on every kind of reload, so also keep the value fresh while scrolling
    let debounce = null;
    const onScroll = () => { window.clearTimeout(debounce); debounce = window.setTimeout(save, 150); };
    window.addEventListener('scroll', onScroll, { passive: true });

    const y = savedScroll(); // read now, before our own scroll listener can overwrite it
    let timer = null;
    if (y > 0) {
      const restore = () => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true }); else window.scrollTo(0, y);
      };
      // after the load-time ScrollTrigger refresh has measured the pins
      const go = () => { timer = window.setTimeout(restore, 60); };
      if (document.readyState === 'complete') go(); else window.addEventListener('load', go, { once: true });
    }
    return () => {
      window.removeEventListener('pagehide', save);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(debounce);
      window.clearTimeout(timer);
    };
  }, []);
}
