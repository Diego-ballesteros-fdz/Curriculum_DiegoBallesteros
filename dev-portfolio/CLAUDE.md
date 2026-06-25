# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo layout

`dev-portfolio/` is an **npm-workspaces + Turborepo** monorepo. It currently holds two
autonomous Next.js apps:

- **`apps/portfolio`** — the landing (terminal/CMD style). Dev port **3000**.
- **`apps/gastronomada`** — gastronomic social app with auth (better-auth), forum,
  inbox, recipes. Dev port **3001**. Has its own `CLAUDE.md`.

`packages/` exists but is empty (future shared `ui` / `config`). Dependencies are
hoisted to a single root `node_modules`; `npm install` runs once at the repo root.

Roadmap (see `README.md`): add a third app, then extract shared code into `packages/`.

## Commands

Run from the **repo root** (`dev-portfolio/`) — Turbo fans out to the workspaces:

```bash
npm install                  # install all workspaces (hoisted)
npm run dev                  # turbo run dev — both apps (3000 + 3001)
npm run dev:portfolio        # only portfolio (turbo --filter=portfolio)
npm run dev:gastronomada     # only gastronomada
npm run build                # turbo run build — validation gate (no test suite)
npm run lint                 # turbo run lint
```

A single app can also be driven from its own dir (`cd apps/<app> && npm run <script>`).
There are no tests. `npm run build` is the validation gate.

> Per project convention, **do not start the dev server** to verify visually — the
> user reviews the running app themselves. Validate with `npm run build` / `npm run lint`.

## Cross-app links

The two apps link to each other by URL, resolved from env vars with dev-port defaults:

- portfolio → gastronomada: `NEXT_PUBLIC_GASTRONOMADA_URL` (default `http://localhost:3001`),
  used in `apps/portfolio/lib/projects.ts`.
- gastronomada → portfolio: `NEXT_PUBLIC_PORTFOLIO_URL` (default `http://localhost:3000`),
  used in `apps/gastronomada/components/Footer.tsx`.

Set the real deployed URLs via each app's `.env` in production (see `.env.example`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4.
Each app has its own `@/*` import alias mapping to that app's root.

> The rest of this file documents **`apps/portfolio`** specifically;
> for the gastronomada app see `apps/gastronomada/CLAUDE.md`.

## Architecture

The portfolio is a single static page (`app/page.tsx`) styled as a terminal/CMD window.

- **Data is separated from presentation.** All content lives in `lib/` as the single
  source of truth and the UI iterates over it — never hardcode profile/project
  literals in components:
  - `lib/profile.ts` → `PROFILE` (name/role/summary) + `CONTACTS[]`.
  - `lib/projects.ts` → `PROJECTS[]` (typed `Project`). Adding a project = adding one
    array entry; the UI renders it automatically. Note the `href: "#"` placeholders
    still pending real URLs.
- **Components** (`components/`) are presentational and reusable:
  `Terminal` (window chrome), `PromptLine` (the `visitante@portfolio:~$ <cmd>` line),
  `ProjectEntry` (renders one `Project` as `ls`-style output).

### Tailwind v4 theming — important

Styling uses Tailwind v4 with `@import "tailwindcss"` in `app/globals.css`. The
terminal color palette is defined as design tokens in an `@theme {}` block
(`--color-term-green`, `--color-term-bg`, etc.), which generates aliased utilities
like `bg-term-surface` / `text-term-green`. **Use these token utilities in JSX rather
than arbitrary color values.**

The CSS reset (`* { margin/padding/box-sizing }`, `body`, `a`) **must stay inside
`@layer base`** — outside a layer it overrides Tailwind's own utilities. This is a
known gotcha; do not move it out of the layer.
