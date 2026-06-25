/**
 * Configuración central de la sesión.
 *
 * Implementación mock con mecánica real (cookie httpOnly firmada + middleware),
 * pensada para sustituirse por better-auth + backend REST sin tocar la UI.
 */

/** Nombre de la cookie de sesión. */
export const SESSION_COOKIE = "gn_session";

/** Nombre de la cookie de preferencia de tema (no sensible). */
export const THEME_COOKIE = "gn_tema";

/** Duración de la sesión en segundos (7 días). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Rutas públicas accesibles sin sesión. El resto del sitio requiere sesión. */
export const RUTAS_PUBLICAS = [
  "/",
  "/pages/login",
  "/pages/registro",
  "/pages/recuperar-contrasena",
  "/pages/restablecer-contrasena",
];

/** Rutas de autenticación: si ya hay sesión, se redirige fuera de ellas. */
export const RUTAS_AUTH = [
  "/pages/login",
  "/pages/registro",
  "/pages/recuperar-contrasena",
  "/pages/restablecer-contrasena",
];

export function esRutaPublica(pathname: string): boolean {
  return RUTAS_PUBLICAS.includes(pathname);
}

export function esRutaAuth(pathname: string): boolean {
  return RUTAS_AUTH.includes(pathname);
}
