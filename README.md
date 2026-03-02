# Grasswhoopin' Lawn Care

Marketing site for **Grasswhoopin' Lawn Care**, serving Ardmore, TN (Tennessee-Alabama border). Southern drill-sergeant brand: lawns are "whooped," services are "punishments," mowing is "submission." Aggressive, loud, comedic.

Built with **Astro 5** + **Tailwind CSS v4**. Static site, no JS framework integrations. Deployed via Cloudflare.

---

## Commands

Run from the project root:

| Command             | Action                                      |
| :------------------ | :------------------------------------------ |
| `npm run dev`       | Dev server at `localhost:4321`              |
| `npm run build`     | Build production site to `./dist/`          |
| `npm run preview`   | Preview production build locally            |
| `npx astro check`   | TypeScript/Astro type checking              |

---

## Project Structure

```
/
├── public/
│   ├── favicon.svg
│   ├── favicon.ico
│   ├── favicon-96x96.png
│   ├── apple-touch-icon.png
│   ├── web-app-manifest-192x192.png
│   ├── web-app-manifest-512x512.png
│   ├── site.webmanifest
│   └── mascot.png
├── src/
│   ├── components/
│   │   ├── Hero.astro           — full-viewport hero (wired in)
│   │   ├── Services.astro       — services grid (written, not imported)
│   │   ├── Testimonials.astro   — testimonials grid (written, not imported)
│   │   ├── About.astro          — location section (written, not imported)
│   │   ├── Contact.astro        — contact CTA (written, not imported)
│   │   └── Footer.astro         — footer (written, not imported)
│   ├── layouts/
│   │   └── Layout.astro         — base HTML shell; SEO, OG, JSON-LD, favicon refs
│   ├── pages/
│   │   └── index.astro          — homepage (all sections currently inline here)
│   └── styles/
│       └── global.css           — Tailwind v4 import + @theme color tokens
├── astro.config.mjs
└── package.json
```

---

## Design System

### Color Tokens

Defined in `src/styles/global.css` via `@theme {}` (Tailwind v4 syntax — no `tailwind.config.*` file).

| Token       | Hex       | Usage                              |
| :---------- | :-------- | :--------------------------------- |
| `army`      | `#0F2C23` | Deep dark green — main background  |
| `olive`     | `#1E3F2F` | Section backgrounds                |
| `camo`      | `#4b5320` | Borders, accents                   |
| `deere`     | `#FACC15` | John Deere yellow — headings, CTAs |
| `screaming` | `#4ADE80` | Neon green — highlights, names     |
| `rust`      | `#F97316` | Orange — accents                   |
| `dirt`      | `#78350f` | Brown — card backgrounds           |

Available as Tailwind utilities: `bg-army`, `text-deere`, `border-camo`, `text-screaming`, etc.

### Fonts

- **Barlow** (400) — body text
- **Barlow Condensed** (400, 700, 800, 900) — headings, hero text
- Loaded via Google Fonts with `preconnect` in `Hero.astro`

---

## Current Homepage Sections

All sections are currently implemented inline in `src/pages/index.astro`:

1. **Hero** — Full-viewport animated stacked text (`DOES YOUR YARD NEED A GRASSWHOOPIN'?`), mascot PNG, SMS CTA button
2. **What We Do** — 4 services: Weekly Mowing, Edging & Trimming, Weed Control, Full Yard Overhaul
3. **Neighbors Say** — 4 inline testimonials
4. **Where We're Located** — Service area description (Ardmore, TN/AL border)
5. **Contact** — Phone/SMS link with glow effect
6. **Footer** — Copyright

---

## Brand Voice

All copy follows the Southern drill-sergeant bit. Maintain this voice for any new copy or components: lawns are "whooped," services are "punishments," customers are "recruits." Keep it loud, Southern, and absurd.
