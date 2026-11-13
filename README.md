# Dental Clinic Demo

A static, single-page website for a dental clinic (Home, About, Services, Appointment, Dentists, Contact), built with HTML, CSS and JavaScript, with scroll-driven motion powered by GSAP, ScrollTrigger and Lenis. The design follows the Stitch project "DentCare Website Redesign" (design system: *Porcelain & Cobalt Sanctuary*). There is no build step.

**Live URL (once GitHub Pages is enabled):** <https://mohammedanasfl.github.io/dental-clinic-demo/>

## Folder structure

```
.
├── LICENSE.txt        License terms for the original site template (kept outside docs/, so it is not published)
├── README.md
└── docs/              The published site (GitHub Pages serves this folder)
    ├── .nojekyll      Tells GitHub Pages to serve files as-is, without Jekyll processing
    ├── index.html     The whole site: one continuous page
    ├── about.html, service.html, team.html, contact.html
    │                  Redirect stubs that send old links to the matching section of index.html
    ├── assets/
    │   ├── css/main.css      Design tokens + all styles (hover/focus micro-interactions live here)
    │   ├── js/motion.js      Motion system: durations, easings, split-words, reveal helpers
    │   ├── js/hero.js        Hero intro + pinned, scroll-driven film (full-bleed stage, captions, iris)
    │   ├── js/sections.js    Per-section scroll choreography
    │   ├── js/app.js         Lenis, header, scroll-spy, mobile menu, forms, magnetic buttons
    │   ├── vendor/           GSAP 3.13, ScrollTrigger 3.13, Lenis 1.1.20 (self-hosted)
    │   ├── fonts/            Outfit + Plus Jakarta Sans variable fonts (latin subset, preloaded)
    │   └── img/              Optimised WebP images (the SVG icon sprite is inlined in index.html)
```

Fonts and scripts are self-hosted. Only the Google Maps embed loads from a public CDN.

### Motion notes

- On desktop (width 1024px or more, height 640px or more) the hero pins for about 1.6 screens and plays a scroll-scrubbed film: the image card expands to a full-bleed photo, two chapter captions land in big type over an outlined wordmark, a circular iris opens onto the second photo, and the booking CTA arrives before the About section slides over like a curtain. Everywhere else it does not pin.
- Other motion: the About lead paragraph reads itself in word by word, service cards flip up in 3D (with cursor tilt and spotlight), a scroll-velocity marquee of the four services sits above the booking section, the five dentist cards fan out from a stack (1280px and wider), icons draw themselves in, the phone number rolls in, the footer wordmark rises letter by letter, and a progress bar tracks the page.
- Lenis only smooths mouse-wheel scrolling; touch scrolling stays native.
- With `prefers-reduced-motion: reduce` there is no Lenis, no pinning, no parallax and no entrance animation: every section is simply visible.
- Anything scroll-driven is created inside `gsap.matchMedia()`, so it is cleaned up and rebuilt on resize without duplicate ScrollTriggers.

## Run locally

From the repository root:

```bash
python3 -m http.server -d docs 8000
```

Then open <http://localhost:8000/>.

## Publish with GitHub Pages

1. Push this branch to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose this branch and the **/docs** folder, then click **Save**.
5. After the first deployment finishes (usually a minute or two), the site is available at the URL above.

## Known placeholders

- There is no backend. The booking form and the contact form validate and then open the visitor's email app with the details pre-filled (a `mailto:` hand-off to `info@example.com`); they never show a fake success message. The newsletter form is inert until a service is connected.
- Names, address, phone number, email, opening hours and body text are placeholder content (all five dentists are still "Dr. John Doe, Implant Surgeon"). The social links are `#` placeholders and "Latest Blog" has no page yet.
- The map on the Contact page is an embedded Google Map pointing at New York.
- The "Appointment" buttons now scroll to the booking section on the same page.
