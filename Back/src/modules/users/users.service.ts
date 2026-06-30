import type { PublicUser, UserRepository } from './users.repository.js';

// Lógica del buscador de usuarios. El alcance público (sin email) lo garantiza
// el repositorio; aquí solo se orquesta la búsqueda excluyendo al propio usuario.
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  buscar(query: string, limit: number, currentUserId: string): Promise<PublicUser[]> {
    return this.repository.search(query, limit, currentUserId);
  }
}
