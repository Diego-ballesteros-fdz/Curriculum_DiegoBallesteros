import { BetterAuthOptions } from 'better-auth';

import { env } from '@/config/env.js';

// Solo se registra el proveedor de Google si sus credenciales están presentes.
export const socialProviders: BetterAuthOptions['socialProviders'] =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          prompt: 'select_account',
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};
