# Beyond The Horizon

A narrative campaign proposal site for United Airlines marketing, by **@legefilms**.
React 18 + Vite + Tailwind CSS 3.4 + Framer Motion + lucide-react.

---

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Drop in your media

Put these five files in `public/assets/` — exact, lowercase filenames:

| File | Content |
| --- | --- |
| `creator-profile.jpg` | Creator portrait (4:3 reads best) |
| `destination-ewr.jpg` | Newark hub |
| `destination-bri.jpg` | Chapter 01 — Bari, Italy |
| `destination-rak.jpg` | Chapter 02 — Marrakech, Morocco |
| `destination-akl.jpg` | Chapter 03 — Auckland, New Zealand |

> Filenames are **case-sensitive** once deployed. A file that loads locally on
> macOS as `Destination-EWR.jpg` will 404 on Cloudflare Pages.

## Deploy to Cloudflare Pages

Push to GitHub, then in the Cloudflare dashboard: **Workers & Pages → Create →
Pages → Connect to Git**, pick the repo, and use:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 18 or higher |

Every push to your default branch redeploys. Pull requests get preview URLs.

### Why `assetsDir: "static"`

Vite's default output directory for hashed bundles is also called `assets`,
which would mix its JS/CSS into the same folder as your photos.
`vite.config.js` moves the bundles to `dist/static/` so `dist/assets/` stays
exclusively your media — which is what the `./assets/...` paths in the
component point at. Don't change it without updating those paths.

---

## Before you send this to anyone at United

- [x] **Analytics are creator-supplied** (Sept 2026): 110K+ followers, 250M+
      views, 17.4% engagement, US-primary, 44% aged 24–35, 52/48 M/F. Be ready
      to produce the platform exports behind them — a marketing team will ask.
- [x] **Contact email** is `geri@legefilms.com`, set once as `CONTACT_EMAIL`.
- [ ] Consider adding **travel-intent data** if you have it. The earlier draft
      carried invented household-income and international-travel figures; they
      were removed rather than shipped as fact. They are the single most
      persuasive stat for an airline, so real numbers are worth sourcing.
- [ ] Confirm you hold the rights to every image you drop in `public/assets/`.
- [ ] Decide on indexing. `index.html` ships with
      `<meta name="robots" content="noindex, nofollow">` so the proposal stays
      out of search results. Remove that line if you want it public.

## Editing the content

Everything is data-driven from arrays at the top of `src/BeyondTheHorizon.jsx`:

| Array | Drives |
| --- | --- |
| `NODES` | Map hubs — code, city, coordinates, narrative theme, image path |
| `ACTS` | The three-act narrative section |
| `DELIVERABLES` | The campaign package grid |
| `METRICS` / `AUDIENCE_BARS` | Creator analytics |
| `CRAFT` | Production-standards bullets in the creator bio |

### Adding or moving a map hub

`NODES` positions are a real equirectangular projection onto the 1000×500
SVG viewBox, so new cities land in geographically correct spots:

```js
x = ((longitude + 180) / 360) * 1000
y = ((90 - latitude) / 180) * 500
```

Routes are drawn automatically between consecutive entries in array order.

## Known notes

- **Tailwind is pinned to 3.x on purpose.** Tailwind 4 renames
  `bg-gradient-to-*` to `bg-linear-to-*`; the component uses the 3.x names in
  six places. If you upgrade, run `npx @tailwindcss/upgrade` rather than
  bumping the version by hand.
- **Reduced motion is partial.** `src/index.css` suppresses the CSS-driven
  animation for `prefers-reduced-motion` users, but the Framer Motion loops
  (the travelling route lights, the pulsing map nodes) keep running. To cover
  those too, import `useReducedMotion` from `framer-motion` and gate the
  `repeat: Infinity` transitions on it.

