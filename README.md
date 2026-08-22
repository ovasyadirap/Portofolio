# Alexander Reed — Senior Systems Analyst Portfolio

A professional, interactive single-page portfolio website built with plain HTML, CSS and JavaScript
(no build step, no dependencies, no backend required).

## Features

- **Hero section** with animated typewriter role titles and live-counted stats
- **About** section with bio, highlights and a quick-facts card
- **Skills** grid with animated proficiency bars
- **Experience timeline**
- **Work gallery** with category filters (Enterprise Architecture, Data & BI, Cloud Infrastructure,
  Process Automation, Security & Compliance) and a details modal per project
- **Testimonials**
- **Contact form** with client-side validation that hands off to the visitor's email client
  (`mailto:`) — swap in a real backend (Formspree, EmailJS, your own API) to submit silently instead
- **CV / Resume download button** (`assets/cv/Alexander-Reed-CV.pdf`) — replace with your real CV
- Light / dark theme toggle (persisted via `localStorage`)
- Responsive layout, scroll-reveal animations, active-section nav highlighting, back-to-top button

## Structure

```
index.html          Markup for every section
css/style.css        Design system (CSS variables), layout, responsive rules, animations
js/script.js          Theme toggle, nav, reveal/scroll effects, gallery data + filters/modal, form
assets/cv/            Placeholder downloadable CV (PDF)
```

## Customizing

1. **Content** — edit the text directly in `index.html` (name, bio, experience, contact info).
2. **Projects** — edit the `PROJECTS` array at the top of `js/script.js`. Each entry needs a
   `category` matching one of the filter buttons in `index.html` (`architecture`, `data`, `cloud`,
   `automation`, `security`), plus title, description, tags, and an `icon` key from the `ICONS` map.
3. **CV** — replace `assets/cv/Alexander-Reed-CV.pdf` with your real resume (same filename, or update
   the `href`/`download` links in `index.html`).
4. **Colors / theme** — adjust the CSS custom properties at the top of `css/style.css`
   (`:root` for light mode, `[data-theme="dark"]` for dark mode).
5. **Contact form backend** — the form currently opens a pre-filled `mailto:` link. To submit
   silently, point the `fetch`/form action at a service like Formspree, Getform, or your own API
   inside the submit handler in `js/script.js`.

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
