# DentCare — dental clinic site

A single-page, scroll-driven website for a dental clinic (Home, About, Services, Appointment, Dentists, Contact), built with **React 18 + Vite**, with motion by **GSAP + ScrollTrigger**, **Lenis** and **Framer Motion**. The design follows the Stitch project "DentCare Website Redesign" (design system: *Porcelain & Cobalt Sanctuary*).

**Live URL (Cloudflare):** <https://dental-clinic-demo.dentcare-demo.workers.dev/>

## Scripts

```bash
npm install
npm run dev       # dev server with hot reload  → http://localhost:5173/dental-clinic-demo/
npm run build     # production build → docs/ (GitHub Pages path)
npm run build:cloudflare   # production build for a root domain → dist/ (Cloudflare)
npm run preview   # serve the production build → http://localhost:4173/dental-clinic-demo/
npm run lint      # ESLint (react + react-hooks rules)
```

Requires Node 20+.

## Deploy on Cloudflare (live site)

The site is served by Cloudflare (Workers static assets), built from this repo on every push to `claude/quirky-allen-09nasi`.

| Cloudflare build setting | Value |
|---|---|
| Build command | `npm run build:cloudflare` (no trailing characters) |
| Deploy command | `npx wrangler deploy` |
| Project name | `dental-clinic-demo` (must match `name` in `wrangler.jsonc`) |

- `wrangler.jsonc` points the deploy at `dist/`, the output of `npm run build:cloudflare` (built with `BASE_PATH=/`, so assets load from the site root).
- Push to the branch → Cloudflare builds and deploys automatically. `dist/` is git-ignored.
- The URL is `<project>.<account-subdomain>.workers.dev`; the account subdomain is set in the Cloudflare dashboard.

### GitHub Pages (optional)

`docs/` is the output of `npm run build` (base `/dental-clinic-demo/`), kept so the site can also be served from GitHub Pages. Never edit it by hand. Rebuild and commit it only if you still publish that way; it is not used by the Cloudflare deploy.

## Project structure

```
.
├── index.html               Vite entry (preloads, motion-class bootstrap)
├── vite.config.js           base path, build output (docs/ or dist/), vendor chunks
├── wrangler.jsonc           Cloudflare static-assets deploy config (serves dist/)
├── public/                  Copied as-is into docs/
│   ├── assets/fonts/        Outfit + Plus Jakarta Sans variable fonts (latin, preloaded)
│   ├── assets/img/          Optimised WebP images
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
├── docs/                    Build output for GitHub Pages (optional)
└── dist/                    Build output for Cloudflare (git-ignored)
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
