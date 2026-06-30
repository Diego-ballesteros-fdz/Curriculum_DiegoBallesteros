import type { FastifyInstance } from 'fastify';

import { env } from '@/config/env.js';
import buzonRoutes from '@/modules/buzon/buzon.routes.js';
import foroRoutes from '@/modules/foro/foro.routes.js';
import healthRoutes from '@/modules/health/health.routes.js';
import recetaRoutes from '@/modules/receta/receta.routes.js';
import type { RateLimitTier } from '@/plugins/02.security.js';

declare module 'fastify' {
  interface FastifyInstance {
    rateLimitTiers: RateLimitTier;
  }
}

export default async function routes(fastify: FastifyInstance) {
  fastify.register(healthRoutes, { prefix: `${env.API_PREFIX}/health` });

  // Las rutas de autenticación las sirve el plugin 08.better-auth (catch-all).
  // Módulos de dominio de la red social:
  fastify.register(recetaRoutes, { prefix: `${env.API_PREFIX}/recetas` });
  fastify.register(foroRoutes, { prefix: `${env.API_PREFIX}/foro` });
  fastify.register(buzonRoutes, { prefix: `${env.API_PREFIX}/buzon` });

  fastify.log.info('Routes ready');
}
