import { PrismaClient, Receta } from '@prisma/client';

import { BaseRepository } from '@/repositories/base.repository.js';

// Repositorio de recetas: hereda el CRUD con scope (OWN/GLOBAL) de BaseRepository.
export class RecetaRepository extends BaseRepository<Receta> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'receta');
  }
}
