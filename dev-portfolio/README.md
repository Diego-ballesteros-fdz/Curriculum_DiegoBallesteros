# dev-portfolio

Sitio de presentación de Diego Ballesteros Fernández — _Junior Backend Developer_.

Una **única app Next.js 16** (App Router) que integra dos experiencias bajo el
mismo despliegue:

- **Portfolio** (raíz `/`) — landing estilo terminal/CMD.
- **GastroNómada** (`/gastronomada/*`) — red social gastronómica con auth
  (better-auth), foro, buzón y recetas, servida desde la demo del portfolio.

> Antes era un monorepo (npm workspaces + Turborepo con `apps/portfolio` y
> `apps/gastronomada`). Se fusionó en una sola app para desplegar en un único
> proyecto de Vercel.

## Estructura

```
dev-portfolio/
├── app/
│   ├── layout.tsx          # shell raíz: <html>/<body>, fuentes, .dark por cookie
│   ├── globals.css         # Tailwind v4 + tokens del terminal y de GastroNómada
│   ├── (portfolio)/        # sección portfolio → sirve "/"
│   │   ├── layout.tsx      # estética terminal (fondo oscuro, mono)
│   │   └── page.tsx
│   └── gastronomada/       # sección GastroNómada → "/gastronomada/*"
│       ├── layout.tsx      # Nav + Footer + providers (tema/sesión/realtime)
│       ├── page.tsx        # home de la app
│       └── <ruta>/page.tsx # login, registro, foro, buzón, perfil, recetas…
├── components/             # UI de ambas secciones (nombres sin colisión)
├── lib/                    # datos (profile/projects) + api/auth/schemas/… de gastro
├── hooks/  ·  public/      # hooks y assets (incluye /imagenes de GastroNómada)
├── proxy.ts               # protege /gastronomada/* (antes middleware.ts)
└── next.config.ts          # proxy /api/* → backend (Fastify + better-auth)
```

## Desarrollo

```bash
npm install
npm run dev          # arranca la app (por defecto en :3000)
npm run build        # build de producción — puerta de validación (no hay tests)
npm run lint
```

> Convención del proyecto: **no arrancar el dev server** para verificar
> visualmente; el propio usuario revisa la app. Se valida con `build` / `lint`.

## Backend y entorno

GastroNómada habla con un backend externo (Fastify + better-auth). El front
reescribe `/api/*` hacia `BACKEND_URL` (ver `next.config.ts`), de modo que la
cookie de sesión vive en este origen. Variables en `.env.example`
(`BACKEND_URL`, `NEXT_PUBLIC_AUTH_URL`, `NEXT_PUBLIC_WS_URL`).

Documentación de referencia: **`GASTRONOMADA.md`** (detalle de la app) y
**`FRONT.md`** (contrato con el backend).
