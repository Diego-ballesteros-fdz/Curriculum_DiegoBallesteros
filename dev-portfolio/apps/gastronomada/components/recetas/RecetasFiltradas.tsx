"use client";

import RecipeGrid from "@/components/recetas/RecipeGrid";
import { useRecetas } from "@/hooks/useRecetas";
import type { RecetaFiltros } from "@/lib/api/recetas";

/**
 * Lista de recetas filtradas desde el backend, con estados de carga, error y
 * vacío. Reutilizable por las páginas de categoría/país (cada una pasa su
 * filtro). Sustituye a los `<img>` estáticos y al catálogo hardcodeado.
 */
export default function RecetasFiltradas({
  filtro,
  textoVacio = "Todavía no hay recetas aquí.",
}: {
  filtro?: RecetaFiltros;
  textoVacio?: string;
}) {
  const { recetas, isLoading, error } = useRecetas(filtro);

  if (isLoading) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-app-fg-muted">
        Cargando recetas…
      </p>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-destructive"
      >
        {error}
      </p>
    );
  }

  if (recetas.length === 0) {
    return (
      <p className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-app-fg-muted">
        {textoVacio}
      </p>
    );
  }

  return <RecipeGrid recetas={recetas} />;
}
