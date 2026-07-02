# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es

Una **única app Next.js 16** (App Router) que integra dos experiencias bajo el
mismo despliegue de Vercel:

- **Portfolio** — landing estilo terminal/CMD. Se sirve en la **raíz `/`**.
- **GastroNómada** — red social gastronómica (better-auth, foro, buzón, recetas).
  Todas sus rutas cuelgan del prefijo **`/gastronomada/*`**; su home es
  `/gastronomada`. Es la "demo" enlazada desde el portfolio.

> Histórico: antes era un monorepo (npm workspaces + Turborepo con
> `apps/portfolio` y `apps/gastronomada`). Se fusionó en una sola app. Ya **no**
> hay Turbo, `apps/` ni `packages/`.

## Commands

```bash
npm install
npm run dev          # next dev (por defecto :3000)
npm run build        # next build — puerta de validación (no hay tests)
npm run lint         # eslint
```

> Convención del proyecto: **no arrancar el dev server** para verificar
> visualmente — el usuario revisa la app él mismo. Validar con `build` / `lint`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4.
Alias único `@/*` → raíz del repo (ver `tsconfig.json`).

## Arquitectura de rutas y layouts

Un solo árbol `app/`, con un shell raíz y una sección por experiencia:

- **`app/layout.tsx`** — ÚNICO layout con `<html>`/`<body>`. Carga las dos
  fuentes (Geist sans + Geist Mono) como variables CSS y aplica `.dark` en
  `<html>` según la cookie de tema. **No fija fondo ni tipografía en `body`**:
  como el mismo `body` sirve dos estéticas, cada sección lo hace en su envoltorio.
- **`app/(portfolio)/`** — route group (no añade segmento) → sirve `/`.
  `layout.tsx` envuelve en la estética terminal (`bg-term-bg`, `font-mono`).
  `page.tsx` es la página del portfolio.
- **`app/gastronomada/`** — sección GastroNómada (`/gastronomada/*`).
  `layout.tsx` monta Nav + Footer + providers (tema/sesión/tiempo real) y el
  fondo `bg-app-bg font-sans`. Cada ruta es una carpeta plana
  (`login`, `registro`, `foro`, `buzon`, `buzon/[usuario]`, `perfil`,
  `gastronomia-mundo`, `recetas-modernas`, …).

Código compartido en la raíz (el alias `@/*` resuelve ahí): `components/`,
`lib/`, `hooks/`, `public/`. Los nombres de `components/*` y `lib/*` de las dos
secciones **no colisionan**, por eso conviven en las mismas carpetas.

### Datos del portfolio

Contenido separado de la presentación (fuente única de verdad en `lib/`):
`lib/profile.ts` (`PROFILE` + `CONTACTS[]`) y `lib/projects.ts` (`PROJECTS[]`).
La UI itera; añadir un proyecto = añadir una entrada. La demo de GastroNómada es
un enlace **interno** `/gastronomada` (ya no una URL/dominio aparte).

## GastroNómada — protección de rutas y backend

- **`proxy.ts`** (antes `middleware.ts`; Next 16 renombró la convención) protege
  solo `/gastronomada/*` (matcher). Filtro OPTIMISTA: comprueba la presencia de
  la cookie de sesión y redirige a `/gastronomada/login`; la validación
  autoritativa la hace `getSession()` en el servidor.
- **`next.config.ts`** reescribe `/api/*` → `BACKEND_URL` (Fastify + better-auth),
  así la cookie httpOnly viaja por el mismo origen sin CORS. Variables en
  `.env.example`. Detalle en **`GASTRONOMADA.md`** y contrato en **`FRONT.md`**.

## Tailwind v4 theming — importante

Un solo `app/globals.css` con `@import "tailwindcss"`. Conviven **dos juegos de
tokens** que no comparten nombres:

- Terminal (portfolio): `@theme { --color-term-* , --font-mono }` → utilidades
  `bg-term-bg`, `text-term-green`, etc.
- GastroNómada: tokens `--app-*`/`--surface-*`/`--brand-*` + shadcn (`@theme
  inline`, `.dark`).

Usa esas utilidades con token en el JSX, no valores arbitrarios.

El **reset CSS** (`* { margin/padding/box-sizing }`) y `* { @apply border-border
outline-ring/50 }` van dentro de **`@layer base`** — fuera de un layer pisarían
las utilidades de Tailwind (gotcha conocido; no lo saques del layer). El fondo y
la tipografía **no** se fijan en `body`: los pone el layout de cada sección.
