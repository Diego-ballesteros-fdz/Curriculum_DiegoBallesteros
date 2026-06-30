import type { Receta } from '@prisma/client';

import type { ScopeContext } from '@/types/base.types.js';
import { HttpError } from '@/utils/http.error.js';

import type { RecetaRepository } from './receta.repository.js';
import type { ActualizarRecetaInput, CrearRecetaInput, RecetaDTO } from './receta.schema.js';

export class RecetaService {
  constructor(private readonly repository: RecetaRepository) {}

  // Reconstruye la forma anidada del front desde las columnas aplanadas.
  // `imagen.alt` no se persiste: se deriva del nombre de la receta.
  private toDTO(r: Receta): RecetaDTO {
    return {
      id: r.id,
      nombre: r.nombre,
      tipo: r.tipo,
      pais: r.pais,
      imagen: { src: r.imagen, alt: r.nombre },
      detalle: {
        descripcion: r.descripcion,
        raciones: r.raciones ?? undefined,
        ingredientes: r.ingredientes,
        pasos: r.pasos,
      },
    };
  }

  async listar(
    scope: ScopeContext,
    page: { skip: number; take: number },
    filtros: { tipo?: 'tradicional' | 'moderna'; pais?: string } = {},
  ) {
    // Filtros opcionales por tipo y país; se combinan con el scope del usuario.
    const where: { tipo?: 'tradicional' | 'moderna'; pais?: string } = {};
    if (filtros.tipo) where.tipo = filtros.tipo;
    if (filtros.pais) where.pais = filtros.pais;

    const { data, total } = await this.repository.findManyWithCount({
      where,
      skip: page.skip,
      take: page.take,
      orderBy: { createdAt: 'desc' },
      scope,
    });
    return { data: data.map((r) => this.toDTO(r)), total };
  }

  async obtener(id: string, scope: ScopeContext): Promise<RecetaDTO> {
    const receta = await this.repository.findFirst({ where: { id }, scope });
    if (!receta) throw new HttpError(404, 'Receta no encontrada');
    return this.toDTO(receta);
  }

  async crear(input: CrearRecetaInput, userId: string): Promise<RecetaDTO> {
    const receta = await this.repository.create({
      data: {
        nombre: input.nombre,
        tipo: input.tipo,
        pais: input.pais,
        imagen: input.imagen.src,
        descripcion: input.detalle.descripcion,
        raciones: input.detalle.raciones ?? null,
        ingredientes: input.detalle.ingredientes,
        pasos: input.detalle.pasos,
        userId,
      },
    });
    return this.toDTO(receta);
  }

  async actualizar(
    id: string,
    input: ActualizarRecetaInput,
    scope: ScopeContext,
  ): Promise<RecetaDTO> {
    // Verifica propiedad dentro del scope antes de mutar.
    const existing = await this.repository.findFirst({ where: { id }, scope });
    if (!existing) throw new HttpError(404, 'Receta no encontrada');

    const data: Record<string, unknown> = {};
    if (input.nombre !== undefined) data.nombre = input.nombre;
    if (input.tipo !== undefined) data.tipo = input.tipo;
    if (input.pais !== undefined) data.pais = input.pais;
    if (input.imagen !== undefined) data.imagen = input.imagen.src;
    if (input.detalle !== undefined) {
      data.descripcion = input.detalle.descripcion;
      data.raciones = input.detalle.raciones ?? null;
      data.ingredientes = input.detalle.ingredientes;
      data.pasos = input.detalle.pasos;
    }

    const receta = await this.repository.update({ where: { id }, data });
    return this.toDTO(receta);
  }

  async eliminar(id: string, scope: ScopeContext): Promise<void> {
    const existing = await this.repository.findFirst({ where: { id }, scope });
    if (!existing) throw new HttpError(404, 'Receta no encontrada');
    await this.repository.delete({ where: { id } });
  }
}
