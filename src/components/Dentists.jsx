import { Icon } from './Icon.jsx';
import { DENTISTS, SOCIALS } from '../data/content.js';
import { img } from '../utils/assets.js';

export function Dentists() {
  return (
    <section className="section section--white dentists" id="dentists" aria-labelledby="team-title">
      <div className="wrap">
        <div className="sec-head sec-head--center" data-head>
          <span className="eyebrow" data-a>Our Dentist</span>
          <h2 className="h-xl" id="team-title" data-split>Meet Our Certified &amp; Experienced Dentist</h2>
          <p className="lead" data-a>Our multidisciplinary dental team is dedicated to clinical perfection, patient comfort, and lasting oral health.</p>
        </div>

        <div className="team" data-team>
          {DENTISTS.map((d) => (
            <article className="doc" key={d.id}>
              <div className="doc__img">
                <img src={img(d.photo)} width="360" height="450" alt={`Portrait of ${d.name}, ${d.role}`} loading="lazy" decoding="async" />
                <div className="social">
                  {SOCIALS.map((s) => (
                    <a href="#" key={s.icon} aria-label={`${d.name} on ${s.label}`}><Icon name={s.icon} /></a>
                  ))}
                </div>
              </div>
              <div className="doc__body"><div><h3>{d.name}</h3><p>{d.role}</p></div><a className="book" href="#appointment">Book Visit</a></div>
            </article>
          ))}
        </div>

        <div className="team-cta" data-a>
          <a className="btn btn--blue btn--md" href="#appointment" data-magnetic><Icon name="users" /><span>Book Consultation With A Doctor</span></a>
        </div>
      </div>
    </section>
  );
}
