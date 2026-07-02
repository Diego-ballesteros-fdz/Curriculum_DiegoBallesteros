import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

/**
 * Cliente de autenticación (better-auth).
 *
 * `baseURL` queda VACÍA a propósito: el cliente usa el mismo origen del front y
 * Next reescribe `/api/auth/*` hacia el backend (ver `next.config.ts`). Así la
 * cookie de sesión se asienta en este dominio y el SSR puede leerla. Solo define
 * `NEXT_PUBLIC_AUTH_URL` si algún día el cliente debe hablar directo con el back.
 *
 * `inferAdditionalFields` tipa los campos que el backend inyecta en la sesión vía
 * `customSession` (`rol`, `isSuperAdmin`). Van con `input: false` porque los
 * gestiona el servidor: no se envían en el registro.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        rol: { type: "string", input: false },
        isSuperAdmin: { type: "boolean", input: false },
      },
    }),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = authClient;
