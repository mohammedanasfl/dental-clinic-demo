import { Icon } from './Icon.jsx';
import { FEATURES } from '../data/content.js';
import { img } from '../utils/assets.js';

export function About() {
  return (
    <section className="section section--white about" id="about" aria-labelledby="about-title">
      <div className="wrap">
        <div className="split">
          <div className="about__visual">
            <div className="about__img" data-about-img>
              <img src={img('about-450.webp')} width="450" height="600" alt="Two smiling dental professionals standing side by side" loading="lazy" decoding="async" />
              <div className="about__note" data-about-note>
                <div>
                  <h4>Professional Staff</h4>
                  <p>Certified &amp; experienced dentists</p>
                </div>
                <Icon name="tooth" />
              </div>
            </div>
          </div>
          <div className="about__copy" data-about-copy>
            <span className="eyebrow" data-a>About DentCare Clinic</span>
            <h2 className="h-xl" id="about-title" data-split>The World’s Best Dental Clinic That You Can Trust</h2>
            <div className="about__text">
              <p className="strong" data-a>Diam dolor diam ipsum sit. Clita erat ipsum et lorem stet no lorem sit clita duo justo magna dolore. Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit.</p>
              <p data-a>Aliqu diam amet diam et eos labore. Clita erat ipsum et lorem et sit, sed stet no labore lorem sit. Sanctus clita duo justo et tempor eirmod magna dolore erat amet. We blend surgical rigor with empathetic patient hospitality.</p>
            </div>
            <div className="features" data-features>
              {FEATURES.map((f) => (
                <div className="feature" key={f.title}>
                  <div className="feature__icon"><Icon name={f.icon} /></div>
                  <div><h3>{f.title}</h3><p>{f.text}</p></div>
                </div>
              ))}
            </div>
            <div className="about__cta" data-a>
              <a className="btn btn--dark btn--md" href="#appointment" data-magnetic><span>Make Appointment</span><Icon name="calendar-days" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
