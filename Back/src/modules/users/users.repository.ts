import type { PrismaClient } from '@prisma/client';

// ==========================================
// REPOSITORIO DE USUARIOS (lectura pública)
// ==========================================
//
// Acceso de SOLO LECTURA a datos públicos del usuario (id, name, image). No
// expone email ni campos sensibles. Lo usan el buscador de usuarios del buzón y
// la resolución de menciones del foro. La gestión de la cuenta la sigue llevando
// Better Auth.

export interface PublicUser {
  id: string;
  name: string;
  image: string | null;
}

const PUBLIC_SELECT = { id: true, name: true, image: true } as const;

function toPublic(u: { id: string; name: string | null; image: string | null }): PublicUser {
  return { id: u.id, name: u.name ?? '', image: u.image };
}

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  /** Busca usuarios activos cuyo nombre contiene `query` (insensible a mayúsculas). */
  async search(query: string, limit: number, excludeUserId?: string): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        name: { contains: query, mode: 'insensitive' },
        ...(excludeUserId ? { id: { not: excludeUserId } } : {}),
      },
      select: PUBLIC_SELECT,
      take: limit,
      orderBy: { name: 'asc' },
    });
    return users.map(toPublic);
  }

  async findById(id: string): Promise<PublicUser | null> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: PUBLIC_SELECT });
    return user ? toPublic(user) : null;
  }

  /** Resuelve una mención `@token`: coincidencia exacta de nombre (case-insensitive). */
  async findByName(name: string): Promise<PublicUser | null> {
    const user = await this.prisma.user.findFirst({
      where: { isActive: true, name: { equals: name, mode: 'insensitive' } },
      select: PUBLIC_SELECT,
    });
    return user ? toPublic(user) : null;
  }
}
