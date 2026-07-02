"use client";

import { useEffect, useState } from "react";

import { ApiError } from "@/lib/api/http";
import { listarRecetas, type RecetaFiltros } from "@/lib/api/recetas";
import type { Receta } from "@/lib/schemas/receta";

/**
 * Carga recetas del backend (`GET /api/recetas`) aplicando los filtros como
 * query params. El FILTRADO lo hace el backend: el hook solo consume y expone
 * `{ recetas, isLoading, error }`. No duplica lógica de filtrado en cliente.
 *
 * Lectura pública: devuelve TODAS las recetas que cumplen el filtro (de
 * cualquier autor). Para gestionar solo las propias, el perfil usa
 * `listarMisRecetas` directamente.
 */
export function useRecetas(filters?: RecetaFiltros): {
  recetas: Receta[];
  isLoading: boolean;
  error: string | null;
} {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Desestructuramos para que el efecto dependa de valores primitivos estables.
  const type = filters?.type;
  const pais = filters?.pais;

  useEffect(() => {
    let activo = true;
    // Diferimos el estado de carga fuera del cuerpo síncrono del efecto; el resto
    // de actualizaciones ocurren en los callbacks de la promesa.
    queueMicrotask(() => {
      if (!activo) return;
      setIsLoading(true);
      setError(null);
    });

    listarRecetas({ type, pais })
      .then((data) => {
        if (activo) setRecetas(data);
      })
      .catch((err) => {
        if (activo) {
          setError(
            err instanceof ApiError ? err.message : "No se pudieron cargar las recetas.",
          );
        }
      })
      .finally(() => {
        if (activo) setIsLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [type, pais]);

  return { recetas, isLoading, error };
}
