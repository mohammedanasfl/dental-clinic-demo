export const SCROLL_KEY = 'dentcare:scrollY';

/** The remembered scroll position — only when the visitor is returning (reload / back-forward), else 0. */
export function savedScroll() {
  const nav = performance.getEntriesByType('navigation')[0];
  if (!nav || (nav.type !== 'reload' && nav.type !== 'back_forward')) return 0;
  try { return parseFloat(sessionStorage.getItem(SCROLL_KEY) || '0') || 0; } catch { return 0; }
}
