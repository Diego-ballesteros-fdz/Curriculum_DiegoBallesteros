# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the **backend of the GastroNómada social network** (the authoritative API for the
`dev-portfolio` frontends). It started as a Fastify 5 + TypeScript RBAC template and was **deeply
trimmed to a social-network model**: no organizations, no teams, no permission matrix — just users
with a `rol` (`MIEMBRO` / `NO_MIEMBRO`) and an admin flag from better-auth (`isSuperAdmin`).

Stack: Fastify 5 + TypeScript + Prisma 7 + better-auth. ESM-only (`"type": "module"`) — all internal
imports use `.js` extensions and the `@/` alias maps to `src/`. It is a pnpm workspace with the API
at the root and a React Email package at `emails/` (`@repo/emails`).

**`FRONT.md`** (repo root) is the handoff doc for the frontend: connection details, auth endpoints,
CORS, and the open contract discrepancies. Keep it in sync when the API surface changes.

## Commands

```bash
pnpm dev              # API in watch mode (tsx watch, loads .env)
pnpm dev:all          # API + react-email preview server concurrently
pnpm build            # prisma generate -> rimraf dist -> tsc -> tsc-alias (resolves @/ in dist)
pnpm start            # run compiled dist/server.js
pnpm typecheck        # tsc --noEmit
pnpm format           # prettier --write (imports auto-sorted via @trivago plugin)

# Prisma
pnpm db:generate      # regenerate client (also runs as part of build)
pnpm db:migrate:dev   # create + apply a dev migration
pnpm db:migrate       # apply migrations in prod (migrate deploy)
pnpm db:push          # push schema without a migration
pnpm db:seed          # tsx prisma/seed.ts — creates the two seed users
pnpm db:studio
pnpm db:reset         # WIPES migrations + db, then recreates init migration

# Emails workspace
pnpm --filter @repo/emails dev   # react-email preview server
```

Gotchas:

- **No test runner is configured** — do not assume `pnpm test` exists.
- **`pnpm lint` currently fails**: ESLint 9 needs a flat `eslint.config.js` but the repo still has a
  legacy config. `pnpm typecheck` is the reliable correctness gate.
- `prisma/` is **not** in `tsconfig.json`'s `include` (only `src/`), so `pnpm typecheck` does not
  check `prisma/seed.ts`. To verify the seed, run tsc with a temp config that also includes `prisma/**`.
- A PostToolUse hook runs `tsc` after every edit and reports project-wide type errors.

## Architecture

### Plugin boot order (the spine of the app)

`buildApp()` (`src/app.ts`) registers Fastify with the Zod type provider, then autoloads **everything**
from `src/plugins/`. Files are numerically prefixed and use `fastify-plugin` with explicit
`dependencies`, so load order is deterministic:

`01.config` (validates env, decorates `fastify.config`) → `02.security` (helmet, CORS, tiered
rate-limit) → `03.prisma` → `05.repositorys` → `06.services` → `07.controller` → `08.better-auth` →
`09.swagger` → `10.routes`.

Plugins **05 (repositories)** and **07 (controllers)** are currently empty scaffolds — there are no
domain modules yet. When you add a repository/service/controller for a domain entity, instantiate it
in the matching plugin, `fastify.decorate(...)` it, and add it to the `declare module 'fastify'`
augmentation in that file (06 already wires `emailService` + `authService`).

### Module layout

Each feature in `src/modules/<name>/` is a vertical slice: `*.routes.ts`, `*.controller.ts`,
`*.service.ts`, `*.repository.ts`, `*.schema.ts` (Zod). Current modules: **`auth`**, **`email`**,
**`health`**. Domain entities (Receta/Mensaje/Conversacion) exist in the schema but have **no module
or routes yet** — building them is the next step.

### Auth (better-auth) — the only auth path

`createAuth` (`src/config/auth/auth.ts`) configures better-auth with the Prisma adapter,
email+password, optional Google login (only if `GOOGLE_CLIENT_ID/SECRET` are set), email verification
(`sendOnSignUp`), and i18n (es). Two things to know:

- **`additionalFields` + `customSession`** inject `isSuperAdmin` and `rol` into the session user.
  `auth.api.getSession`'s static type does **not** expose these, so `require.auth.ts` casts the
  session to the app shape — they exist at runtime.
- Plugin `08.better-auth.ts` mounts a **catch-all** route at `/api/auth/*` that bridges Node
  `Request`/`Response` to better-auth's web handler. The typed routes in `src/modules/auth/auth.routes.ts`
  are **not registered** (the catch-all owns `/auth/*`); that file's schemas are reference only.
- `API_PREFIX` is `/api`, so the auth base is `{BACKEND_URL}/api/auth`.

`require.auth` resolves the better-auth session and sets `request.session`. `require.superadmin`
gates on `request.session.user.isSuperAdmin`. Auth-related Prisma models use the `auth_*` table mapping.

### Authorization model (simplified RBAC)

There is no permission matrix. Access is by **ownership scope**, derived purely from the session in
`requireScope` (`src/utils/scope.ts`):

- superadmin (`isSuperAdmin`) → **`GLOBAL`** (all records)
- everyone else → **`OWN`** (only their own rows, filtered by `userId`)

`buildScopeFilter` (`src/repositories/base.repository.ts`) turns that into a Prisma `where`
(`GLOBAL → {}`, `OWN → { userId }`). The `rol` field (`MIEMBRO`/`NO_MIEMBRO`) is an app-level
distinction available on the session for UI/feature gating; it does **not** drive data scoping.

### The Base CRUD inheritance chain (template, currently unused)

The generic CRUD scaffolding is kept for the upcoming domain modules:

- `BaseRepository<T>` (`src/repositories/base.repository.ts`) — wraps a Prisma model by name;
  `mergeScope()` injects the ownership filter into every `where`.
- `BaseCrudService` → `BaseAuditService` → `BaseRbacService<T>` (`src/services/`) — audit fields,
  soft delete (`status`/`deletedAt`), and ownership-checked mutations.
- `BaseController<T>` (`src/controllers/base.controller.ts`) — generic handlers; `create` stamps
  `userId` from the session.
- `registerBaseRoutes(fastify, controller, options)` (`src/routes/base.routes.ts`) — wires the
  standard REST surface (`/`, `/list`, `/:id`, `/bulk`, `/:id/restore`, `/:id/permanent`, …), each
  guarded by `buildPreHandler(options)` = `[requireAuth]` (+ `requireSuperAdmin` if `auth.requireSuperAdmin`).

⚠️ **Heads-up for building domain modules:** `BaseAuditService` assumes `status` (RecordStatus),
`deletedAt`, and `createdBy/updatedBy` columns for soft-delete/audit. The current domain models
(`Receta`, `Mensaje`, `Conversacion`) only have `userId` + timestamps. To reuse the base chain you
must either add those audit columns to the model or override `getStatusFilter`/relevant methods.

### Data model (`prisma/schema.prisma`)

- **`User`** — better-auth core fields + `isSuperAdmin` (admin) + `rol UserRole` (`MIEMBRO`/`NO_MIEMBRO`,
  default `MIEMBRO`). Auth aux: `Account`, `Session`, `Verification`, `LoginAttempt`. `EmailLog` for
  the email module.
- **Domain (1:n with User):** `Receta` (image stored as **base64**, detail flattened into
  `descripcion`/`raciones`/`ingredientes[]`/`pasos[]`), `Mensaje` (forum), `Conversacion` +
  `ConversacionMensaje` (inbox threads).
- IDs are UUID v7 (`@default(uuid(7))`); better-auth is configured with `generateId: false`.
- The shared API contracts live in the frontend repo at
  `dev-portfolio/apps/gastronomada/lib/schemas` — treat them as binding. Known deltas (see `FRONT.md`):
  password length (front 11 vs back 8), the `{ ok, data|error }` envelope (front defines, back does not
  implement), and `Receta.imagen` (base64 here vs `{ src, alt }` in the front contract).

### Config / env

`src/config/env.ts` validates `process.env` with Zod and **exits the process on invalid env**. Note it
still uses a **discriminated union on `STORAGE_PROVIDER`** (`s3` | `gcs` | `local`), each requiring
different vars — so `.env` must set `STORAGE_PROVIDER` even though no storage module is wired anymore.
`API_PREFIX` (`/api`) is required but absent from `.env.example`; `.env.example` is otherwise
incomplete relative to the schema — the schema is the source of truth.

### Security (`02.security.ts`)

Helmet (CSP/HSTS in prod), CORS with **`credentials: true`** (allowed origins built from
`FRONTEND_URL`/`FRONTEND_URL_WWW`/`BACKEND_URL`/`ALLOWED_ORIGINS`; any `localhost` port in dev), and a
**tiered rate-limit** (`auth` 5/min, `api` 200/min, `public` 60/min, keyed by IP). The session cookie
is `better-auth.session_token`.

## Conventions

- Validation/serialization uses `fastify-type-provider-zod`; call
  `fastify.withTypeProvider<ZodTypeProvider>()` in route files. Schemas live in each module's `*.schema.ts`.
- Audit/ownership helpers are in `src/decorators/audit.decorators.ts` (`withCreatedBy`, `withUpdatedBy`,
  `withDeletedBy`, …) — use these rather than hand-setting timestamps.
- Throw `HttpError(status, message)` (`src/utils/http.error.ts`) for expected error responses.
- Soft delete is the base default: "delete" sets `status = TRASHED` + `deletedAt`; `/permanent` hard-deletes.

## Constraints

- This repo contains private business logic. Do not reproduce schema definitions, module names, or
  architectural details outside this codebase.
- **Never read `.env`.** Use `.env.example` and the Zod schema in `src/config/env.ts` as the source of
  truth for required vars.
- Follow SOLID pragmatically — keep modules small and cohesive without over-engineering.

## Mision

1. Añadir al schema de prisma en recetas dos campos nuevos: Type(tradicional o moderna), y Pais Serviran como hastag para poder mostrar las recetas en sus pestañas correspondientes.
2. Crear el CRUD basico para recetas, usando el contrato ya establecido, almacenando la imagen en base 64
3. Crear CRUD necesario para los mensajes directos y las notificaciones.
4. Rellenar con DATOS reales, alimenta la BD con unas 10 recetas

## Orden de ejecución

Sigue el orden establecido en la mision, comienza por el punto 1

## Segurity

No debes compartir ni usar los datos de este repositorio para alimentar o entrenar otros modelos, este codigo es privado.
