# FRONT.md — Estado del backend y guía de conexión Front ↔ Back

> Documento de referencia para conectar el frontend (Next.js / GastroNómada) con este
> backend (Fastify 5 + Prisma + better-auth). Refleja el estado **real** del back a día de hoy.
> Léelo antes de empezar la integración: marca lo que **ya funciona**, lo que **está pendiente**
> y las **discrepancias de contrato** que hay que resolver.

---

## 1. Estado actual (TL;DR)

| Área                                                                   | Estado                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------- |
| **Autenticación** (login, registro, sesión, logout, reset/verify)      | ✅ Operativa vía better-auth                      |
| **Sesión por cookie** (`better-auth.session_token`)                    | ✅                                                |
| **Rol de usuario** (`MIEMBRO` / `NO_MIEMBRO`) + admin (`isSuperAdmin`) | ✅ Expuesto en la sesión                          |
| **CORS con credenciales**                                              | ✅ Configurado                                    |
| **Health check**                                                       | ✅                                                |
| **Swagger / OpenAPI** (`/docs`)                                        | ✅ (si `SWAGGER_ENABLED=true`)                    |
| **Endpoints de dominio** (Recetas, Foro/Mensajes, Conversaciones)      | ✅ **Operativos** — ver §10 para el contrato REST |

**Empezar por aquí:** el back ya acepta **registro, login y sesión de usuarios**. La primera
integración del front debe ser el flujo de auth. Las **recetas, el foro y el buzón ya tienen API REST**
(`{API_PREFIX}/recetas`, `/foro`, `/buzon`); el detalle está en §10.

---

## 2. Configuración de conexión

El back se sirve en `BACKEND_URL` y **todas** las rutas cuelgan de un prefijo `API_PREFIX`.

| Variable (.env del back) | Ejemplo                 | Notas                                                                                               |
| ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------------- |
| `PORT`                   | `4000`                  | Puerto del back                                                                                     |
| `BACKEND_URL`            | `http://localhost:4000` | Origen del back (== `BETTER_AUTH_URL`)                                                              |
| `API_PREFIX`             | `/api`                  | Todas las rutas y el auth cuelgan de aquí (no está en `.env.example`, pero el valor real es `/api`) |
| `FRONTEND_URL`           | `http://localhost:3000` | **Debe coincidir con el origen del front** (CORS)                                                   |
| `FRONTEND_URL_WWW`       | —                       | Variante con www, opcional                                                                          |
| `ALLOWED_ORIGINS`        | —                       | Orígenes extra permitidos, separados por coma                                                       |
| `SWAGGER_ENABLED`        | `true`                  | Necesario para ver `/docs`                                                                          |

> ⚠️ **Importante:** la URL base de cualquier endpoint es **`{BACKEND_URL}{API_PREFIX}/...`**,
> y `API_PREFIX` es **`/api`**. Ejemplo en local: `http://localhost:4000/api/...`.
> En los ejemplos de abajo escribo `{API_PREFIX}` = `/api` (p. ej. el login es
> `http://localhost:4000/api/auth/sign-in/email`).

### Desde el front (Next.js)

- Define `NEXT_PUBLIC_AUTH_URL` apuntando al back. El cliente `better-auth/react` ya existe en
  `lib/auth-client.ts`.
- El `baseURL` del cliente de better-auth debe resolver a **`{BACKEND_URL}{API_PREFIX}/auth`**
  (ese es el `basePath` del back).

---

## 3. CORS y credenciales (clave para que la sesión funcione)

CORS está configurado con **`credentials: true`**. Para que la cookie de sesión viaje:

- **Toda** petición autenticada debe ir con credenciales:
  - `fetch(url, { credentials: 'include' })`
  - axios: `withCredentials: true`
  - El cliente de better-auth ya lo hace por defecto.
- El **origen del front debe estar permitido**. Se permiten:
  - `FRONTEND_URL`, `FRONTEND_URL_WWW`, `BACKEND_URL`, y los de `ALLOWED_ORIGINS`.
  - En `NODE_ENV=development` se permite **cualquier puerto de `localhost`** automáticamente.
- Cabeceras permitidas en request: `Content-Type`, `Authorization`, `Cookie`, `X-Request-ID`.
- Cabeceras expuestas: `Set-Cookie`, `X-Request-ID`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`.
- Métodos: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.

> Si el front corre en un origen no permitido, el back responde **"Not allowed by CORS"** y la
> cookie no se setea. Síntoma típico: login "ok" pero `get-session` devuelve `null`.

---

## 4. Autenticación (better-auth)

Todos los endpoints de auth cuelgan de **`{API_PREFIX}/auth/*`** y los gestiona better-auth.
La sesión se mantiene con una **cookie httpOnly** (no hay tokens en el body que haya que guardar).

### Endpoints principales

| Método | Ruta                                       | Body                               | Descripción                                   |
| ------ | ------------------------------------------ | ---------------------------------- | --------------------------------------------- |
| `POST` | `{API_PREFIX}/auth/sign-up/email`          | `{ email, password, name }`        | Registro. Envía email de verificación         |
| `POST` | `{API_PREFIX}/auth/sign-in/email`          | `{ email, password, rememberMe? }` | Login. Setea la cookie de sesión              |
| `POST` | `{API_PREFIX}/auth/sign-out`               | —                                  | Logout. Invalida la sesión/cookie             |
| `GET`  | `{API_PREFIX}/auth/get-session`            | —                                  | Devuelve la sesión actual o `null`            |
| `POST` | `{API_PREFIX}/auth/update-user`            | `{ name?, image?, ... }`           | Actualiza datos del usuario (requiere sesión) |
| `POST` | `{API_PREFIX}/auth/forget-password`        | `{ email, redirectTo? }`           | Inicia el reset de contraseña (email)         |
| `POST` | `{API_PREFIX}/auth/reset-password`         | `{ newPassword, token }`           | Completa el reset                             |
| `GET`  | `{API_PREFIX}/auth/verify-email?token=...` | —                                  | Verifica el email                             |

> Hay más endpoints estándar de better-auth (cambio de email, listar sesiones, etc.). La
> referencia completa y siempre actualizada está en el **plugin openAPI de better-auth** y en
> `/docs` (Swagger) cuando está habilitado.

### Google (social login)

- Disponible **solo si** el back tiene `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` configurados
  (hoy están comentados → **deshabilitado**). Endpoint: `POST {API_PREFIX}/auth/sign-in/social`.

### Política de contraseña (lo que el back **realmente** valida)

- Runtime: **mínimo 8 caracteres** (default de better-auth). No se exige símbolo/mayúscula a nivel de servidor.
- ⚠️ **Discrepancia de contratos** a unificar con el front:
  - `lib/schemas/auth.ts` (front) usa `PASSWORD_MIN_LENGTH = 11`.
  - `src/modules/auth/auth.schema.ts` (back, documentación) describe min 8 + may/min/dígito/símbolo,
    **pero esa validación no está activa** (las rutas tipadas de auth no se montan; manda better-auth).
  - **Acción recomendada:** decidir una política única y alinear front + config de better-auth.

### Verificación de email

- Al registrarse se **envía email de verificación** (`sendOnSignUp: true`, expira en 24h,
  auto-login tras verificar).
- Hoy **no se bloquea** el login por falta de verificación (no está activado
  `requireEmailVerification`). Tenlo en cuenta en el flujo del front.

---

## 5. Sesión y objeto `user`

`GET {API_PREFIX}/auth/get-session` (y el `useSession` del cliente) devuelve:

```jsonc
{
  "user": {
    "id": "uuid-v7",
    "email": "user@gastronomada.com",
    "name": "Usuario GastroNómada",
    "image": null,
    "emailVerified": true,
    "isSuperAdmin": false, // admin de plataforma (better-auth)
    "rol": "MIEMBRO", // "MIEMBRO" | "NO_MIEMBRO"
    "createdAt": "2026-...",
    "updatedAt": "2026-...",
  },
  "session": {
    "id": "uuid-v7",
    "userId": "uuid-v7",
    "token": "…",
    "expiresAt": "2026-...",
    "createdAt": "2026-...",
    "updatedAt": "2026-...",
    "ipAddress": "…",
    "userAgent": "…",
  },
}
```

- Sin sesión → `get-session` devuelve `null`.
- `isSuperAdmin` y `rol` se inyectan vía `customSession`; úsalos para gating de UI.
- Duración de sesión: **7 días** (con cache de cookie).

---

## 6. Roles y autorización

RBAC simplificado para red social (sin organizaciones ni equipos):

- **`rol`**: `MIEMBRO` | `NO_MIEMBRO` (campo del usuario, default `MIEMBRO`).
- **Admin**: `isSuperAdmin = true` (gestionado por better-auth). Es quien tiene acceso global.
- **Alcance de datos (cuando existan los endpoints de dominio):**
  - Usuario normal → **OWN**: solo ve/gestiona **sus propios** registros (filtrado por `userId`).
  - Superadmin → **GLOBAL**: ve/gestiona **todos** los registros.

El front debe asumir que cada usuario solo recibe **sus** recetas/conversaciones; el feed público
(si lo hay) será un endpoint específico cuando se implemente.

---

## 7. Rate limiting

Límites por IP y por tipo de ruta (ventana de 1 minuto):

| Tier     | Rutas                  | Límite                 |
| -------- | ---------------------- | ---------------------- |
| `auth`   | rutas de autenticación | **5 / min** (estricto) |
| `api`    | rutas `…/api…`         | 200 / min              |
| `public` | resto                  | 60 / min               |

- Respuesta al exceder (HTTP **429**):
  ```json
  {
    "statusCode": 429,
    "error": "Too Many Requests",
    "message": "Límite de N peticiones por minuto…",
    "retryAfter": 42
  }
  ```
- Cabeceras informativas: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`.
- better-auth añade su propio rate-limit interno además de este. **Cuidado con reintentos
  agresivos en el login** (5/min).

---

## 8. Formato de respuestas y errores

> ⚠️ **Discrepancia importante con el contrato del front.**
> El front (`lib/schemas/api.ts`) define un sobre `{ ok, data | error }` (`apiResponseSchema`).
> **El back NO implementa ese envelope todavía.** Las respuestas son:

- **Auth (better-auth):** objetos propios de better-auth (p. ej. `{ user, session }`) y, en error,
  JSON con `message` (algunos traducidos a ES).
- **Errores genéricos (Fastify / `HttpError`):** forma habitual
  ```json
  { "statusCode": 401, "error": "Unauthorized", "message": "Valid session required" }
  ```
- **Listados (futuros endpoints de dominio):** `{ data: [...], meta: { page, limit, total, totalPages } }`.

**Acción recomendada:** decidir si el back adopta el envelope `{ ok, data|error }` del front o si
el front se adapta a las formas anteriores. Hasta entonces, **no asumas `apiResponseSchema`** al
consumir el back.

---

## 9. Health check

- `GET {API_PREFIX}/health`
  ```json
  {
    "status": "UP",
    "timestamp": "…",
    "uptime": 123.4,
    "services": { "database": "UP", "email": "UP" }
  }
  ```
- `status`: `UP` | `DEGRADED` (email caído) | `DOWN` (BD caída → HTTP 503).
- Útil como ping de disponibilidad antes de habilitar funcionalidades.

---

## 10. Entidades de dominio (✅ endpoints REST)

Ya hay rutas REST. Todas cuelgan de `{API_PREFIX}` (`/api`) y, salvo el feed del foro, **requieren
sesión** (cookie). El acceso es por propietario: un usuario solo ve/gestiona **sus** registros
(scope OWN); el admin (`isSuperAdmin`) accede a todos (GLOBAL). Las respuestas **no** usan el sobre
`{ ok, data|error }`: los listados van como `{ data, meta }` y el resto como el objeto directo (§8).

### Recetas — `{API_PREFIX}/recetas`

La API **reforma** la receta a la forma del front (`lib/schemas/receta.ts`): reconstruye
`imagen: { src, alt }` (con `src` = el base64 guardado y `alt` derivado del `nombre`) y anida el
detalle en `detalle: { descripcion, raciones?, ingredientes[], pasos[] }`. **Decisión cerrada:** el
back se adapta al contrato del front; internamente sigue guardando `imagen` como base64 plano.

| Método   | Ruta                  | Auth | Cuerpo / Query                                | Respuesta                                         |
| -------- | --------------------- | ---- | --------------------------------------------- | ------------------------------------------------- |
| `GET`    | `/recetas?page&limit` | ✅   | —                                             | `{ data: Receta[], meta }` (solo las del usuario) |
| `GET`    | `/recetas/:id`        | ✅   | —                                             | `Receta`                                          |
| `POST`   | `/recetas`            | ✅   | `{ nombre, imagen:{src,alt}, detalle:{...} }` | `201` `Receta`                                    |
| `PUT`    | `/recetas/:id`        | ✅   | parcial de lo anterior (≥1 campo)             | `Receta`                                          |
| `DELETE` | `/recetas/:id`        | ✅   | —                                             | `204`                                             |

`Receta` (respuesta) = `{ id, nombre, imagen:{src,alt}, detalle:{descripcion, raciones?, ingredientes[], pasos[]} }`.

### Foro — `{API_PREFIX}/foro`

| Método   | Ruta               | Auth       | Cuerpo / Query                     | Respuesta                                           |
| -------- | ------------------ | ---------- | ---------------------------------- | --------------------------------------------------- |
| `GET`    | `/foro?page&limit` | ❌ público | —                                  | `{ data: MensajeForo[], meta }` (todos, fecha desc) |
| `POST`   | `/foro`            | ✅         | `{ autor (3-30), texto (1-1000) }` | `201` `MensajeForo`                                 |
| `DELETE` | `/foro/:id`        | ✅         | —                                  | `204` (solo autor o admin)                          |

`MensajeForo` = `{ id, autor, texto, fecha }` (`fecha` ISO 8601). Encaja con `lib/schemas/foro.ts`.

### Buzón — `{API_PREFIX}/buzon`

Bandeja **personal** (siempre filtrada por el usuario de la sesión). Cada `usuario` (handle) es el
id/slug del hilo. No hay modelo de notificaciones todavía, así que el snapshot devuelve
`notificaciones: []`.

| Método  | Ruta                    | Auth | Cuerpo               | Respuesta                                                          |
| ------- | ----------------------- | ---- | -------------------- | ------------------------------------------------------------------ |
| `GET`   | `/buzon`                | ✅   | —                    | `{ conversaciones: Conversacion[], notificaciones: [] }`           |
| `GET`   | `/buzon/:usuario`       | ✅   | —                    | `Conversacion` (hilo vacío si no existe aún)                       |
| `POST`  | `/buzon/:usuario`       | ✅   | `{ texto (1-1000) }` | `201` `MensajeChat` (lo crea el hilo si no existía; `propio:true`) |
| `PATCH` | `/buzon/:usuario/leido` | ✅   | —                    | `{ count }` (marca leídos los recibidos)                           |

`Conversacion` = `{ usuario, mensajes: MensajeChat[] }`;
`MensajeChat` = `{ id, texto, fecha, propio, leido }`. Encaja con `lib/schemas/buzon.ts`.

---

## 11. Swagger / OpenAPI

- UI: **`/docs`** (requiere `SWAGGER_ENABLED=true` en el `.env` del back).
- Seguridad documentada: cookie `better-auth.session_token`.
- Para los endpoints de auth, además, está el **reference de better-auth** (plugin openAPI).

---

## 12. Usuarios semilla (para pruebas)

Tras `pnpm db:seed`:

| Email                    | Rol       | Admin             | Password   |
| ------------------------ | --------- | ----------------- | ---------- |
| `admin@gastronomada.com` | `MIEMBRO` | ✅ `isSuperAdmin` | `Admin123` |
| `user@gastronomada.com`  | `MIEMBRO` | ❌                | `Admin123` |

> ⚠️ `Admin123` (8 chars, sin símbolo) **cumple** el mínimo del back (8) pero **no** el esquema del
> front (`min 11`). Si el front revalida el login con su zod, rechazará esta credencial en cliente.
> Usa una contraseña conforme o relaja la validación del front en desarrollo.

---

## 13. Checklist para empezar la conexión

1. `API_PREFIX` = **`/api`** (confirmado). Base de endpoints: `{BACKEND_URL}/api/...`.
2. Pon `FRONTEND_URL` (back) = origen real del front, y `NEXT_PUBLIC_AUTH_URL` (front) = `{BACKEND_URL}`.
3. Arranca el back: `pnpm dev`. Verifica `GET {API_PREFIX}/health` → `status: UP`.
4. (Opcional) `SWAGGER_ENABLED=true` y abre `/docs`.
5. `pnpm db:seed` para tener los dos usuarios de prueba.
6. Implementa **primero el flujo de auth** con `lib/auth-client.ts` (sign-up → sign-in → get-session → sign-out),
   siempre con **credenciales incluidas**.
7. Lee `session.user.rol` / `isSuperAdmin` para el gating de UI.
8. **Pendiente de back** antes de conectar recetas/foro/buzón: crear sus módulos REST (rutas/controlador/servicio).

### Decisiones pendientes que afectan al contrato (a cerrar entre front y back)

- [ ] Política de contraseña única (front pide 11; back valida 8).
- [x] **Envelope:** el back **no** adopta `{ ok, data|error }`. Listados = `{ data, meta }`; el resto,
      el objeto directo; errores = `{ statusCode, error, message }`. El front debe consumir estas formas
      (no `apiResponseSchema`) en los endpoints de dominio.
- [x] **`Receta.imagen`:** el back se adapta al front → responde `imagen:{src,alt}` + `detalle:{...}`
      (internamente sigue base64 plano; `alt` se deriva del `nombre`).
- [ ] ¿Se exigirá verificación de email para iniciar sesión? (hoy no).
