import { useEffect, useState } from 'react';

/** Booleans derived from the scroll position (rAF-throttled, passive). State only changes when a flag flips. */
export function useScrollFlags() {
  const [flags, setFlags] = useState({ solid: false, showTop: false });
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.pageYOffset;
      const solid = y > 20, showTop = y > 700;
      setFlags((f) => (f.solid === solid && f.showTop === showTop ? f : { solid, showTop }));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return flags;
}
