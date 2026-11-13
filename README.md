# DentCare — dental clinic site

A single-page, scroll-driven website for a dental clinic (Home, About, Services, Appointment, Dentists, Contact), built with **React 18 + Vite**, with motion by **GSAP + ScrollTrigger**, **Lenis** and **Framer Motion**. The design follows the Stitch project "DentCare Website Redesign" (design system: *Porcelain & Cobalt Sanctuary*).

**Live URL (GitHub Pages):** <https://mohammedanasfl.github.io/dental-clinic-demo/>

## Scripts

```bash
npm install
npm run dev       # dev server with hot reload  → http://localhost:5173/dental-clinic-demo/
npm run build     # production build → docs/
npm run preview   # serve the production build → http://localhost:4173/dental-clinic-demo/
npm run lint      # ESLint (react + react-hooks rules)
```

Requires Node 20+.

## Publish with GitHub Pages

GitHub Pages serves the **`docs/`** folder of this branch, and `docs/` is the **build output** — never edit it by hand.

1. `npm run build`
2. Commit the updated `docs/` together with your source changes and push.
3. In **Settings → Pages**, the source stays **Deploy from a branch → /docs**.

The site lives under `/dental-clinic-demo/`, which is set as Vite's `base`. For a custom domain or another path build with `BASE_PATH=/ npm run build`.

## Project structure

```
.
├── index.html               Vite entry (preloads, motion-class bootstrap)
├── vite.config.js           base path, build → docs/, vendor chunks
├── public/                  Copied as-is into docs/
│   ├── assets/fonts/        Outfit + Plus Jakarta Sans variable fonts (latin, preloaded)
│   ├── assets/img/          Optimised WebP images
│   ├── about|service|team|contact.html   Redirect stubs from the old multi-page site
│   └── .nojekyll
├── src/
│   ├── main.jsx · App.jsx   Entry and app shell (menu state, motion layer lifecycle)
│   ├── components/          One React component per section (Hero, About, Services, …)
│   ├── hooks/               Scroll flags, scroll-spy, anchors, scroll restoration
│   ├── motion/
│   │   ├── core.js          Durations/easings, split-text, reveal helpers, scrollTo
│   │   ├── hero.js          Intro + the pinned, scroll-scrubbed hero film
│   │   ├── sections.js      Per-section scroll choreography (gsap.matchMedia)
│   │   ├── ambient.js       Magnetic buttons, card tilt (fine pointers only)
│   │   └── lenis.js         Smooth wheel scrolling wired into ScrollTrigger
│   ├── data/                Content (services, team, nav, contact) and the SVG icon sprite
│   └── styles/main.css      Design tokens and all styles
└── docs/                    Build output (published)
```

### How the motion is split

- **React** owns markup and UI state: the mobile menu, forms, booking stepper, header/back-to-top state, hero slide counter.
- **GSAP + ScrollTrigger** owns everything scroll-driven. The motion layer is imperative by design: it is started in `useLayoutEffect`, scoped with `gsap.matchMedia()` / `gsap.context()`, and returns a cleanup that reverts every tween, trigger and pin (no duplicates in StrictMode or on resize).
- **Lenis** only smooths mouse-wheel scrolling; touch scrolling stays native.
- **Framer Motion** (`LazyMotion`) animates React UI: the mobile menu and the back-to-top button.
- **CSS** handles hover, focus and button micro-interactions (hover lifts use the `translate` property so they never fight GSAP's transforms).
- Text that the motion layer splits into words/letters (hero headline, footer wordmark) is wrapped in `memo` so React never re-renders it.
- With `prefers-reduced-motion: reduce` there is no Lenis, pinning, parallax or entrance animation: everything is simply visible.

### Hero film

On desktop (width ≥ 1024px, height ≥ 640px) the hero pins for about 1.6 screens and plays a scroll-scrubbed film: the image card expands to a full-bleed photo, two chapter captions land in big type over an outlined wordmark, a circular iris opens onto the second photo, and the booking CTA arrives before the About section slides over like a curtain. Elsewhere it does not pin.

## Known placeholders

- There is no backend. The booking and contact forms validate and then open the visitor's email app with the details pre-filled (a `mailto:` hand-off to `info@example.com`); they never show a fake success message. The newsletter form is inert until a service is connected.
- Names, address, phone number, email, opening hours and body text are placeholder content (all five dentists are still "Dr. John Doe, Implant Surgeon"). The social links are `#` placeholders and "Latest Blog" has no page yet.
- The map on the Contact section is an embedded Google Map pointing at New York.
- Only the Google Maps embed loads from a public CDN; fonts and scripts are self-hosted.
