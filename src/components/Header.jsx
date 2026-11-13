import { Icon } from './Icon.jsx';
import { NAV } from '../data/content.js';

export function Header({ solid, menuOpen, activeId, onToggleMenu }) {
  return (
    <header className={`site-header${solid ? ' is-solid' : ''}${menuOpen ? ' menu-open' : ''}`} id="site-header">
      <div className="wrap">
        <a className="brand" href="#hero" aria-label="DentCare — back to top">
          <span className="brand__mark"><Icon name="tooth" /></span>
          <span><span className="brand__name">Dent<b>Care</b></span><span className="brand__tag">Dental Excellence</span></span>
        </a>
        <nav className="nav" aria-label="Primary">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} data-nav={n.id}
              className={activeId === n.id ? 'is-active' : undefined}
              aria-current={activeId === n.id ? 'location' : undefined}>{n.label}</a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a className="btn btn--dark btn--sm header-cta" href="#appointment" data-magnetic>Book Appointment</a>
          <button className="menu-toggle" id="menu-toggle" type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={onToggleMenu}>
            <Icon name="menu" className="ic-open" />
            <Icon name="x" className="ic-close" />
          </button>
        </div>
      </div>
    </header>
  );
}
