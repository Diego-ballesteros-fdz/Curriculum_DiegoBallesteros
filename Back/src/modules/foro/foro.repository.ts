import { Mensaje, PrismaClient } from '@prisma/client';

import { BaseRepository } from '@/repositories/base.repository.js';

// Repositorio de mensajes del foro.
export class MensajeRepository extends BaseRepository<Mensaje> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'mensaje');
  }
}
