import { useEffect } from 'react';
import { headerH, scrollTo } from '../motion/core.js';
import { savedScroll } from './useScrollRestoration.js';

function goTo(target, hash, immediate) {
  if (hash === '#hero') scrollTo(0, { immediate });
  else scrollTo(target, { offset: -(headerH() + 4), immediate });
  // keep keyboard / screen-reader context in step with the scroll
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Smooth in-page links with a header offset; placeholder "#" links stay inert; honours a #hash on load. */
export function useAnchors(onNavigate) {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const hash = a.getAttribute('href');
      if (hash === '#') { e.preventDefault(); return; }
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      e.preventDefault();
      onNavigate();
      goTo(target, hash);
      if (history.pushState) history.pushState(null, '', hash);
    };
    document.addEventListener('click', onClick);

    // Fresh load with a #hash: jump once the page has loaded, then once more shortly after, because fonts,
    // images and the pinned hero keep nudging the layout. Never fight the visitor if they've started scrolling.
    let moved = false, retry = null;
    const markMoved = () => { moved = true; };
    ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.addEventListener(t, markMoved, { passive: true, once: true }));
    const jump = () => {
      if (savedScroll() > 0 || moved || location.hash.length < 2) return; // returning visitors keep their place
      const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) goTo(t, location.hash, true);
    };
    const first = () => { jump(); retry = window.setTimeout(jump, 700); };
    if (document.readyState === 'complete') first(); else window.addEventListener('load', first, { once: true });
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('load', first);
      ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach((t) => window.removeEventListener(t, markMoved));
      window.clearTimeout(retry);
    };
  }, [onNavigate]);
}
