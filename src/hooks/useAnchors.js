import { useEffect } from 'react';
import { goToSection } from '../utils/navigate.js';

/** Smooth in-page links with a header offset; placeholder "#" links stay inert. */
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
      goToSection(target, hash);
      if (history.pushState) history.pushState(null, '', hash);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [onNavigate]);
}
