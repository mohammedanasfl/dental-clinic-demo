import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m } from 'framer-motion';
import { Icon } from './Icon.jsx';
import { NAV, CONTACT } from '../data/content.js';

const EASE_OUT = [0.16, 1, 0.3, 1];
const item = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.12 + i * 0.06, duration: 0.7, ease: EASE_OUT } }),
};

function Panel({ activeId, onClose }) {
  const ref = useRef(null);
  // Sit just under the sticky header, wherever it currently is (the top bar may still be visible).
  const [top] = useState(() => {
    const h = document.getElementById('site-header');
    return h ? Math.round(h.getBoundingClientRect().bottom) : 80;
  });

  useEffect(() => {
    const panel = ref.current;
    const opener = document.activeElement;
    panel?.querySelector('.mlink')?.focus({ preventScroll: true });

    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key !== 'Tab') return; // keep focus inside the open menu
      const f = [...panel.querySelectorAll('a[href], button'), document.getElementById('menu-toggle')]
        .filter((el) => el && el.offsetParent !== null);
      const i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      // give focus back to the opener, unless a link already moved it to its target section
      const a = document.activeElement;
      if ((!a || a === document.body || panel?.contains(a)) && opener && opener.focus) opener.focus({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <m.div ref={ref} className="mnav is-open" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation menu"
      style={{ paddingTop: top }}
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.6, ease: EASE_OUT } }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.4, ease: [0.55, 0.06, 0.68, 0.19] } }}>
      <nav aria-label="Mobile">
        {NAV.map((n, i) => (
          <m.a key={n.id} className={`mlink${activeId === n.id ? ' is-active' : ''}`} href={`#${n.id}`} data-nav={n.id}
            variants={item} initial="hidden" animate="show" custom={i}>
            {n.label} <Icon name="arrow-right" />
          </m.a>
        ))}
      </nav>
      <div className="mnav__foot">
        <m.a className="btn btn--dark btn--lg" href="#appointment" variants={item} initial="hidden" animate="show" custom={NAV.length}>
          Book Appointment <Icon name="arrow-right" className="arrow" />
        </m.a>
        <m.div className="mnav__meta" variants={item} initial="hidden" animate="show" custom={NAV.length + 1}>
          <a href={CONTACT.phoneHref}><Icon name="phone" />{CONTACT.phone}</a>
          <a href={`mailto:${CONTACT.email}`}><Icon name="mail" />{CONTACT.email}</a>
          <span>{CONTACT.hours}</span>
        </m.div>
      </div>
    </m.div>
  );
}

export function MobileMenu({ open, activeId, onClose }) {
  return <AnimatePresence>{open && <Panel key="panel" activeId={activeId} onClose={onClose} />}</AnimatePresence>;
}
