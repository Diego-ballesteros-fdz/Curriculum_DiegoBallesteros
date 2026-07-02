"use client";

import { useRouter, useSearchParams } from "next/navigation";

import RecetasFiltradas from "@/components/recetas/RecetasFiltradas";
import { PAISES, hrefPais, paisPorSlug } from "@/components/nav/paises";

/**
 * Vista única de "Gastronomía del mundo": un selector de país sustituye a las
 * antiguas rutas por país (`/espana`, …). El país activo vive en el query param
 * `?pais=<slug>` (lo leen también las banderas del nav), así que cambiarlo es un
 * `router.replace` — sin recarga de página. El filtrado de recetas lo hace el
 * backend a través de `RecetasFiltradas` (`useRecetas`), que reacciona al
 * cambio de `pais`. Si el país no tiene recetas, se muestra el estado vacío.
 */

const selectClass =
  "rounded-lg border border-app-border bg-surface px-3 py-2 text-sm text-surface-fg outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 cursor-pointer";

export default function GastronomiaMundoView() {
  const router = useRouter();
  const params = useSearchParams();

  // País activo: el del query param o, por defecto, el primero de la lista.
  const slug = params.get("pais") ?? PAISES[0].slug;
  const pais = paisPorSlug(slug) ?? PAISES[0];

  return (
    <article className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={pais.src}
            width={64}
            height={40}
            alt={`Bandera de ${pais.nombre}`}
            className="rounded border border-app-border"
          />
          <div>
            <h1 className="text-3xl font-bold text-app-fg">Cocina {pais.nombre}</h1>
            <p className="mt-1 text-sm text-app-fg-muted">
              Recetas de {pais.nombre} compartidas por la comunidad.
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-app-fg-muted">
          País:
          <select
            aria-label="Seleccionar país"
            className={selectClass}
            value={pais.slug}
            onChange={(e) => router.replace(hrefPais(e.target.value))}
          >
            {PAISES.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.nombre}
              </option>
            ))}
          </select>
        </label>
      </header>

      <RecetasFiltradas
        filtro={{ pais: pais.nombre }}
        textoVacio={`Todavía no hay recetas de ${pais.nombre}.`}
      />
    </article>
  );
}
