import websocket from '@fastify/websocket';
import fp from 'fastify-plugin';

import { env } from '@/config/env.js';
import { createWSConnectionHandler } from '@/modules/ws/ws.handler.js';
import { WSManager } from '@/modules/ws/ws.manager.js';

// ==========================================
// PLUGIN WEBSOCKET (plugins/04.websocket.ts)
// ==========================================
//
// Se carga entre `03.prisma` y `05.repositorys`. Registra `@fastify/websocket`,
// crea el `WSManager` (singleton de sockets/rooms) y lo decora en la instancia
// para que los services puedan emitir difusiones. Monta la ruta `GET /api/ws`.
//
// El handler accede a `fastify.auth` / `fastify.foroService` / `fastify.buzonService`
// en tiempo de PETICIÓN (cuando llega una conexión/evento), no al registrar, así
// que no importa que esos decoradores los añadan plugins posteriores (08/06).

export default fp(
  async (fastify) => {
    await fastify.register(websocket);

    const manager = new WSManager(fastify.log);
    fastify.decorate('wsManager', manager);

    fastify.get(
      `${env.API_PREFIX}/ws`,
      { websocket: true },
      createWSConnectionHandler(fastify, manager),
    );

    fastify.log.info('WebSocket ready');
  },
  { name: 'websocket', dependencies: ['config'] },
);
