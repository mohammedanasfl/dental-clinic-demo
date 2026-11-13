import { memo } from 'react';
import { Icon } from './Icon.jsx';
import { CONTACT, FOOTER_LINKS, SOCIALS } from '../data/content.js';

function LinkList({ title }) {
  return (
    <div className="footer__col">
      <h4>{title}</h4>
      <ul>
        {FOOTER_LINKS.map((l) => (
          <li key={l.label}><Icon name="chevron-right" /><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>
    </div>
  );
}

// The wordmark is split into letters by the motion layer, so keep React from ever re-rendering it.
const Wordmark = memo(function Wordmark() {
  return <div className="footer__mark" aria-hidden="true" data-footer-mark>DentCare</div>;
});

export function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="wrap">
        <div className="footer__grid" data-footer-grid>
          <div className="footer__col">
            <a className="brand" href="#hero" aria-label="DentCare — back to top">
              <span className="brand__mark"><Icon name="tooth" /></span>
              <span className="brand__name">Dent<b>Care</b></span>
            </a>
            <p className="footer__about">Pioneering advanced clinical mastery merged with serene, restorative dental hospitality. Absolute hygiene and gentle modern dentistry tailored to your confident smile.</p>
            <div className="socials">
              {SOCIALS.map((s) => <a href="#" key={s.icon} aria-label={`DentCare on ${s.label}`}><Icon name={s.icon} /></a>)}
            </div>
          </div>
          <LinkList title="Quick Links" />
          <LinkList title="Popular Links" />
          <div className="footer__col">
            <h4>Get In Touch</h4>
            <ul className="contact-list">
              <li><Icon name="map-pin" /><span>{CONTACT.address}</span></li>
              <li><Icon name="mail" /><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
              <li><Icon name="phone" /><a href={CONTACT.footerPhoneHref}>{CONTACT.footerPhone}</a></li>
            </ul>
            {/* No newsletter backend yet: the form stays inert (same as the original site). */}
            <form className="newsletter" id="newsletter" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-email">Newsletter</label>
              <div className="newsletter__box">
                <input id="newsletter-email" type="email" placeholder="Your Email" autoComplete="email" />
                <button type="button">Sign Up</button>
              </div>
            </form>
          </div>
        </div>
        <div className="footer__bottom" data-footer-bottom>
          <p>© DentCare. All Rights Reserved.</p>
          <p>Designed for premium dental excellence.</p>
        </div>
      </div>
      <Wordmark />
    </footer>
  );
}
