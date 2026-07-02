import { z } from 'zod';

export const baseSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number(),
  HOST: z.string(),
  API_PREFIX: z.string(),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  ALLOWED_ORIGINS: z.string().optional(), // "https://app.com,https://admin.com"
  INTERNAL_IPS: z.string().optional(), // "10.0.0.1,10.0.0.2"
  CDN_URL: z.url().optional(),
  API_URL: z.url().optional(),
  CSP_REPORT_URI: z.url().optional(),

  BACKEND_URL: z.string(),
  FRONTEND_URL: z.string(),
  FRONTEND_URL_WWW: z.string(),

  // Base de Datos
  DATABASE_URL: z.string(),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  DEV_EMAIL: z.string(),

  // Rate limiting
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_WINDOW: z.string().default('1 minute'),

  // Swagger — z.coerce.boolean() convierte cualquier string no vacío (incl. "false") en true,
  // así que parseamos el string explícitamente.
  SWAGGER_ENABLED: z
    .string()
    .default('false')
    .transform((v) => v === 'true' || v === '1'),
});

export const envSchema = baseSchema;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Variables de entorno inválidas:', parsed.error.flatten());
  process.exit(1);
}

export const env = parsed.data;
export type AppConfig = z.infer<typeof envSchema>;
