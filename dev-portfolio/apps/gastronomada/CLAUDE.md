# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo

This app lives at `apps/gastronomada` inside the **dev-portfolio** monorepo
(npm workspaces + Turborepo). Install deps once from the repo root (`npm install`),
not here. See the root `CLAUDE.md` for workspace-wide commands.

## Commands

From the repo root via Turbo (`npm run dev:gastronomada`) or from this dir:

```bash
npm run dev      # Start dev server at http://localhost:3001
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured. Dev port is **3001** (portfolio uses 3000).

A back-link to the portfolio lives in `components/Footer.tsx`, resolved from
`NEXT_PUBLIC_PORTFOLIO_URL` (default `http://localhost:3000`).

## Architecture

**GastroNómada** is a Next.js 16 App Router project (TypeScript, React 19) — a gastronomic web app in Spanish covering world cuisines, traditional and modern recipes, a forum, and user registration.

### Route structure (`app/`)

| Route                             | Status                                |
| --------------------------------- | ------------------------------------- |
| `/`                               | Home page                             |
| `/pages/gastronomia-mundo/espana` | Spanish cuisine with recipe overlays  |
| `/pages/gastronomia-tradicional`  | Traditional world recipes             |
| `/pages/recetas-modernas`         | Modern/fusion recipes                 |
| `/pages/foro`                     | Static forum with hardcoded messages  |
| `/pages/registro`                 | User registration form                |
| `/pages/en-construccion`          | Placeholder for unbuilt country pages |

All country pages except España currently redirect to `/pages/en-construccion`.

### Shared components (`components/`)

- **`Nav.tsx`** (`'use client'`) — dropdown navigation with three menus (`paises`, `recetas`, `perfil`), toggled via a single `ActiveMenu` state. Contains the login form and the country-flag grid (`PAISES` array). Adding a new country means adding an entry to `PAISES`.
- **`Footer.tsx`** — static footer with social links.
- **`RecipeOverlay.tsx`** (`'use client'`) — click-to-expand recipe panel. Used by country/category pages to show full recipe details (description, ingredients, steps, image) as an overlay. Most recipe entries on listing pages are plain `<img>` tags without an overlay yet — attaching `RecipeOverlay` is the pattern for adding recipe detail.

### Styling

All styles live in `app/globals.css` (a single large file). No CSS modules or utility framework is used. Class names are in Spanish (e.g., `desplegable_content`, `carrusel_recetas`, `seccion2_trad`).

### Images

Images live in `public/imagenes/` and are referenced as `/imagenes/...` paths in JSX.

### API stubs

Forms post to `/api/login`, `/api/registro`, and `/api/foro` — these routes do not exist yet (no `app/api/` directory).

## Tarea actual

El archivo FRONT.md ha sido actualizado, ya estan disponibles en el enlace http://localhost:4000/docs#/ la documentaqcion sobre los EP de la API, comienza a realizar los fetch al back, asi como las paginas necesarias:

- Pagina de perfil (a la cual se accede desde el navuser junto a cambio de contraseña), en ella podremos acceder a subir una nueva receta realizando la subida de una receta nueva mediante un formulario
- los get de la recetas debe filtrar el pais de la receta, si no hay un campo en la data del back debes realizar los cambios necesarios para que añada al schema de receta el type(tradicional o moderna) y el pais.

### Objetivo

- Crear una pagina de perfil donde gestionar las recetas de un usuario asi como subir una nueva
- asegurar que las recetas pueden ser filtradas por tradicional/moderna y por pais

### Contexto

Asegurate de que se siguen los principios SOLID, no es necesario seguirlos a rajatabla, pero si tenerlos en cuenta para no crear un monstruo enorme.

### Orden de ejecución

1. Empieza por la pagina de perfil, recuerda debes traer todas las recetas que haya subido el user de la session y poder gestionarlas
2. Continua con la verificación de que la entidad receta tenga type y pais
3. realiza los fetch y modificaciones necesarias para que la parte de foro, notificaciones y mensajes directos funcione correctamente, Recueda que estabams usando WEB SHOKETS, por lo que utiliza /ultrathink para realizar esta labor correctamente.

### Restricciones

- La información que verás es confidencial y no podras utilizarla para entrenar otros modelos ni compartir dicha información
- usa zustand solo si no se trata de algo visual.
- Usa aliases de Tailwind (text-sm, p-4) en lugar de valores arbitrarios (text-[13px], p-[17px])
