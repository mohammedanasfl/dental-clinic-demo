import { useState } from 'react';
import { Icon } from './Icon.jsx';
import { CONTACT, CONTACT_SUBJECTS, MAP_EMBED } from '../data/content.js';
import { openMail, handoffMessage } from '../utils/mailto.js';

const MAPS_LINK = 'https://www.google.com/maps/search/?api=1&query=123+Street+New+York+USA';

export function Contact() {
  const [status, setStatus] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); setStatus(''); return; }
    const d = Object.fromEntries(new FormData(form));
    setStatus(handoffMessage());
    openMail(`Website enquiry: ${d.subject}`, [`Name: ${String(d.name).trim()}`, `Email: ${String(d.email).trim()}`, `Subject: ${d.subject}`, '', String(d.message).trim()]);
  };

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="sec-head" data-head>
          <span className="eyebrow" data-a>Contact Us</span>
          <h2 className="h-xl" id="contact-title" data-split>Feel Free To Contact Us</h2>
          <p className="lead" data-a>Whether you require a smile assessment, immediate pain intervention, or general inquiries, our concierge is prepared to assist you.</p>
        </div>

        <div className="contact__grid">
          <div className="contact__info" data-contact-info>
            <div className="info"><div className="info__icon"><Icon name="map-pin" /></div><div><small>Visit us</small><h3>Our Office</h3><p>{CONTACT.address}</p></div></div>
            <div className="info"><div className="info__icon"><Icon name="mail" /></div><div><small>Write to us</small><h3>Email Us</h3><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div></div>
            <div className="info"><div className="info__icon"><Icon name="phone" /></div><div><small>Speak to us</small><h3>Call Us</h3><a className="tel" href={CONTACT.phoneHref}>{CONTACT.phone}</a></div></div>
            <div className="map" data-map>
              <iframe title="Map showing the DentCare clinic area in New York" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen src={MAP_EMBED} />
              <div className="map__bar">
                <span><Icon name="map-pin" />{CONTACT.address}</span>
                <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer">Open Directions →<span className="sr-only"> (opens in a new tab)</span></a>
              </div>
            </div>
          </div>

          <div className="contact__form" data-contact-form>
            <h3>Send Us A Direct Message</h3>
            <p className="sub">Our reception coordinates with the dentists directly to address your questions swiftly.</p>
            <form className="form form--lg" id="contact-form" noValidate onSubmit={submit}>
              <div className="form-row">
                <label className="field"><span>Your Full Name</span><input type="text" name="name" placeholder="Eleanor Vance" autoComplete="name" required /></label>
                <label className="field"><span>Email Address</span><input type="email" name="email" placeholder="eleanor@example.com" autoComplete="email" required /></label>
              </div>
              <label className="field"><span>Inquiry Type / Subject</span>
                <select name="subject">{CONTACT_SUBJECTS.map((o) => <option key={o}>{o}</option>)}</select></label>
              <label className="field"><span>Your Message</span><textarea name="message" rows="4" placeholder="Please describe your requirements, previous treatments, or questions here..." required /></label>
              <div className="form-foot">
                <button className="btn btn--dark btn--lg" type="submit" data-magnetic><span>Send Message</span><Icon name="send" /></button>
                <p className="form-status" role="status" aria-live="polite" style={{ textAlign: 'left' }}>{status}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
