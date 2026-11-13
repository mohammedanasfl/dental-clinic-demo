import { headerH, scrollTo } from '../motion/core.js';

/** Scroll to a section (header offset applied) and move keyboard / screen-reader focus with it. */
export function goToSection(target, hash, immediate) {
  if (hash === '#hero') scrollTo(0, { immediate });
  else scrollTo(target, { offset: -(headerH() + 4), immediate });
  target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Show the page again after an arrival on a #hash / restored position (see index.html). */
export const revealPage = () => document.documentElement.classList.remove('entering');
