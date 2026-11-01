# AGENTS.md

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build; also runs TypeScript checking (there is no separate `typecheck` script)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`); note `eslint` has a trailing user args pattern, invoke as `npm run lint` only

No tests exist in this repo; `npm run build` is the verification step.

## Next.js version warning

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Stack quirks

- Tailwind CSS v4 (CSS-first config, no `tailwind.config.ts`). All design tokens live in `src/app/globals.css` as CSS variables (`--cream`, `--forest`, `--ink`, `--line`, etc.) mapped to utilities via `@theme inline` — prefer these semantic tokens (`bg-cream`, `text-ink`, `text-forest`) over raw Tailwind colors.
- Dark mode is **class-based** (`@custom-variant dark`), not `media`. Toggle state is a `.dark` class on `<html>` plus `localStorage` key `booknook-theme`, applied before paint by an inline script in `src/app/layout.tsx` — keep that script and `suppressHydrationWarning` on `<html>` intact or dark mode will flash/hydration-mismatch.
- `src/app/layout.tsx` uses typed routes (`LayoutProps<"/">` is Next generated types) — route changes may require regenerating types via `next dev`/`next build`.
- Fonts are loaded with `next/font/google` (Inter + Fraunces) exposed as CSS variables; `--font-display` is Fraunces.
- package.json lists many pre-installed deps (shadcn ecosystem: `@base-ui/react`, `embla`, `recharts`, `cmdk`…) that are not yet used — do not assume existing usage. Swiper 14 IS used (`src/components/home/HeroSlider.tsx`) — its CSS must be imported in the client component (`swiper/css`, plus `swiper/css/navigation` / `pagination`).

## Structure

- `src/app/` — App Router: `/` (homepage: HeroSlider, HowBorrowingWorks, NewArrivals, TopCategories) and `/books` (All Books catalog). Dummy data in `src/data/books.ts` — no real DB yet; New Arrivals mimics `.sort({ createdAt: -1 }).limit(6)` with array sort + slice.
- `src/components/` — `Navbar.tsx` (logo + theme toggle only), `ThemeToggle.tsx`, `icons.tsx`, shared `BookCard.tsx`, plus `home/` sections.
- Images live in `public/Images/`; book covers come from `picsum.photos` (remote pattern configured in `next.config.ts`).
