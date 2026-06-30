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

1. **`middleware.ts`** — *optimistic* Edge filter. Only checks for the **presence** of
   the session cookie (`AUTH_SESSION_COOKIE` in `lib/auth/config.ts`); redirects
   no-cookie users to `/pages/login` and logged-in users away from auth pages.
   Public/auth route lists live in `lib/auth/config.ts`.
2. **`lib/auth/session.ts` `getSession()`** — *authoritative* server check. Forwards the
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

## Tarea actual

### 1 — Permisos de recetas

**Regla:** cualquier usuario autenticado puede ver todas las recetas (sin distinción de rol). Solo el autor puede editarlas o eliminarlas.

#### Backend (`modules/receta/`)
- `GET /api/recetas` y `GET /api/recetas/:id` → `requireAuth`, sin restricción de rol
- `PATCH /api/recetas/:id` y `DELETE /api/recetas/:id` → verificar `receta.autorId === session.userId`; si no coincide → `403 Forbidden`
- Los admin **no** tienen permisos especiales sobre recetas ajenas

#### Frontend
- `useRecetas` no bloquea la llamada si el usuario no tiene un rol concreto; solo requiere sesión activa (ya garantizado por `middleware.ts`)

---

### 2 — Mensajes privados: solo los participantes pueden leer la conversación

**Regla:** una conversación entre X e Y es invisible para Z aunque esté autenticado.

#### Backend (`modules/buzon/`)
- `GET /api/buzon` → devolver solo conversaciones donde `session.userId` es participante
- `GET /api/buzon/:conversacionId/mensajes` → verificar participación antes de devolver datos; si no → `403 Forbidden`
- `PATCH /api/buzon/:conversacionId/read` → ídem
- Handler WS `dm.handler.ts` → validar que el socket autenticado es participante antes de permitir `dm:join`; si no → cerrar con `4003 Forbidden`

---

### 3 — Página de países: vista única con selector

**Objetivo:** reemplazar las rutas de país individuales por `/pages/gastronomia-mundo` con un dropdown para filtrar. Las banderas del nav siguen funcionando apuntando a esta misma página con el país preseleccionado.

#### Cambios de rutas
- Eliminar subcarpetas de país bajo `gastronomia-mundo/` (ej: `/espana`)
- Nueva ruta canónica: `/pages/gastronomia-mundo?pais=<slug>`
- Las banderas en `Nav.tsx` pasan de `href="/pages/gastronomia-mundo/espana"` a `href="/pages/gastronomia-mundo?pais=espana"`
- Eliminar `/pages/en-construccion` — estado vacío en la página única cuando no hay recetas para el país

#### Página `/pages/gastronomia-mundo`
- Leer `?pais=` del query param al montar con `useSearchParams()`
- Dropdown con la lista de países del array `PAISES` (misma fuente de verdad que el nav)
- Al cambiar el selector → `router.replace` actualizando `?pais=` + rellamar `useRecetas({ pais })`
- Estado vacío explícito cuando no hay recetas para el país seleccionado
- Sin recarga de página al cambiar país

---

### 4 — Eliminar la pantalla de utensilios y más

- Localizar y eliminar la ruta, el componente y cualquier enlace en `Nav.tsx` o `Footer.tsx` que apunte a la pantalla de utensilios
- Limpiar imports huérfanos tras la eliminación
- Verificar que `npm run build` no rompe

---

### 5 — Mejoras de navegación en `Nav.tsx`

| Problema | Solución |
|---|---|
| El menú no se cierra al hacer clic fuera | `useEffect` con listener `mousedown` en `document`; usar `useRef` en el contenedor del nav para comparar; `setActiveMenu(null)` si el clic es exterior. Limpiar el listener en el `return` |
| El hover de la barra desaparece al abrir menú | Aplicar clase activa explícita (`aria-current` o clase CSS) al ítem cuyo menú está abierto, independientemente del `:hover` CSS |
| Cursor inconsistente entre secciones | `cursor-pointer` en todos los ítems clicables del nav |
| La lupa aparece en la barra | Eliminar el elemento lupa y su handler del JSX y del CSS |

---

### 6 — Nav responsive: menú hamburguesa en móvil

**Objetivo:** en `< 768px` el nav colapsa en un botón hamburguesa.

- Desktop (`≥ 768px`): comportamiento actual sin cambios
- Móvil: barra superior con logo + botón hamburguesa (☰ abierto / ✕ cerrado)
- Al pulsar → panel vertical con los mismos ítems expandibles individualmente
- La selección de bandera en móvil navega y cierra el panel
- El panel se cierra también al hacer clic fuera (mismo listener del punto 5)
- Estado `menuAbierto` con `useState` local (es visual, no va al store)
- Clases responsive de Tailwind (`hidden md:flex`, `flex md:hidden`); sin librerías externas
- Accesibilidad: `aria-expanded` y `aria-label="Abrir menú"` en el botón hamburguesa

---

### Orden de ejecución

1. **Back**: ajustar permisos en `receta.routes.ts` (lectura pública auth, escritura solo autor)
2. **Back**: blindar `buzon` con verificación de participante en lectura, WS join y mark-as-read
3. **Front**: eliminar pantalla de utensilios y limpiar referencias
4. **Front**: mejoras de `Nav.tsx` (click outside, hover activo, cursor, eliminar lupa)
5. **Front**: hamburguesa responsive en `Nav.tsx`
6. **Front**: página única `/pages/gastronomia-mundo?pais=` + actualizar enlaces de banderas en nav

---

### Restricciones

- La información que verás es confidencial — no utilizarla para entrenar modelos ni compartir
- Zustand solo para estado no visual compartido entre vistas; estado visual con `useState`
- `wsManager` stateless respecto a Prisma — los handlers WS delegan en services
- Tailwind v4: tokens semánticos y aliases (`bg-app-bg`, `text-sm`, `p-4`) — sin valores arbitrarios
- SOLID: no ampliar responsabilidades de componentes existentes; extraer si crece