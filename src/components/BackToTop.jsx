import { AnimatePresence, m } from 'framer-motion';
import { Icon } from './Icon.jsx';
import { scrollTo } from '../motion/core.js';

export function BackToTop({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <m.button key="to-top" className="to-top" id="to-top" type="button" aria-label="Back to top"
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          exit={{ opacity: 0, y: 14, scale: 0.9, transition: { duration: 0.25 } }}
          onClick={() => scrollTo(0, { duration: 1.6 })}>
          <Icon name="arrow-up" />
        </m.button>
      )}
    </AnimatePresence>
  );
}
