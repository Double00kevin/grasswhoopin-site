# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Grasswhoopin'** — A lawn care service marketing site for Ardmore, TN. Southern drill-sergeant theme: aggressive, loud, comedic. Built with Astro 5 + Tailwind CSS v4.

## Commands

```sh
npm run dev       # Dev server at localhost:4321
npm run build     # Build to ./dist/
npm run preview   # Preview production build locally
npx astro check  # TypeScript/Astro type checking
```

## Architecture

- **Astro 5** static site, no framework integrations (no React/Vue/Svelte)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin — configured in `astro.config.mjs`, NOT via `tailwind.config.*`
- Custom theme tokens defined in `src/styles/global.css` using `@theme {}` (Tailwind v4 syntax, not v3 config file)

### Custom Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `army` | `#1e3a2f` | Background (dark green) |
| `camo` | `#4b5320` | Borders, accents |
| `deere` | `#ffde00` | John Deere yellow — primary headings, CTAs |
| `screaming` | `#39ff14` | Neon green — highlights, service names |

These are available as Tailwind classes: `bg-army`, `text-deere`, `border-camo`, `text-screaming`, etc.

### File Layout

- `src/layouts/Layout.astro` — Base HTML shell; imports global.css, accepts `title` prop
- `src/pages/index.astro` — Homepage; hero section only (Services component exists but is not yet imported)
- `src/components/Services.astro` — Services grid ("Available Punishments") — written but not wired into index.astro yet
- `src/styles/global.css` — Tailwind import + `@theme` color definitions

### Tone/Brand Guidelines

All copy follows the Southern drill-sergeant bit: lawns are "whooped," services are "punishments," mowing is "submission." Maintain this voice for any new copy or components.
