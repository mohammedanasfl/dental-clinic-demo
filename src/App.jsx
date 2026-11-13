import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { TopBar } from './components/TopBar.jsx';
import { Header } from './components/Header.jsx';
import { MobileMenu } from './components/MobileMenu.jsx';
import { Hero } from './components/Hero.jsx';
import { About } from './components/About.jsx';
import { Services, Marquee } from './components/Services.jsx';
import { Appointment } from './components/Appointment.jsx';
import { Dentists } from './components/Dentists.jsx';
import { Contact } from './components/Contact.jsx';
import { Footer } from './components/Footer.jsx';
import { BackToTop } from './components/BackToTop.jsx';
import { IconSprite } from './components/Icon.jsx';
import { SECTION_IDS } from './data/content.js';
import { useScrollFlags } from './hooks/useScrollFlags.js';
import { useScrollSpy } from './hooks/useScrollSpy.js';
import { useAnchors } from './hooks/useAnchors.js';
import { useScrollRestoration } from './hooks/useScrollRestoration.js';
import { ScrollTrigger, getLenis } from './motion/core.js';
import { startSmoothScroll } from './motion/lenis.js';
import { initSections } from './motion/sections.js';
import { initMagnetic, initTilt } from './motion/ambient.js';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { solid, showTop } = useScrollFlags();
  const activeId = useScrollSpy(SECTION_IDS);
  const closeMenu = useCallback(() => {
    // Un-pause scrolling right now: React closes the menu asynchronously, but an anchor click scrolls immediately.
    const lenis = getLenis();
    if (lenis) lenis.start();
    document.body.style.overflow = '';
    setMenuOpen(false);
  }, []);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);

  useAnchors(closeMenu);
  useScrollRestoration();

  // Scroll motion layer. Section effects run before this one (children first), so the hero's
  // pinned trigger is registered before any section trigger — pin spacing is measured in order.
  useLayoutEffect(() => {
    const stopScroll = startSmoothScroll();
    const stopSections = initSections();
    const stopMagnetic = initMagnetic();
    const stopTilt = initTilt();

    // layout can shift once fonts / images are in: recalc pinned distances
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);

    window.__dcReady = true; // tells index.html's safety net the motion layer booted
    return () => {
      window.removeEventListener('load', refresh);
      stopTilt(); stopMagnetic(); stopSections(); stopScroll();
    };
  }, []);

  // Mobile menu: lock page scroll while open, close automatically when the desktop nav appears.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const lenis = getLenis();
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', onChange);
    return () => {
      mq.removeEventListener('change', onChange);
      if (lenis) lenis.start(); else document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <LazyMotion features={domAnimation} strict>
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="progress" aria-hidden="true"><span /></div>
      <IconSprite />
      <TopBar />
      <Header solid={solid} menuOpen={menuOpen} activeId={activeId} onToggleMenu={toggleMenu} />
      <MobileMenu open={menuOpen} activeId={activeId} onClose={closeMenu} />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Marquee />
        <Appointment />
        <Dentists />
        <Contact />
      </main>
      <Footer />
      <BackToTop visible={showTop} />
    </LazyMotion>
  );
}
