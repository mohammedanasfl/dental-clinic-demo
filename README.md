# Dental Clinic Demo

A static, multi-page website for a dental clinic (Home, About, Service, Dentist, Contact), built with HTML, CSS and a little JavaScript. There is no build step.

**Live URL (once GitHub Pages is enabled):** <https://mohammedanasfl.github.io/dental-clinic-demo/>

## Folder structure

```
.
├── LICENSE.txt        License terms for the site template (kept outside docs/, so it is not published)
├── README.md
└── docs/              The published site (GitHub Pages serves this folder)
    ├── .nojekyll      Tells GitHub Pages to serve files as-is, without Jekyll processing
    ├── index.html
    ├── about.html
    ├── service.html
    ├── team.html
    ├── contact.html
    ├── css/           Bootstrap and the site stylesheet
    ├── js/            Site script (main.js)
    ├── img/           Photos used by the pages
    └── lib/           Bundled front-end libraries (animate, easing, waypoints, wow)
```

Some pages also load Bootstrap's JavaScript, jQuery, Font Awesome, Bootstrap Icons and Google Fonts from public CDNs, so the site needs internet access to look right.

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

- The contact form and the newsletter form have no backend, so submitting them does nothing.
- Names, address, phone number, email, opening hours and body text are placeholder content, and the footer reads "Your Site Name".
- The map on the Contact page is an embedded Google Map pointing at New York.
- The "Appointment" buttons link to `appointment.html`, which does not exist yet, and every page references `img/favicon.ico`, which is also missing.
