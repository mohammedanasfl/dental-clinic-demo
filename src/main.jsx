import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import App from './App.jsx';
import { gsap, ScrollTrigger, getLenis } from './motion/core.js';

// Test hook: `?debug` exposes the motion internals for the browser test-suite (never in normal use).
if (new URLSearchParams(window.location.search).has('debug')) {
  window.__dc = { gsap, ScrollTrigger, lenis: getLenis };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
