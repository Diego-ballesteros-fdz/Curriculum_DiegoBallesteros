/**
 * Configuración de rutas y cookies del front.
 */

/**
 * Nombre de la cookie de sesión que pone better-auth (backend). El middleware
 * solo comprueba su PRESENCIA (filtro optimista); la validez la verifica el
 * backend a través de `getSession()`.
 */
export const AUTH_SESSION_COOKIE = "better-auth.session_token";

/** Nombre de la cookie de preferencia de tema (no sensible). */
export const THEME_COOKIE = "gn_tema";

/** Rutas públicas accesibles sin sesión. El resto del sitio requiere sesión. */
export const RUTAS_PUBLICAS = [
  "/gastronomada",
  "/gastronomada/login",
  "/gastronomada/registro",
  "/gastronomada/recuperar-contrasena",
  "/gastronomada/restablecer-contrasena",
];

/** Rutas de autenticación: si ya hay sesión, se redirige fuera de ellas. */
export const RUTAS_AUTH = [
  "/gastronomada/login",
  "/gastronomada/registro",
  "/gastronomada/recuperar-contrasena",
  "/gastronomada/restablecer-contrasena",
];

export function esRutaPublica(pathname: string): boolean {
  return RUTAS_PUBLICAS.includes(pathname);
}

export function esRutaAuth(pathname: string): boolean {
  return RUTAS_AUTH.includes(pathname);
}
