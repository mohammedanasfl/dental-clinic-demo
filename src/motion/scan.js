/* Precision section — a scroll-scrubbed frame sequence.
 *
 * The scanner "film" is exported as WebP frames (public/assets/scan/d = 100 frames at 1600px,
 * /m = 50 frames at 800px for phones) and painted onto a canvas. While the section is pinned the
 * scrollbar drives the frame index (forwards and backwards), then the part markers and legend
 * land. Frames load only when the section is near; the first frame is a plain <img> poster.
 * Reduced motion: no pin, no canvas — the poster simply shows the final exploded frame.
 */
import { gsap, ScrollTrigger, headerH } from './core.js';

export function initScan() {
  const sec = document.querySelector('[data-scan]');
  if (!sec) return () => {};
  const poster = sec.querySelector('[data-scan-poster]');
  const canvas = sec.querySelector('canvas');
  const markers = Array.from(sec.querySelectorAll('[data-scan-marker]'));
  const legend = Array.from(sec.querySelectorAll('[data-scan-legend] li'));
  const base = poster.dataset.base;
  const url = (set, i) => `${base}/${set}/${String(i).padStart(3, '0')}.webp`;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    poster.src = url('d', 100); // static exploded view; markers + legend stay visible (default CSS)
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const small = window.matchMedia('(max-width: 640px)').matches;
    const set = small ? 'm' : 'd', N = small ? 50 : 100;
    const frames = new Array(N);
    const g = canvas.getContext('2d');
    let started = false, cur = -1;
    const proxy = { f: 0 };

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; cur = -1; }
    };
    const ready = (im) => im && im.complete && im.naturalWidth > 0;
    const draw = (i) => {
      let k = i; // fall back to the nearest earlier frame that has arrived
      while (k > 0 && !ready(frames[k])) k -= 1;
      if (!ready(frames[k])) return;
      size();
      g.drawImage(frames[k], 0, 0, canvas.width, canvas.height);
      cur = i;
    };
    const load = () => {
      if (started) return;
      started = true;
      for (let i = 0; i < N; i += 1) {
        const im = new Image();
        im.decoding = 'async';
        im.onload = () => { if (i === Math.round(proxy.f) || i === 0 || (i === N - 1 && Math.round(proxy.f) === N - 1)) draw(Math.round(proxy.f)); };
        im.src = url(set, i + 1);
        frames[i] = im;
      }
    };

    // start fetching a couple of screens before the section arrives (also covers reload / #hash arrivals)
    ScrollTrigger.create({
      trigger: sec,
      start: 'top bottom+=1800',
      onEnter: load,
      onRefresh: (self) => { if (self.progress > 0) load(); },
    });

    // the film: frames first, then the markers and legend land on the exploded view
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: sec,
        start: () => 'top ' + headerH() + 'px',
        end: () => '+=' + Math.round(window.innerHeight * (small ? 1.1 : 1.5)),
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        onUpdate: load,
      },
    });
    tl.to(proxy, { f: N - 1, duration: 0.72, onUpdate: () => { const i = Math.round(proxy.f); if (i !== cur) draw(i); } }, 0)
      .fromTo(markers, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.1, stagger: 0.035, ease: 'back.out(2)' }, 0.7)
      .fromTo(legend, { opacity: 0.25, y: 8 }, { opacity: 1, y: 0, duration: 0.1, stagger: 0.035, ease: 'power2.out' }, 0.7);

    const redraw = () => { size(); draw(Math.round(proxy.f)); };
    ScrollTrigger.addEventListener('refresh', redraw);

    return () => {
      ScrollTrigger.removeEventListener('refresh', redraw);
      frames.forEach((im) => { if (im) im.onload = null; });
      g.clearRect(0, 0, canvas.width, canvas.height);
      markers.concat(legend).forEach((el) => { el.style.opacity = ''; el.style.transform = ''; });
    };
  });

  return () => mm.revert();
}
