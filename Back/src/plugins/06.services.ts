import fp from 'fastify-plugin';

import { AuthService } from '@/modules/auth/auth.service.js';
import { BuzonService } from '@/modules/buzon/buzon.service.js';
import { EmailService } from '@/modules/email/email.service.js';
import { ForoService } from '@/modules/foro/foro.service.js';
import { NotificationService } from '@/modules/notification/notification.service.js';
import { RecetaService } from '@/modules/receta/receta.service.js';
import { UsersService } from '@/modules/users/users.service.js';

export default fp(
  async (fastify) => {
    const emailService = new EmailService(fastify.prisma, fastify.log);
    const authService = new AuthService(fastify.prisma, fastify.log);

    fastify.decorate('emailService', emailService);
    fastify.decorate('authService', authService);

    // Servicios de dominio (consumen los repositorios del plugin 05). Foro y
    // buzón reciben el `wsManager` (plugin 04) para difundir en tiempo real; el
    // foro además usa notificaciones + usuarios para resolver menciones, y el
    // buzón usa usuarios para la entrega cruzada de DMs.
    const notificationService = new NotificationService(
      fastify.notificationRepository,
      fastify.wsManager,
    );

    fastify.decorate('notificationService', notificationService);
    fastify.decorate('usersService', new UsersService(fastify.userRepository));
    fastify.decorate('recetaService', new RecetaService(fastify.recetaRepository));
    fastify.decorate(
      'foroService',
      new ForoService(
        fastify.mensajeRepository,
        fastify.wsManager,
        notificationService,
        fastify.userRepository,
      ),
    );
    fastify.decorate(
      'buzonService',
      new BuzonService(fastify.conversacionRepository, fastify.userRepository, fastify.wsManager),
    );

    fastify.log.info('Services ready');
  },
  {
    name: 'services',
    dependencies: ['prisma', 'config', 'repositories', 'websocket'],
  },
);

declare module 'fastify' {
  interface FastifyInstance {
    emailService: EmailService;
    authService: AuthService;
    recetaService: RecetaService;
    foroService: ForoService;
    buzonService: BuzonService;
    notificationService: NotificationService;
    usersService: UsersService;
  }
}