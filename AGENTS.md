# AGENTS.md

## Commands

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build; also runs TypeScript checking (there is no separate `typecheck` script)
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`); note `eslint` has a trailing user args pattern, invoke as `npm run lint` only

No tests exist in this repo; `npm run build` is the verification step.

## Backend repo (sibling)

The API is a **separate Express repo** one level up: `../assaignment-08 server/index.js` (its own git repo). Run it with `node index.js` from that dir; it serves `http://localhost:5000`.

- All client data calls go to `${process.env.NEXT_PUBLIC_BASE_URL}/...` (client `.env` → `http://localhost:5000`).
- Write routes require `Authorization: Bearer <JWT>`. The client fetches it from its own Better Auth instance via `fetch("/api/auth/token")` — **not** `authClient.token()`: this better-auth version's `jwtClient` has no token action (verified in node_modules).
- Server verifies JWTs against `${CLIENT_URL}/api/auth/jwks` with `issuer: CLIENT_URL` (no `/api/auth` suffix, no custom audience). If issuer/audience mismatches, valid tokens 401.
- Response shapes are camelCase-important: a good add/delete returns `{ acknowledged: true }` (Mongo result); errors instead return `{ error: "..." }` which client toasts display. Check `data.error` for failure messages rather than assuming an object shape.
- The server repo can crash on malformed request bodies (raw `JSON.parse` errors in its log are often harmless client noise; a real crash exits the process and port 5000 goes silent — check with `curl http://localhost:5000/`).

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
- `next.config.ts` allows images from **any** http(s) host (user-uploaded covers), and `reactCompiler: true` is on.
- `src/app/api/auth/[...all]/route.ts` is the Better Auth handler; server-side config in `src/lib/auth.ts` (jwt plugin, Mongo adapter, session cookieCache jwt 7 days), client in `src/lib/auth-client.ts`.
- Toasts use a local wrapper: `import { toast } from "@/components/ui/toast"` → `toast.add({title, description, type})`; `<Toaster />` is mounted in `layout.tsx`.
- The mongo adapter uses `client.db()` (DB name comes from the connection string), while the Express server uses `db("bookNook")` — collections must agree.

## Structure

- `src/app/` — App Router: `/`(home), `/books`(catalog)+`/books/[id]`(details, copies-left logic), `/add-book`, `/my-books`, `/my-borrows`, `/my-profile`, `/login`, `/register`, plus `/api/auth/[...all]`.
- `src/components/` — `Navbar.tsx` (logo, theme toggle, auth dropdown; login-only links hidden when signed out), `ThemeToggle.tsx`, `icons.tsx`, shared `BookCard.tsx`, `books/` (AllBooks, BorrowModal), `home/` sections, `ui/` primitives.
- `src/data/books.ts` exists but is no longer imported anywhere — all book data now comes from the Express API.
- Images live in `public/Images/`; book covers come from remote URLs (picsum placeholder on details page).

#Instruction : AI can make only designs not functional change, use only shadcn for all purpus..use just simple code like Beginer level..not use higher code
