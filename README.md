# CineWave — Netflix Clone 🎬

A Netflix-style streaming UI built with **pure vanilla JavaScript** — no frameworks, no build step, no API keys.

**Live demo:** https://muhammadawais047.github.io/netflix-clone/

## Features

- **Hero billboard** — full-bleed backdrop with gradient shading, match %, age rating, and Play / More Info buttons; randomly features one of three titles on load
- **Carousel rows** — Trending Now, New Releases, Only on CineWave, TV Shows, Action & Adventure, Sci-Fi & Fantasy, Comedies — with hover arrows and smooth scrolling
- **Cards** — hover zoom with title, match %, year, rating, and Play / Add / Like quick actions
- **Detail modal** — big backdrop, match %, genres, mood tags, description, and a "More Like This" grid of same-genre titles (click through endlessly)
- **Fake player** — fullscreen overlay with a slowly-filling red progress bar, because pretending is half the fun
- **My List** — add/remove from cards or the modal, persisted in `localStorage`, gets its own nav item and carousel row
- **Search** — expanding search box filters by title or genre live
- **Nav filters** — Home / TV Shows / Movies / My List views
- **Topnav** — transparent over the hero, turns solid on scroll

42 invented titles with descriptions, genres and ratings — every image is a seeded picsum placeholder.

## Tech

- One `index.html` + `styles.css` + `app.js` (~550 lines of JS, zero dependencies)
- All text rendering via `createElement` / `textContent`; `innerHTML` only for static icon SVGs (XSS-safe)
- `prefers-reduced-motion` respected, keyboard accessible, Esc closes overlays

## Run locally

```bash
python -m http.server 8080
# then open http://localhost:8080
```

(Any static server works — or just open `index.html` directly.)

---

No affiliation with Netflix — this is a portfolio UI study. Built by [Muhammad Awais](https://github.com/MuhammadAwais047) as portfolio project #16.
