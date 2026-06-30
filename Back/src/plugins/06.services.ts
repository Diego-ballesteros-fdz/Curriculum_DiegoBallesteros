import fp from 'fastify-plugin';

import { AuthService } from '@/modules/auth/auth.service.js';
import { BuzonService } from '@/modules/buzon/buzon.service.js';
import { EmailService } from '@/modules/email/email.service.js';
import { ForoService } from '@/modules/foro/foro.service.js';
import { RecetaService } from '@/modules/receta/receta.service.js';

export default fp(
  async (fastify) => {
    const emailService = new EmailService(fastify.prisma, fastify.log);
    const authService = new AuthService(fastify.prisma, fastify.log);

    fastify.decorate('emailService', emailService);
    fastify.decorate('authService', authService);

    // Servicios de dominio (consumen los repositorios del plugin 05).
    fastify.decorate('recetaService', new RecetaService(fastify.recetaRepository));
    fastify.decorate('foroService', new ForoService(fastify.mensajeRepository));
    fastify.decorate('buzonService', new BuzonService(fastify.conversacionRepository));

    fastify.log.info('Services ready');
  },
  {
    name: 'services',
    dependencies: ['prisma', 'config', 'repositories'],
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    emailService: EmailService;
    authService: AuthService;
    recetaService: RecetaService;
    foroService: ForoService;
    buzonService: BuzonService;
  }
}
