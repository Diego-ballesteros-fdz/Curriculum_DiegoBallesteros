import { createAuthClient } from "better-auth/react";

/**
 * Cliente de autenticación (better-auth).
 *
 * `baseURL` se toma de `NEXT_PUBLIC_AUTH_URL`. Mientras no exista backend
 * dedicado, queda `undefined` y better-auth usa el mismo origen. Cuando el
 * backend REST se despliegue por separado, basta con definir esa variable de
 * entorno: ni los formularios ni el resto de la app necesitan cambios.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword } =
  authClient;
