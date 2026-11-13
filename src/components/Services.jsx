import { Fragment } from 'react';
import { Icon } from './Icon.jsx';
import { SERVICES } from '../data/content.js';
import { img } from '../utils/assets.js';

export function Services() {
  return (
    <section className="section services" id="services" aria-labelledby="services-title">
      <div className="wrap">
        <div className="sec-head sec-head--center" data-head>
          <span className="eyebrow" data-a>Our Services</span>
          <h2 className="h-xl" id="services-title" data-split>We Offer The Best Quality Dental Services</h2>
          <p className="lead" data-a>Comprehensive dental solutions backed by cutting-edge digital dental technology and artisanal care.</p>
        </div>

        <div className="cards" data-cards>
          {SERVICES.map((s, i) => (
            <article className="card" data-tilt key={s.title}>
              <span className="card__corner" />
              <div>
                <div className="card__top"><div className="card__icon"><Icon name={s.icon} /></div><span className="card__no">{String(i + 1).padStart(2, '0')}</span></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
              <a className="link-arrow" href="#appointment"><span>Explore Service<span className="sr-only">: {s.title}</span></span><Icon name="arrow-right" className="arrow" /></a>
            </article>
          ))}
        </div>

        <div className="banner" data-banner>
          <div className="banner__copy">
            <span className="eyebrow" data-a>Digital Consultation Workflow</span>
            <h3 className="h-xl" data-a>Preview Your Future Smile in Real Time</h3>
            <p className="body" data-a>Using our high-resolution intraoral 3D scanners, our prosthodontists simulate your complete smile transformation right on the digital display before any procedure begins.</p>
            <ul className="checks" data-a>
              <li><Icon name="circle-check" />Zero messy putty impressions</li>
              <li><Icon name="circle-check" />Simulated final outcome preview</li>
            </ul>
          </div>
          <div className="banner__img" data-banner-img>
            <img src={img('consult-720.webp')} srcSet={`${img('consult-480.webp')} 480w, ${img('consult-720.webp')} 720w, ${img('consult-960.webp')} 960w`} sizes="(min-width: 1024px) 480px, 100vw" width="960" height="524" alt="A dentist showing a patient a 3D scan of their teeth on a tablet during a consultation" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Service names on a scroll-velocity marquee (decorative; the motion layer drives it). */
export function Marquee() {
  const set = (
    <div className="marquee__set">
      {SERVICES.map((s, i) => (
        <Fragment key={s.title}>
          <span className={i % 2 ? 'o' : undefined}>{s.title}</span><i />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className="marquee" aria-hidden="true" data-marquee>
      <div className="marquee__track" data-marquee-track>{set}{set}</div>
    </div>
  );
}
