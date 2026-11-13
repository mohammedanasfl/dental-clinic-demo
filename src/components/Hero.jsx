import { memo, useLayoutEffect, useState } from 'react';
import { Icon } from './Icon.jsx';
import { initHero } from '../motion/hero.js';
import { img } from '../utils/assets.js';

/** The counter + arrows appear twice: in the copy (at rest) and in the HUD (full-bleed film). */
function Counter({ idx, hud }) {
  return (
    <div className="counter" role="status" aria-label={`Slide ${idx + 1} of 2`} data-hero-counter {...(hud ? {} : { id: 'hero-counter' })}>
      <b data-hero-no {...(hud ? {} : { id: 'hero-no' })}>{idx ? '02' : '01'}</b>
      <span className="counter__bar"><span className="counter__fill" data-hero-fill {...(hud ? {} : { id: 'hero-fill' })} /></span>
      <span>02</span>
    </div>
  );
}

function Arrows({ hud }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <button className="round-btn" type="button" data-hero-prev aria-label="Previous slide" {...(hud ? {} : { id: 'hero-prev' })}><Icon name="arrow-left" /></button>
      <button className="round-btn" type="button" data-hero-next aria-label="Next slide" {...(hud ? {} : { id: 'hero-next' })}><Icon name="arrow-right" /></button>
    </div>
  );
}

// The headline is split into words by the motion layer, so it must never be re-rendered by React.
const Headline = memo(function Headline() {
  return (
    <h1 className="display" id="hero-title" data-split>
      Take The Best Quality <br className="br-sm" /><span className="grad">Dental Treatment</span>
    </h1>
  );
});
const Captions = memo(function Captions() {
  return (
    <div className="hero__caps" aria-hidden="true">
      <div className="wrap">
        <p className="hero__cap hero__cap--1" data-cap="1">Keep Your Teeth Healthy</p>
        <p className="hero__cap hero__cap--2" data-cap="2">The Best Quality Dental Treatment</p>
      </div>
    </div>
  );
});

export function Hero() {
  const [idx, setIdx] = useState(0);

  // Created before any section trigger (pin spacing must be measured first); cleaned up on unmount.
  useLayoutEffect(() => initHero({ onIndex: setIdx }), []);

  return (
    <section className="hero" id="hero" aria-labelledby="hero-title">
      {/* Desktop story stage: a full-bleed copy of the slides that starts as the image "window" and expands on scroll */}
      <div className="hero__stage" data-hero-stage aria-hidden="true">
        <div className="hero__sslide hero__sslide--1"><div className="hero__sshift">
          <img src={img('stage-1-1672.webp')} srcSet={`${img('stage-1-960.webp')} 960w, ${img('stage-1-1672.webp')} 1672w, ${img('stage-1-2508.webp')} 2508w`} sizes="100vw" width="1672" height="941" alt="" decoding="async" />
        </div></div>
        <div className="hero__sslide hero__sslide--2" data-stage-slide2><div className="hero__sshift">
          <img src={img('stage-2-1672.webp')} srcSet={`${img('stage-2-960.webp')} 960w, ${img('stage-2-1672.webp')} 1672w, ${img('stage-2-2508.webp')} 2508w`} sizes="100vw" width="1672" height="941" alt="" loading="lazy" decoding="async" />
        </div></div>
        <div className="hero__veil" />
        <div className="hero__spot" />
      </div>
      <div className="hero__marquee" aria-hidden="true" data-hero-marquee><span>DentCare · Dental Excellence · DentCare · Dental Excellence · DentCare · Dental Excellence ·</span></div>
      <Captions />
      <div className="hero__ocac wrap">
        <a className="btn btn--white btn--lg" href="#appointment" data-magnetic><span>Book Appointment</span><Icon name="arrow-right" className="arrow" /></a>
      </div>
      <div className="hero__hud wrap" data-hero-hud>
        <Counter idx={idx} hud />
        <Arrows hud />
        <span className="hero__scroll">Keep scrolling</span>
      </div>
      <div className="hero__cue" aria-hidden="true"><span>Scroll</span><i /></div>
      <div className="hero__blob hero__blob--a" data-hero-blob="a" />
      <div className="hero__blob hero__blob--b" data-hero-blob="b" />

      <div className="wrap hero__main">
        <div className="hero__grid">
          <div className="hero__copy" data-hero-copy>
            <span className="pill"><span className="pill__dot" />Keep Your Teeth Healthy</span>
            <Headline />
            <p className="lead hero__sub">Experience painless dentistry with advanced 3D digital smile architecture, gentle care, and world-class specialists in an environment designed for peace of mind.</p>
            <div className="hero__cta">
              <a className="btn btn--dark btn--lg" href="#appointment" data-magnetic><span>Book Appointment</span><Icon name="arrow-right" className="arrow" /></a>
              <a className="btn btn--white" href="#contact"><span className="play"><Icon name="play" /></span><span>Contact Us</span></a>
            </div>
            <div className="hero__meta">
              <Counter idx={idx} />
              <Arrows />
              <span className="hero__tagline">Editorial Precision Clinic</span>
            </div>
          </div>

          <div className="hero__visual">
            <div className="hero__media" data-hero-media data-hero-window>
              <div className="hero__slide hero__slide--1">
                <img src={img('hero-1-753.webp')} srcSet={`${img('hero-1-480.webp')} 480w, ${img('hero-1-753.webp')} 753w, ${img('hero-1-1130.webp')} 1130w`} sizes="(min-width: 1024px) 480px, 448px" width="753" height="941" alt="A smiling dentist treating a relaxed patient in a bright, modern dental operatory" fetchpriority="high" decoding="async" />
              </div>
              <div className="hero__slide hero__slide--2" id="hero-slide2">
                <img src={img('hero-2-753.webp')} srcSet={`${img('hero-2-480.webp')} 480w, ${img('hero-2-753.webp')} 753w, ${img('hero-2-1130.webp')} 1130w`} sizes="(min-width: 1024px) 480px, 448px" width="753" height="941" alt="A dentist chatting with a patient during a friendly consultation" decoding="async" />
              </div>
            </div>
            <div className="glass glass--a" data-hero-glass="a">
              <div className="glass__row">
                <div className="glass__icon"><Icon name="badge-check" /></div>
                <div><span className="t" style={{ font: '700 1.125rem/1.4 var(--font-head)' }}>Professional Staff</span><small>Gentle, caring dental experts</small></div>
              </div>
            </div>
            <div className="glass glass--b" data-hero-glass="b">
              <div className="glass__row">
                <Icon name="clock" className="ic-lg" style={{ width: '1.5rem', height: '1.5rem', color: 'var(--cyan)' }} />
                <div><span className="t">Opening Hours</span><small>Mon - Tues · 6.00 am - 10.00 pm</small></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
