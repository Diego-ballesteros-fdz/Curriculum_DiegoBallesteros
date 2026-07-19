import type { NextConfig } from "next";

/**
 * URL interna del backend (Fastify + better-auth). Server-only (no `NEXT_PUBLIC_`):
 * el navegador nunca habla directo con el back. Las rutas de auth se reescriben a
 * través de Next, de modo que la cookie de sesión queda en ESTE origen y el SSR
 * (`getSession`) y el middleware pueden leerla. En producción, apúntala al
 * dominio real del backend.
 */
const rawBackend = process.env.BACKEND_URL || "http://localhost:4000";

/**
 * Vercel exige que el `destination` de un rewrite empiece por `/`, `http://` o
 * `https://`. Si `BACKEND_URL` viene sin esquema (p. ej. `mi-backend.com`), se
 * asume `https://`; además se quita la barra final para no duplicarla con
 * `/api/...`.
 */
const BACKEND_URL = (
  /^https?:\/\//.test(rawBackend) ? rawBackend : `https://${rawBackend}`
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Proxy de TODA la API al backend (auth + dominio: recetas, foro, buzón).
      // Al ir por el mismo origen del front, la cookie httpOnly de sesión viaja
      // sin problemas de CORS y el SSR/middleware pueden leerla. No hay rutas
      // `app/api/*` propias del front, así que el catch-all no colisiona.
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
