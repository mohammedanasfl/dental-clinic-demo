/* Pointer-driven micro-interactions (fine pointers only, never for reduced motion). */
import { gsap } from './core.js';

const FINE = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)';

/** Magnetic buttons: GSAP owns transform, CSS owns hover lift via `translate`. */
export function initMagnetic() {
  const mm = gsap.matchMedia();
  mm.add(FINE, () => {
    const cleanups = [];
    document.querySelectorAll('[data-magnetic]').forEach((btn) => {
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      const move = (e) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const leave = () => { xTo(0); yTo(0); };
      btn.addEventListener('pointermove', move);
      btn.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        btn.removeEventListener('pointermove', move);
        btn.removeEventListener('pointerleave', leave);
        gsap.set(btn, { clearProps: 'x,y' });
      });
    });
    return () => cleanups.forEach((fn) => fn());
  });
  return () => mm.revert();
}

/** Service cards: 3D tilt + cursor spotlight. */
export function initTilt() {
  const mm = gsap.matchMedia();
  mm.add(FINE, () => {
    const cleanups = [];
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });
      const move = (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - 0.5) * 12); rx(-(py - 0.5) * 12);
        card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
      };
      const leave = () => { rx(0); ry(0); };
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
        gsap.set(card, { clearProps: 'rotationX,rotationY' });
      });
    });
    return () => cleanups.forEach((fn) => fn());
  });
  return () => mm.revert();
}
