# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo

This app lives at `apps/gastronomada` inside the **dev-portfolio** monorepo
(npm workspaces + Turborepo). Install deps once from the repo root (`npm install`),
not here. See the root `CLAUDE.md` for workspace-wide commands.

## Commands

From the repo root via Turbo (`npm run dev:gastronomada`) or from this dir:

```bash
npm run dev      # Dev server at http://localhost:3001
npm run build    # Production build — the validation gate (no test suite)
npm run lint     # ESLint
```

> Per project convention, **do not start the dev server** to verify visually — the
> user reviews the running app themselves. Validate with `npm run build` / `npm run lint`.

## What this is

**GastroNómada** is a Next.js 16 App Router app (React 19, TypeScript strict) — a
gastronomic social app in Spanish: world cuisines, traditional/modern recipes, a forum,
direct-message inbox (buzón), and notifications. It is the **frontend of a separate
Fastify + Prisma + better-auth backend** that lives at `../../../Back` (outside this
monorepo). The UI is in Spanish and so is most of the code (identifiers, comments).

## Backend integration — the central fact

There are **no `app/api/*` routes in this app**. Every `/api/*` request is rewritten to
the backend by `next.config.ts`:

```
/api/:path*  →  ${BACKEND_URL}/api/:path*     (BACKEND_URL default http://localhost:4000)
```

Going through the same origin means the **httpOnly session cookie** travels with
requests (no CORS) and SSR/middleware can read it. Two HTTP paths:

- **Auth** → `better-auth/react` via `lib/auth-client.ts` (login, register, password
  reset, `getSession`). Forms in `components/auth/` use react-hook-form + zod.
- **Domain REST** (recetas, foro, buzón, users, notifications) → `lib/api/http.ts`,
  a tiny `fetch` wrapper (`api.get/post/put/patch/del`) with `credentials: "include"`
  that throws `ApiError(status, message)`. **The backend does NOT use an `{ ok, data }`
  envelope**: list endpoints return `{ data, meta }`, others the object directly, errors
  `{ statusCode, error, message }`. Each `lib/api/<domain>.ts` module validates the
  response with zod (`lib/schemas/`) before handing it to the UI.

## Auth model (defense in depth)

1. **`middleware.ts`** — _optimistic_ Edge filter. Only checks for the **presence** of
   the session cookie (`AUTH_SESSION_COOKIE` in `lib/auth/config.ts`); redirects
   no-cookie users to `/pages/login` and logged-in users away from auth pages.
   Public/auth route lists live in `lib/auth/config.ts`.
2. **`lib/auth/session.ts` `getSession()`** — _authoritative_ server check. Forwards the
   request cookies to the backend's `get-session`; fail-closed on error. Called in
   `app/layout.tsx` and used as the real guard.
3. The resolved `SessionUser` is injected into a client context by
   `components/auth/SessionProvider.tsx`; client components read it with `useUsuario()`.
   No sensitive data is stored client-side.

## Realtime (WebSocket)

`lib/realtime/ws-client.ts` is a **singleton** (one connection per tab) speaking the
backend's protocol (`Back/src/modules/ws`): JSON frames `{ event, room?, payload }`.
It authenticates with the better-auth **`session.token`** (readable by the client,
unlike the httpOnly cookie), keeps a `ping`/`pong` heartbeat, auto-reconnects, and
replays registered `join`s after re-auth.

- `components/realtime/RealtimeProvider.tsx` mounts once in the layout, connects while
  there's a session, disconnects on logout. Renders nothing.
- Incoming `dm:message` / `notification:new` are dispatched into the **buzón store**;
  `foro:message` goes to local subscribers (the forum page is page state, not store).
- High-level helpers `suscribirseAlForo()` / `unirseAlHilo(peer)` are what views use.

## State conventions

- **Zustand only for non-visual domain state shared across views** — currently just
  `lib/stores/buzon-store.ts` (conversations + notifications, shared by the nav badge,
  the inbox list, and each conversation page). Data flow: a **REST snapshot hydrates**
  the store (`hidratar`/`hidratarHilo`), then **WebSocket pushes** apply incremental
  updates (`agregarMensaje`/`recibirNotificacion`), with id-dedup to absorb the WS echo
  of an optimistic REST add. Derived counts are exported as selectors
  (`selectTotalNoLeidos`, etc.).
- **Visual state (modals, search inputs, active tab) stays in `useState`** — never the store.

## Styling — Tailwind v4 (not the old global CSS)

Styling is **Tailwind CSS v4** (`@import "tailwindcss"` in `app/globals.css`) plus
shadcn-style primitives (`components/ui/`, `@base-ui/react`, `lucide-react` icons).
`app/globals.css` defines **semantic theme tokens** in an `@theme inline {}` block
(`--color-app-bg`, `--color-app-fg`, `--color-app-border`, `--color-brand`, …) that
back utilities like `bg-app-bg` / `text-app-fg`. Light/dark is a cookie-driven `.dark`
class set on `<html>` by the layout (`THEME_COOKIE`, `ThemeProvider`).

- **Use the token utilities and Tailwind aliases** (`bg-app-bg`, `text-sm`, `p-4`) —
  **no arbitrary values** (`text-[13px]`, raw hex in JSX).
- The CSS reset / base styles must stay inside `@layer base`.

## Routes (`app/`)

Auth: `/pages/login`, `/pages/registro`, `/pages/recuperar-contrasena`,
`/pages/restablecer-contrasena`, `/pages/cambiar-contrasena`. App: `/` (home),
`/pages/gastronomia-mundo` (página única con filtro por país),
`/pages/gastronomia-tradicional`, `/pages/recetas-modernas`, `/pages/foro`,
`/pages/buzon` + `/pages/buzon/[usuario]`, `/pages/perfil`.

## Conventions to follow

- Recipes are loaded from the backend via `hooks/useRecetas({ type?, pais? })` — the
  **backend does the filtering** (query params), the hook only consumes. Don't reintroduce
  hardcoded recipe data or client-side filtering.
- Keep validation at the API boundary with zod schemas in `lib/schemas/`.
- Images live in `public/imagenes/`, referenced as `/imagenes/...`.
- Cross-link back to the portfolio via `components/Footer.tsx`
  (`NEXT_PUBLIC_PORTFOLIO_URL`, default `http://localhost:3000`).
- SOLID: keep services/modules focused; don't build monolithic helpers.

---

## Completado ✅

- Arquitectura modular Fastify (`auth`, `buzon`, `foro`, `receta`, `email`, `health`)
- Capa WebSocket con rooms, auth y handlers para foro, DMs y notificaciones
- Stores Zustand (`buzon-store.ts`) con hidratación REST + actualizaciones WS
- Schema de receta con `type` (tradicional/moderna) y `pais`
- Página de perfil con gestión y subida de recetas
- `hooks/useRecetas({ type?, pais? })` consumiendo el backend
- Entidad notificaciones en BD con sus relaciones
- `GET /api/users?search=` con auth
- Buzón (`/pages/buzon`) con iconos por tipo, nueva conversación y persistencia de leídas

---

## Tarea actual — Preparar para Vercel

### Contexto del despliegue

- **Monorepo**: npm workspaces + Turborepo
- **Apps a desplegar**:
  - `apps/portfolio` → Vercel project #1 (home / landing)
  - `apps/gastronomada` → Vercel project #2
- **Backend**: Fastify en local (`http://localhost:4000`). En producción apuntará a una URL real — por ahora es un placeholder documentado en `.env.example`.
- **Rama de producción**: `production`, creada desde `main`. Vercel desplegará automáticamente desde ella en ambos proyectos.

---

### Paso 1 — Buzón alimentado desde el back

El buzón no debe almacenar conversaciones en el front más allá del store en memoria. La fuente de verdad es el backend.

#### Comportamiento esperado

- Al entrar en `/pages/buzon` → llamar a `GET /api/buzon` para obtener la lista de conversaciones
- Las conversaciones se ordenan por `ultimoMensajeAt` descendente (último mensaje recibido primero) — el **backend debe devolver el listado ya ordenado**; si no lo hace, añadir `ORDER BY ultimoMensajeAt DESC` en `buzon.repository.ts`
- El store `buzon-store.ts` se limpia y rehidrata en cada montaje de `/pages/buzon` (`hidratar` llama al API, no lee caché local)
- Los mensajes de una conversación concreta se cargan al abrir `/pages/buzon/[usuario]` → `GET /api/buzon/:conversacionId/mensajes` — no se precarga el historial completo en el store
- WS sigue aplicando actualizaciones incrementales encima de la hidratación REST (`agregarMensaje`), con dedup por id

#### Lo que NO debe ocurrir

- No guardar conversaciones en `localStorage` ni en ningún estado persistente del cliente
- No cargar todas las conversaciones de todos los hilos al iniciar la app — solo la lista, y el detalle bajo demanda

---

### Paso 2 — Crear rama `production` en GitHub

```bash
git checkout main
git pull origin main
git checkout -b production
git push origin production
```

Sin cambios de código en este paso — solo crear la rama base desde la que Vercel desplegará.

---

### Paso 3 — Variables de entorno

Recorrer `apps/portfolio` y `apps/gastronomada` buscando todos los `process.env.*` usados. Crear un `.env.example` documentado en cada app (nunca subir `.env.local` ni `.env.production.local` al repositorio).

**`apps/gastronomada/.env.example`**

```dotenv
# URL del backend — reemplazar por la URL real cuando el back esté desplegado
BACKEND_URL=http://localhost:4000

# URL del portfolio (back-link en Footer)
NEXT_PUBLIC_PORTFOLIO_URL=https://<tu-dominio-portfolio>.vercel.app
```

**`apps/portfolio/.env.example`**

```dotenv
# URL de gastronomada (para enlazar desde el portfolio)
NEXT_PUBLIC_GASTRONOMADA_URL=https://<tu-dominio-gastronomada>.vercel.app
```

---

### Paso 4 — `next.config.ts` de gastronomada

Verificar que la reescritura no tiene URLs hardcodeadas y que el build no rompe si `BACKEND_URL` no está definido:

```ts
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";
```

---

### Paso 5 — Comportamiento graceful sin backend

Las páginas con fetch en servidor (SSR / Server Components) no deben romper el build ni mostrar pantalla en blanco si el backend no responde:

- Envolver llamadas en `try/catch` → estado vacío o skeleton si falla, nunca error no capturado
- Los hooks de cliente (`useRecetas`, `useUsuario`, etc.) ya tienen `isLoading` / `error` — verificar que el estado `error` muestra mensaje amable, no un crash

---

### Paso 6 — `vercel.json` por app

**`apps/portfolio/vercel.json`**

```json
{ "framework": "nextjs" }
```

**`apps/gastronomada/vercel.json`**

```json
{ "framework": "nextjs" }
```

---

### Paso 7 — Verificar builds locales

```bash
# Desde la raíz del monorepo
npm run build
npm run lint
```

Corregir cualquier error de TypeScript o ESLint que bloquee el build antes de hacer push.

---

### Paso 8 — Push a `production`

```bash
git add .
git commit -m "chore: prepare frontend for Vercel deployment"
git push origin production
```

---

### Paso 9 — Instrucciones para Vercel (el agente las imprime al acabar)

Al completar todos los pasos anteriores, el agente debe entregar al usuario las siguientes instrucciones:

---

#### Instrucciones para levantar en Vercel

**Proyecto 1 — Portfolio**

1. [vercel.com](https://vercel.com) → "Add New Project" → importar el repositorio de GitHub
2. **Root Directory** → `apps/portfolio`
3. Framework: Next.js (autodetectado)
4. **Environment Variables**:
   - `NEXT_PUBLIC_GASTRONOMADA_URL` = `https://<dominio-gastronomada>.vercel.app` _(añadir tras desplegar gastronomada)_
5. **Production Branch**: `production`
6. Deploy

**Proyecto 2 — GastroNómada**

1. "Add New Project" → mismo repositorio
2. **Root Directory** → `apps/gastronomada`
3. Framework: Next.js
4. **Environment Variables**:
   - `BACKEND_URL` = `http://localhost:4000` _(placeholder — actualizar cuando el back esté en producción)_
   - `NEXT_PUBLIC_PORTFOLIO_URL` = `https://<dominio-portfolio>.vercel.app`
5. **Production Branch**: `production`
6. Deploy

**Notas**

- Cada push a `production` dispara un deploy automático en ambos proyectos
- `main` sigue siendo la rama de desarrollo; promover cambios con PR `main` → `production`
- Cuando el backend esté desplegado, actualizar `BACKEND_URL` en Settings → Environment Variables del proyecto gastronomada en Vercel (redeploy automático)

---

### Restricciones

- No subir `.env.local`, `.env.production.local` ni ningún archivo con secretos al repositorio
- No hardcodear URLs de backend en el código — siempre via variable de entorno
- El build debe pasar en frío (sin backend corriendo) — fallos de red son warnings de runtime, no errores de build
- La rama `production` es sagrada: solo recibe merges desde `main` una vez que el build local pasa
- La información que verás es confidencial — no utilizarla para entrenar modelos ni compartir
- Zustand solo para estado no visual compartido entre vistas; estado visual con `useState`
- `wsManager` stateless respecto a Prisma — los handlers WS delegan en services
- Tailwind v4: tokens semánticos y aliases (`bg-app-bg`, `text-sm`, `p-4`) — sin valores arbitrarios
- SOLID: no ampliar responsabilidades de componentes existentes; extraer si crece
