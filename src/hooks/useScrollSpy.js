import { useEffect, useState } from 'react';

/** The lowest section whose band crosses the middle of the viewport (works with the pinned hero). */
export function useScrollSpy(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const seen = {};
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { seen[e.target.id] = e.isIntersecting; });
      let current = null;
      ids.forEach((id) => { if (seen[id]) current = id; });
      setActive(current);
    }, { rootMargin: '-45% 0px -54% 0px' });
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ids]);
  return active;
}
