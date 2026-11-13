import Lenis from 'lenis';
import { gsap, ScrollTrigger, setLenis, prefersReduced } from './core.js';

/** Smooth wheel scrolling wired into ScrollTrigger. Never runs for reduced motion; touch stays native. */
export function startSmoothScroll() {
  if (prefersReduced()) return () => {};
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
  setLenis(lenis);
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    setLenis(null);
  };
}
