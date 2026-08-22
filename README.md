# Ova Syadhira Pramondari — Portfolio

A professional, interactive single-page portfolio website built with plain HTML, CSS and JavaScript
(no build step, no dependencies, no backend required).

## Features

- **Hero section** with a portrait photo, animated typewriter role titles, and live-counted stats
- **About** section with bio, highlights and a quick-facts card
- **Skills** grid with animated proficiency bars (System Analysis, UI/UX Design, Web Programming,
  Database Management, Network & PC Maintenance, Interpersonal & Leadership)
- **Experience timeline** — internships, teaching assistant, and lab assistant roles
- **Work gallery** with category filters (System Analysis, UI/UX Design, IoT & Smart Systems,
  Machine Learning) and a details modal per project
- **Achievements** section (competition placements, mentoring, IT support milestones)
- **Contact form** with client-side validation that hands off to the visitor's email client
  (`mailto:`) — swap in a real backend (Formspree, EmailJS, your own API) to submit silently instead
- **CV / Resume download button** (`assets/cv/Ova-Syadhira-Pramondari-CV.pdf`)
- Light / dark theme toggle (persisted via `localStorage`)
- Responsive layout, scroll-reveal animations, active-section nav highlighting, back-to-top button

## Structure

```
index.html          Markup for every section
css/style.css        Design system (CSS variables), layout, responsive rules, animations
js/script.js          Theme toggle, nav, reveal/scroll effects, gallery data + filters/modal, form
assets/cv/            Downloadable CV (PDF)
assets/img/           Profile photo
```

## Customizing

1. **Content** — edit the text directly in `index.html` (bio, experience, contact info).
2. **Projects** — edit the `PROJECTS` array at the top of `js/script.js`. Each entry needs a
   `category` matching one of the filter buttons in `index.html` (`system-analysis`, `uiux`, `iot`,
   `ml`), plus title, description, tags, and an `icon` key from the `ICONS` map.
3. **CV / photo** — replace `assets/cv/Ova-Syadhira-Pramondari-CV.pdf` or `assets/img/ova-profile.jpg`
   with updated files (same filenames, or update the references in `index.html`).
4. **Colors / theme** — adjust the CSS custom properties at the top of `css/style.css`
   (`:root` for light mode, `[data-theme="dark"]` for dark mode).
5. **Contact form backend** — the form currently opens a pre-filled `mailto:` link. To submit
   silently, point the submit handler in `js/script.js` at a service like Formspree, Getform, or your
   own API.

## Running locally

No build tools needed — just open `index.html` in a browser, or serve the folder statically:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
