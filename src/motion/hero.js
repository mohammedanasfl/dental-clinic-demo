/* Hero — cinematic intro + a pinned, scroll-driven film.
 *
 * Desktop (>=1024px wide, >=640px tall, motion allowed):
 *   The hero opens as a full-bleed photograph (the "stage") with the headline over it.
 *   While the hero is pinned (~1.6 screens of scrolling) the story plays out,
 *   scrubbed by the scrollbar:
 *     1. the copy lifts away (words slide out of their masks) while the
 *        photograph slowly pushes in;
 *     2. chapter one lands in big type, an outlined wordmark drifts across;
 *     3. a circular iris opens onto the second photograph, chapter two lands;
 *     4. the booking call-to-action arrives, then the pin releases and the
 *        About section slides over the hero like a curtain.
 *
 * Tablet / mobile: no pin. Intro, a light parallax drift, arrows swap slides.
 * Reduced motion: no intro, no stage, no pin; arrows swap slides instantly.
 *
 * React owns the markup and the slide counter (via `onIndex`); this module owns the motion.
 * Returns a cleanup function that reverts every tween, trigger, pin and listener.
 */
import { savedScroll } from '../utils/scrollMemory.js';
import { gsap, dur, ease, stagger, headerH, prefersReduced, scrollTo, splitWords } from './core.js';

const root = () => document.documentElement;
const STAGE_MQ = '(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const CARD_HIDDEN = 'inset(100% 0% 0% 0%)', CARD_SHOWN = 'inset(0% 0% 0% 0%)';
const STAGE_FROM = 'inset(7% 7% 7% 7% round 28px)', STAGE_TO = 'inset(0% 0% 0% 0% round 0px)';
const IRIS_HIDDEN = 'circle(0% at 50% 72%)', IRIS_SHOWN = 'circle(150% at 50% 72%)';

export function initHero({ onIndex }) {
  const q = (s) => document.querySelector(s);
  const qa = (s, r) => Array.from((r || document).querySelectorAll(s));

  const hero = q('#hero');
  if (!hero) return () => {};
  const html = root();

  const copy = q('[data-hero-copy]'), h1 = q('#hero-title');
  const media = q('[data-hero-media]');
  const slide1 = q('.hero__slide--1'), slide2 = q('#hero-slide2');
  const img1 = slide1.querySelector('img'), img2 = slide2.querySelector('img');
  const glassA = q('[data-hero-glass="a"]'), glassB = q('[data-hero-glass="b"]');
  const blobA = q('[data-hero-blob="a"]'), blobB = q('[data-hero-blob="b"]');
  const stage = q('[data-hero-stage]');
  const sSlide1 = q('.hero__sslide--1'), sSlide2 = q('[data-stage-slide2]');
  // sImg* are the media wrappers (photo + clip together), so scale / parallax apply to both
  const sImg1 = sSlide1.querySelector('.hero__smedia'), sImg2 = sSlide2.querySelector('.hero__smedia');
  const vid1 = q('[data-stage-video="1"]'), vid2 = q('[data-stage-video="2"]');
  const veil = q('.hero__veil'), marquee = q('[data-hero-marquee]'), marqueeText = marquee.firstElementChild;
  const spot = q('.hero__spot');
  const capsEl = q('.hero__caps');
  const cap1 = q('[data-cap="1"]'), cap2 = q('[data-cap="2"]');
  const ocac = q('.hero__ocac'), hud = q('[data-hero-hud]');
  const cue = q('.hero__cue');
  const fills = qa('[data-hero-fill]');
  const motionOn = html.classList.contains('motion');

  let idx = 0;
  let pinnedTrigger = null;
  let cancelled = false;
  let watchdog = null;
  let introTl = null;

  const setIdx = (i) => {
    if (i === idx) return;
    idx = i;
    onIndex(i);
  };

  const ctx = gsap.context(() => {
    /* ---------- headline words (shared by intro + scroll story) ---------- */
    const words = splitWords(h1);
    gsap.set(words, { yPercent: 112 });
    h1.style.visibility = 'visible';

    /* ---------- intro ----------
     * Text first: the headline starts rising right away (fonts are self-hosted + preloaded),
     * everything is on screen in ~1.5s, and a watchdog snaps it to the end state on slow
     * devices so the hero can never sit half-drawn. */
    const playIntro = (instant) => {
      if (cancelled) return;
      // NB: not html.classList — on the instant (hash / restore) path this runs before the matchMedia block below adds it
      const staged = window.matchMedia(STAGE_MQ).matches;
      const header = q('#site-header');
      const tl = gsap.timeline({ defaults: { ease: ease.out } });
      introTl = tl;
      tl.fromTo([q('.topbar'), header], { opacity: 0, y: -12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, clearProps: 'transform' }, 0)
        .fromTo([blobA, blobB], { opacity: 0 }, { opacity: 1, duration: 1.4, stagger: 0.15, ease: 'power2.out' }, 0)
        .fromTo(copy.querySelector('.pill'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.05)
        .to(words, { yPercent: 0, duration: 0.9, stagger: 0.06 }, 0.1)
        .fromTo(copy.querySelector('.hero__sub'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0.45)
        .set(copy.querySelector('.hero__cta'), { opacity: 1 }, 0)
        .fromTo(copy.querySelectorAll('.hero__cta > *'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: stagger.base, clearProps: 'transform' }, 0.6)
        .fromTo(copy.querySelector('.hero__meta'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.75)
        .fromTo([glassA, glassB], { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, stagger: stagger.loose }, 0.7);

      if (staged) {
        // the full-bleed photograph opens from a rounded inset to the full viewport while it settles from a slight zoom
        tl.set([stage, media], { opacity: 1 }, 0)
          .fromTo(stage, { clipPath: STAGE_FROM }, { clipPath: STAGE_TO, duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' }, 0)
          .fromTo(sSlide1, { scale: 1.2 }, { scale: 1, duration: 1.8, ease: 'power3.out' }, 0)
          .fromTo(cue, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.5);
      } else {
        tl.fromTo(media, { opacity: 1, clipPath: 'inset(10% 10% 10% 10% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 16px)', duration: 1.2, ease: 'power4.inOut', clearProps: 'clipPath' }, 0)
          .fromTo(slide1, { scale: 1.25 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0);
      }
      if (instant) { tl.progress(1); return; } // arrived scrolled (hash / restored position): no intro, just the rest state
      // watchdog: never leave the hero half-drawn on a slow device
      watchdog = window.setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 3200);
    };

    if (motionOn && (savedScroll() > 0 || window.location.hash.length > 1)) {
      playIntro(true);
    } else if (motionOn) {
      // Wait only briefly (max ~0.5s) for the font + hero image, then go.
      const heroImg = window.matchMedia(STAGE_MQ).matches ? sSlide1.querySelector('img') : img1;
      const imgReady = heroImg.decode ? heroImg.decode().catch(() => {}) : Promise.resolve();
      const fontsReady = document.fonts && document.fonts.load ? document.fonts.load('600 56px Outfit') : Promise.resolve();
      const timeout = new Promise((r) => setTimeout(r, 500));
      Promise.race([Promise.all([imgReady, fontsReady]), timeout]).then(() => playIntro(false));
    } else {
      gsap.set(words, { yPercent: 0 });
    }
  }, hero);

  /* ---------- slide control (non-pinned + reduced motion) ---------- */
  function goTo(target, instant) {
    if (target === idx) return;
    const show = !!target;
    if (instant) {
      gsap.set(slide2, { clipPath: show ? CARD_SHOWN : CARD_HIDDEN });
      gsap.set(img2, { scale: 1 });
      gsap.set(fills, { scaleX: show ? 1 : 0.5 });
    } else {
      gsap.to(slide2, { clipPath: show ? CARD_SHOWN : CARD_HIDDEN, duration: 1, ease: 'power3.inOut', overwrite: true });
      gsap.fromTo(img2, { scale: show ? 1.2 : 1 }, { scale: 1, duration: 1.2, ease: 'power3.out', overwrite: true });
      gsap.to(fills, { scaleX: show ? 1 : 0.5, duration: 0.8, ease: 'power3.out' });
    }
    setIdx(target);
  }
  function step() {
    const target = idx ? 0 : 1;
    if (pinnedTrigger) {
      const st = pinnedTrigger, span = st.end - st.start;
      scrollTo(st.start + span * (target ? 0.9 : 0.42), { duration: 1.5 });
    } else {
      goTo(target, prefersReduced());
    }
  }
  const arrows = qa('[data-hero-prev], [data-hero-next]');
  arrows.forEach((b) => b.addEventListener('click', step));

  /* ---------- scroll behaviour ---------- */
  const words = splitWords(h1);
  const mm = gsap.matchMedia();

  // Desktop: the pinned film.
  mm.add(STAGE_MQ, () => {
    html.classList.add('hero-stage');
    idx = 0; onIndex(0);

    const w1 = splitWords(cap1), w2 = splitWords(cap2);
    gsap.set(w1.concat(w2), { yPercent: 112 });
    const rest = [copy.querySelector('.pill'), copy.querySelector('.hero__sub'), copy.querySelector('.hero__cta'), copy.querySelector('.hero__meta')];

    // headroom so the pointer parallax never exposes the photograph's edge
    gsap.set(sImg1, { scale: 1.06 });

    /* ---------- hero clips ----------
     * Two short generated clips play over their poster photographs. Each plays once and holds its last
     * frame (they are not loop-clean). Clip 1 plays while the hero is in view and replays on return to
     * the top; clip 2 starts when the iris opens. Never fetched on mobile / reduced motion / Save-Data. */
    const saveData = !!(navigator.connection && navigator.connection.saveData);
    const clips = saveData ? [] : [vid1, vid2].filter(Boolean);
    const clipCleanups = [];
    const loadClip = (v) => {
      if (v.getAttribute('src')) return;
      v.muted = true; v.defaultMuted = true;
      const onPlaying = () => v.classList.add('is-playing');
      v.addEventListener('playing', onPlaying);
      clipCleanups.push(() => v.removeEventListener('playing', onPlaying));
      v.src = v.dataset.src;
      v.load();
    };
    const tryPlay = (v) => { const r = v.play(); if (r && r.catch) r.catch(() => {}); };
    let heroVisible = true;
    if (clips.length) {
      const start = () => {
        if (cancelled) return;
        loadClip(vid1);
        if (heroVisible) tryPlay(vid1);
        // clip 2 only after clip 1 has had the bandwidth
        const t = window.setTimeout(() => { if (!cancelled) loadClip(vid2); }, 1500);
        clipCleanups.push(() => window.clearTimeout(t));
      };
      if (document.readyState === 'complete') start();
      else { window.addEventListener('load', start, { once: true }); clipCleanups.push(() => window.removeEventListener('load', start)); }
      // pause while the hero is off screen (battery), resume where it left off
      const io = new IntersectionObserver((entries) => {
        heroVisible = entries[entries.length - 1].isIntersecting;
        clips.forEach((v) => {
          if (!v.getAttribute('src')) return;
          if (!heroVisible) v.pause();
          else if (!v.ended && (v === vid1 || tl.progress() >= 0.5)) tryPlay(v);
        });
      });
      io.observe(hero);
      clipCleanups.push(() => io.disconnect());
    }
    const onFilm = (p) => {
      if (!clips.length) return;
      if (vid1 && vid1.getAttribute('src') && p < 0.02 && vid1.ended) { vid1.currentTime = 0; tryPlay(vid1); }
      if (vid2 && vid2.getAttribute('src')) {
        if (p >= 0.5 && vid2.paused && !vid2.ended && heroVisible) tryPlay(vid2);
        else if (p < 0.4 && (vid2.currentTime > 0 || vid2.ended)) { vid2.pause(); vid2.currentTime = 0; } // ready for the next iris
      }
    };

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: () => 'top ' + headerH() + 'px',
        end: () => '+=' + Math.round(window.innerHeight * 1.6),
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        // NB: no invalidateOnRefresh — it would re-read the *current* DOM (mid-intro / scrolled) as the
        // timeline's start values; every tween below states its start values explicitly instead.
        onUpdate: (self) => {
          setIdx(self.progress >= 0.6 ? 1 : 0);
          onFilm(self.progress);
          // once the copy has faded out, take it out of the tab order too
          copy.style.visibility = self.progress > 0.2 ? 'hidden' : '';
          capsEl.style.visibility = self.progress > 0.22 ? 'visible' : '';
        },
      },
    });
    pinnedTrigger = tl.scrollTrigger;

    // Explicit start values (immediateRender:false): the intro owns the first ~2s, so the scroll
    // timeline must never record the pre-intro "hidden" state as its own starting point.
    const NR = { immediateRender: false };
    tl.fromTo(cue, { opacity: 1 }, { opacity: 0, duration: 0.04, ...NR }, 0)
      .fromTo(words, { yPercent: 0 }, { yPercent: -115, duration: 0.14, stagger: 0.012, ease: 'power2.in', ...NR }, 0)
      .fromTo(rest, { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.12, stagger: 0.02, ...NR }, 0)
      .fromTo(glassA, { x: 0, y: 0, opacity: 1 }, { x: -140, y: 80, opacity: 0, duration: 0.2, ...NR }, 0)
      .fromTo(glassB, { x: 0, y: 0, opacity: 1 }, { x: 140, y: -60, opacity: 0, duration: 0.2, ...NR }, 0)
      .fromTo([blobA, blobB], { opacity: 1 }, { opacity: 0, duration: 0.15, ...NR }, 0)
      .fromTo(sImg1, { scale: 1.06 }, { scale: 1.2, duration: 1, ...NR }, 0)
      .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.2, ...NR }, 0.04) // deepens behind the big captions
      .to(spot, { opacity: 1, duration: 0.2 }, 0.2)
      // 2. chapter one + outlined wordmark + HUD
      .to(w1, { yPercent: 0, duration: 0.16, stagger: 0.025, ease: 'power3.out' }, 0.2)
      .to(marquee, { opacity: 1, duration: 0.15 }, 0.22)
      .fromTo(marqueeText, { xPercent: 4 }, { xPercent: -30, duration: 0.8 }, 0.2)
      .fromTo(hud, { y: 20 }, { y: 0, autoAlpha: 1, duration: 0.1 }, 0.28)
      // 3. iris to the second photograph, chapter two
      .to(w1, { yPercent: -115, duration: 0.12, stagger: 0.015, ease: 'power2.in' }, 0.52)
      .fromTo(sSlide2, { clipPath: IRIS_HIDDEN }, { clipPath: IRIS_SHOWN, ease: 'power2.inOut', duration: 0.26, immediateRender: false }, 0.52)
      .fromTo(sImg2, { scale: 1.3 }, { scale: 1.08, duration: 0.48 }, 0.52)
      .to(fills, { scaleX: 1, duration: 0.26 }, 0.52)
      .to(w2, { yPercent: 0, duration: 0.16, stagger: 0.025, ease: 'power3.out' }, 0.68)
      // 4. call to action
      .fromTo(ocac, { y: 24 }, { y: 0, autoAlpha: 1, duration: 0.12 }, 0.82);

    // pointer: parallax on the glass cards + photograph at rest, plus a cyan spotlight that follows the cursor
    const hover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let mx = 0, my = 0, cx = 0, cy = 0, px = 0.5, py = 0.5;
    const onMove = (e) => {
      const r = hero.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width; py = (e.clientY - r.top) / r.height;
      mx = px - 0.5; my = py - 0.5;
    };
    const drift = () => {
      const k = Math.max(0, 1 - (tl.scrollTrigger ? tl.scrollTrigger.progress : 0) * 6); // eases out as the film starts
      cx += (mx * k - cx) * 0.08; cy += (my * k - cy) * 0.08;
      glassA.style.translate = (-cx * 28).toFixed(1) + 'px ' + (-cy * 18).toFixed(1) + 'px';
      glassB.style.translate = (cx * 36).toFixed(1) + 'px ' + (cy * 22).toFixed(1) + 'px';
      sImg1.style.translate = (-cx * 14).toFixed(1) + 'px ' + (-cy * 10).toFixed(1) + 'px';
      stage.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
      stage.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
    };
    if (hover) { hero.addEventListener('pointermove', onMove); gsap.ticker.add(drift); }

    return () => {
      clipCleanups.forEach((fn) => fn());
      clips.forEach((v) => { v.pause(); });
      hero.removeEventListener('pointermove', onMove); gsap.ticker.remove(drift);
      [glassA, glassB, sImg1].forEach((el) => { el.style.translate = ''; });
      html.classList.remove('hero-stage');
      copy.style.visibility = ''; capsEl.style.visibility = '';
      pinnedTrigger = null;
      idx = 0; onIndex(0);
    };
  });

  // Tablet / mobile / short windows: no pin, just a gentle drift.
  mm.add('(max-width: 1023px), (max-height: 639px)', () => {
    if (prefersReduced()) return;
    gsap.to(media, { yPercent: -4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(img1, { scale: 1.1, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  });

  return () => {
    cancelled = true;
    window.clearTimeout(watchdog);
    if (introTl) introTl.kill();
    arrows.forEach((b) => b.removeEventListener('click', step));
    mm.revert();
    ctx.revert();
  };
}

export { dur };
