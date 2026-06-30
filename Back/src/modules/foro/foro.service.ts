import type { Mensaje } from '@prisma/client';

import type { ScopeContext } from '@/types/base.types.js';
import { HttpError } from '@/utils/http.error.js';

import type { MensajeRepository } from './foro.repository.js';
import type { CrearMensajeForoInput, MensajeForoDTO } from './foro.schema.js';

export class ForoService {
  constructor(private readonly repository: MensajeRepository) {}

  private toDTO(m: Mensaje): MensajeForoDTO {
    return { id: m.id, autor: m.autor, texto: m.texto, fecha: m.fecha.toISOString() };
  }

  // Feed público: todos los mensajes, sin filtrar por propietario.
  async feed(page: { skip: number; take: number }) {
    const { data, total } = await this.repository.findManyWithCount({
      skip: page.skip,
      take: page.take,
      orderBy: { fecha: 'desc' },
    });
    return { data: data.map((m) => this.toDTO(m)), total };
  }

  async crear(input: CrearMensajeForoInput, userId: string): Promise<MensajeForoDTO> {
    const mensaje = await this.repository.create({
      data: { autor: input.autor, texto: input.texto, userId },
    });
    return this.toDTO(mensaje);
  }

  // Borrado por propiedad: el autor (OWN) o el admin (GLOBAL).
  async eliminar(id: string, scope: ScopeContext): Promise<void> {
    const existing = await this.repository.findFirst({ where: { id }, scope });
    if (!existing) throw new HttpError(404, 'Mensaje no encontrado');
    await this.repository.delete({ where: { id } });
  }
}
