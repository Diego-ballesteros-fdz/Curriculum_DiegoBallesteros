/** Rol del usuario en la plataforma (red social). */
export type RolUsuario = "MIEMBRO" | "NO_MIEMBRO";

/**
 * Usuario expuesto a la sesión. Refleja el objeto `user` que devuelve el backend
 * (better-auth + `customSession`): sin datos sensibles, con `rol` e
 * `isSuperAdmin` para el gating de UI.
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  rol: RolUsuario;
  isSuperAdmin: boolean;
}
