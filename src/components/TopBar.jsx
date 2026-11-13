import { Icon } from './Icon.jsx';
import { CONTACT } from '../data/content.js';

export function TopBar() {
  return (
    <div className="topbar">
      <div className="wrap">
        <span className="i"><Icon name="clock" /><span>{CONTACT.hours}</span></span>
        <div className="right">
          <a href={`mailto:${CONTACT.email}`}><Icon name="mail" /><span>{CONTACT.email}</span></a>
          <span className="sep" aria-hidden="true">|</span>
          <a href={CONTACT.phoneHref}><Icon name="phone" /><span>{CONTACT.phone}</span></a>
        </div>
      </div>
    </div>
  );
}
