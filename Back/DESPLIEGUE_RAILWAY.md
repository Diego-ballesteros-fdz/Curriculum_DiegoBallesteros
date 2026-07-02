# Despliegue en Railway — GastroNómada Backend

Guía de tareas para llevar este backend (Fastify 5 + Prisma 7 + better-auth, pnpm
workspace ESM) a producción en **Railway**. Ejecutar en el orden indicado.

> Estado detectado al redactar este doc:
> - No existe `Dockerfile` (aunque `.dockerignore` lo referencia).
> - `.env.example` está **desincronizado** con el esquema real (`src/config/env.ts`): faltan
>   variables **obligatorias** (`HOST`, `API_PREFIX`, `BACKEND_URL`, `FRONTEND_URL_WWW`,
>   `DEV_EMAIL`, `VALKEY_URL`, `STORAGE_PROVIDER` + sus dependientes…).
> - El script `start` usa `node --env-file=.env` → en Railway **no hay `.env`**, las variables
>   se inyectan por entorno. Hay que corregirlo.
> - `docker-compose.yml` solo levanta un Postgres **local**; Railway **no consume** ese fichero.

---

## Estado de ejecución (parte de código — hecho)

Completado en el repo (queda la parte manual en el panel de Railway):

- ✅ **`package.json`**: `start` → `node dist/src/server.js` (el build genera `dist/src/`, no `dist/`);
  añadido `start:prod` (`prisma migrate deploy` + arranque) y `db:seed:prod` (sin `--env-file`).
- ✅ **`src/config/env.ts`**: eliminados `VALKEY_URL` y `STORAGE_PROVIDER` (+ S3/GCS/local); el esquema
  ya no es un discriminated union, es `baseSchema` plano. `pnpm typecheck` en verde.
- ✅ **`.env.example`**: reescrito acorde al esquema real (todas las obligatorias, notas de prod).
- ✅ **`Dockerfile`**: ya existía y es válido (multi-stage, `openssl`, `prisma migrate deploy` +
  `node dist/src/server.js`). No requería cambios.
- ✅ **`docker-compose.yml`**: cabecera aclarando que es solo para desarrollo local.
- ⏳ **Manual en Railway**: provisionar Postgres, cargar variables, health check `/api/health`,
  fijar rama de deploy `production`, backups. (Ver tareas 2–3 y checklist final.)

> Nota: el repo git raíz es `cv virtual/` (incluye `Back/` y `dev-portfolio/`). El commit de esta
> preparación incluye **solo** archivos de `Back/`; los cambios pendientes de `dev-portfolio/` se
> dejan intactos.

---

## Tarea 1 — Preparar el proyecto para producción

Objetivo: que `pnpm build` + `pnpm start` funcionen con las variables inyectadas por Railway,
sin depender de ningún fichero `.env`.

- [ ] **Corregir el script `start`** en `package.json`. Actualmente:
  ```jsonc
  "start": "node --env-file=.env dist/server.js"
  ```
  En Railway no existe `.env` (rompe el arranque). Cambiar a:
  ```jsonc
  "start": "node dist/server.js"
  ```
  Las envs las inyecta la plataforma; `env.ts` las lee de `process.env`.

- [ ] **Migraciones en el arranque de producción.** Añadir un script de release que aplique
  migraciones antes de servir. Opción recomendada (script dedicado):
  ```jsonc
  "start:prod": "prisma migrate deploy && node dist/server.js"
  ```
  y usarlo como **Start Command** en Railway, o mantener `migrate deploy` como paso previo
  en el pipeline (ver Tarea 3).

- [ ] **`HOST` y `PORT`.** El esquema exige ambos. Railway asigna el puerto por `$PORT`.
  - `HOST=0.0.0.0` (obligatorio para que Railway alcance el contenedor; `localhost` no vale).
  - `PORT=${{PORT}}` (referencia a la variable que Railway inyecta) — `server.ts` ya lee `env.PORT`.

- [ ] **Método de build en Railway.**:
  - **Dockerfile** (más determinista): crear un `Dockerfile` multi-stage (deps → build → runtime
    con `node:20-alpine`, `prisma generate` incluido en el build, `CMD ["pnpm","start:prod"]`).
    Recordar que `.dockerignore` ya excluye `node_modules`, `.env`, `.git`.

- [ ] **`prisma generate` en build.** Ya está incluido en `pnpm build`
  (`prisma generate && rimraf dist && tsc && tsc-alias`). Confirmar que el cliente Prisma 7
  (`@prisma/adapter-pg`) se genera en el entorno de build de Railway.

- [ ] **Healthcheck.** Configurar el Health Check Path de Railway a **`/api/health`**
  (verifica DB + email; devuelve 503 si la DB cae). Timeout ~100s.

- [ ] **Logs.** En producción usar `LOG_LEVEL=info` y **no** `pino-pretty` (dejar salida JSON;
  Railway la muestra igual). Confirmar `NODE_ENV=production` (activa CSP/HSTS en `02.security.ts`).

- [ ] **Variables muertas pero obligatorias.** El esquema exige `VALKEY_URL` (una URL válida) y
  `STORAGE_PROVIDER` (+ dependientes), pero **no se usan** en `src/` fuera de la validación.
  Decidir:
  - **B (limpio):** eliminar esos campos de `src/config/env.ts` para no arrastrar config falsa.
  → Dejar constancia de la decisión en `FRONT.md`/`CLAUDE.md`.

- [ ] **Typecheck como gate.** `pnpm lint` falla (ESLint 9 sin flat config). Usar
  `pnpm typecheck` antes de desplegar.

---

## Tarea 2 — `.env.example` para producción

Objetivo: que `.env.example` refleje **exactamente** las variables que valida
`src/config/env.ts`, con notas de valores de producción. (El esquema es la fuente de verdad.)

- [ ] Reescribir `.env.example` con **todas** las variables obligatorias. Plantilla propuesta:

  ```dotenv
  # ── Servidor ─────────────────────────────────────────────
  NODE_ENV=production
  PORT=4000                       # Railway inyecta $PORT; en su UI: PORT=${{PORT}}
  HOST=0.0.0.0                    # obligatorio en Railway
  API_PREFIX=/api
  LOG_LEVEL=info

  # ── URLs (sin barra final) ───────────────────────────────
  BACKEND_URL=https://<tu-servicio>.up.railway.app
  FRONTEND_URL=https://gastronomada.<dominio>
  FRONTEND_URL_WWW=https://www.gastronomada.<dominio>
  # ALLOWED_ORIGINS=https://a.com,https://b.com   # opcional (CORS extra)

  # ── Base de datos (Railway Postgres) ─────────────────────
  DATABASE_URL=${{Postgres.DATABASE_URL}}   # referencia al servicio Postgres de Railway

  # ── Better Auth ──────────────────────────────────────────
  BETTER_AUTH_SECRET=<openssl rand -base64 32>
  # BETTER_AUTH_URL lo deriva el server de BACKEND_URL (ver auth.ts)
  # GOOGLE_CLIENT_ID=...           # opcional
  # GOOGLE_CLIENT_SECRET=...       # opcional

  # ── Email (Resend) ───────────────────────────────────────
  RESEND_API_KEY=<clave-resend-produccion>
  EMAIL_FROM=GastroNómada <no-reply@tudominio.com>
  DEV_EMAIL=<email-para-pruebas>

  # ── Rate limit ───────────────────────────────────────────
  RATE_LIMIT_MAX=100
  RATE_LIMIT_WINDOW=1 minute

  # ── Swagger (desactivar en prod) ─────────────────────────
  SWAGGER_ENABLED=false

  # ── Requeridas por el esquema (actualmente sin uso real) ─
  VALKEY_URL=redis://localhost:6379
  STORAGE_PROVIDER=local
  LOCAL_STORAGE_PATH=/tmp
  # Si STORAGE_PROVIDER=s3 → S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY, S3_BUCKET_NAME (+ S3_REGION)
  # Si STORAGE_PROVIDER=gcs → GCS_BUCKET, GCS_KEY_FILE

  # ── Opcionales ───────────────────────────────────────────
  # CDN_URL=  API_URL=  CSP_REPORT_URI=  INTERNAL_IPS=
  ```

- [ ] **NO** commitear secretos reales. `.env.example` solo lleva placeholders.
      Confirmar que `.env` está en `.gitignore` (lo está: `.dockerignore` lo excluye del build).

- [ ] Cargar estas variables en Railway → **Variables** del servicio API (una a una o pegando el
      bloque). `DATABASE_URL` y `PORT` como **referencias** (`${{...}}`), no valores literales.

- [ ] Revisar CORS: `02.security.ts` construye orígenes desde
      `FRONTEND_URL`/`FRONTEND_URL_WWW`/`BACKEND_URL`/`ALLOWED_ORIGINS` con `credentials: true`.
      Asegurar que los dominios reales del front están en esas variables.

---

## Tarea 3 — Base de datos en Railway (revisar `docker-compose`)

Aclaración clave: **Railway no ejecuta `docker-compose.yml`**. La BD se provisiona como un
**servicio Postgres gestionado** dentro del proyecto Railway. `docker-compose.yml` se conserva
para **desarrollo local** únicamente.

- [ ] **Provisionar Postgres en Railway:** en el proyecto → *New* → *Database* → *PostgreSQL*.
      Railway expone `DATABASE_URL` en ese servicio.

- [ ] **Conectar API ↔ DB:** en el servicio API, `DATABASE_URL=${{Postgres.DATABASE_URL}}`
      (referencia entre servicios; usa la red privada de Railway).

- [ ] **Prisma 7 + `@prisma/adapter-pg`:** verificar que la `DATABASE_URL` de Railway funciona con
      el adaptador `pg`. Postgres de Railway acepta SSL; si el adaptador lo exige, añadir
      `?sslmode=require` a la URL. Probar `SELECT 1` vía `/api/health`.

- [ ] **Aplicar migraciones en producción:** `prisma migrate deploy` (script `pnpm db:migrate`).
      Integrarlo en el arranque (`start:prod`) o como paso de release. **No** usar `db:push` ni
      `migrate dev` en prod.

- [ ] **Seed (opcional):** `pnpm db:seed` crea los dos usuarios semilla (incluye
      `admin@gastronomada.com`). Ejecutar **una vez** manualmente vía `railway run pnpm db:seed`
      o desde una shell del servicio; **no** dejarlo en el arranque para no re-sembrar en cada deploy.
      Recordar: seed usa `tsx --env-file=.env` → en Railway usar `railway run` (inyecta envs) o
      quitar el `--env-file`.

- [ ] **`docker-compose.yml` (local):** revisar/ajustar para desarrollo:
      credenciales locales (`postgres` / `Admin123.` / db `portfolio`), puerto `5432`.
      Documentar que en local `DATABASE_URL=postgresql://postgres:Admin123.@localhost:5432/portfolio`.
      No subir credenciales de prod aquí.

- [ ] **Backups:** activar backups del Postgres de Railway (o plan de export periódico).

---

## Tarea 4 — Subir a Git en la rama `production`

- [ ] Estás en la rama `production`. Verificar estado limpio y que **no hay secretos** en el diff:
      ```bash
      git status
      git diff
      ```
- [ ] Confirmar que `.env` **no** está trackeado (`git ls-files | grep .env` no debe listar `.env`,
      solo `.env.example`).
- [ ] Añadir los cambios de las tareas 1–3 (`package.json`, `.env.example`, `Dockerfile` si aplica,
      `docker-compose.yml`, `src/config/env.ts` si se limpian vars, este `.md`).
- [ ] Commit descriptivo y push:
      ```bash
      git add -A
      git commit -m "chore(deploy): preparar backend para produccion en Railway"
      git push origin production
      ```
- [ ] En Railway, conectar el repo y fijar la rama de deploy a **`production`**
      (auto-deploy en cada push a esa rama).

---

## Checklist final de verificación (post-deploy)

- [ ] `GET https://<backend>.up.railway.app/api/health` → `status: UP`, `database: UP`.
- [ ] Login better-auth desde el front real (CORS con `credentials`) funciona.
- [ ] Migraciones aplicadas (tablas creadas).
- [ ] Swagger **desactivado** en prod (`SWAGGER_ENABLED=false`).
- [ ] `NODE_ENV=production` (CSP/HSTS activos).
- [ ] Actualizar `FRONT.md` con la URL real del backend y cualquier cambio de contrato.
