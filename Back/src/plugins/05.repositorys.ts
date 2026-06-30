import fp from 'fastify-plugin';

import { ConversacionRepository } from '@/modules/buzon/buzon.repository.js';
import { MensajeRepository } from '@/modules/foro/foro.repository.js';
import { RecetaRepository } from '@/modules/receta/receta.repository.js';

// Capa de repositorios de dominio (Receta/Mensaje/Conversacion). Cada uno
// envuelve su modelo Prisma con el CRUD por scope de BaseRepository.
export default fp(
  async (fastify) => {
    fastify.decorate('recetaRepository', new RecetaRepository(fastify.prisma));
    fastify.decorate('mensajeRepository', new MensajeRepository(fastify.prisma));
    fastify.decorate('conversacionRepository', new ConversacionRepository(fastify.prisma));

    fastify.log.info('Repositories ready');
  },
  { name: 'repositories', dependencies: ['prisma'] },
);

declare module 'fastify' {
  interface FastifyInstance {
    recetaRepository: RecetaRepository;
    mensajeRepository: MensajeRepository;
    conversacionRepository: ConversacionRepository;
  }
}
