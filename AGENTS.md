# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio/landing site for Daniel Fagundes (pt-BR), built with Astro. Single-page site (`src/pages/index.astro`) — no routing, no content collections, no framework (React/Vue) integrations. Static output only, deployed as `dist/`.

## Commands

```
npm run dev       # dev server at localhost:4321
npm run build     # build to ./dist/
npm run preview   # preview production build
npm run astro ...     # e.g. astro check
```

When starting the dev server, use background mode:

```
astro dev --background
```

Manage it with `astro dev stop`, `astro dev status`, `astro dev logs`.

No test suite or linter is configured.

## Architecture

- **Content vs. markup split**: all page copy, links, and repeatable-item data (nav links, projects, services, tools, FAQ, contact channels) live in `src/data/home.ts` as typed arrays/objects. Components import from there rather than hardcoding text — edit copy in `home.ts`, not in `.astro` files.
- **Page composition**: `src/pages/index.astro` assembles one-per-section `.astro` components from `src/components/home/` (Navbar, Hero, Marquee, Projects, Services, Tools, Faq, ContactFooter, CustomCursor) inside `src/layouts/Layout.astro`.
- **Styling**: plain CSS, no Tailwind/framework. `src/styles/global.css` is the entrypoint and `@import`s the rest in cascade order: `fonts.css` → `tokens.css` (design tokens/custom properties) → `base.css` → `layout.css` → `components.css` → `animations.css`. Page-specific overrides go in `src/styles/pages/home.css`, imported directly by `index.astro`.
- **Client-side behavior**: `src/scripts/home/page.ts` exports `initHome()`, called from an inline `<script>` in `index.astro`. It wires up scroll-reveal animations (IntersectionObserver on `.fade-up`/`.fade-in`/`.perspective-load`/`.scale-in`/`.line-draw`), hero intro timing, nav auto-hide/current-section highlighting, marquee pause-when-offscreen, FAQ/services accordion, copy-to-clipboard (`[data-copy]`), and dismissible banner. `src/scripts/home/cursor.ts` handles the custom cursor and hero parallax (via GSAP), imported by `page.ts`. All of this is skipped in favor of instantly revealing content when `prefers-reduced-motion: reduce` is set.
- **Boot script**: `public/scripts/boot.js` is loaded `is:inline` in `<head>`, before first paint, to avoid flash of unstyled/un-animated content — don't move it or make it a module.
- **`docs/`** holds a static original-HTML snapshot for reference (see git history), not part of the build.
