"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Receta } from "@/lib/schemas/receta";

/** Imagen + pie de una receta, reutilizada por la tarjeta simple y por el trigger del diálogo. */
function RecetaImagen({ receta }: { receta: Receta }) {
  return (
    <>
      <img
        src={receta.imagen.src}
        alt={receta.imagen.alt}
        className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <figcaption className="bg-surface p-3 text-center text-sm font-semibold text-surface-fg">
        {receta.nombre}
      </figcaption>
    </>
  );
}

export default function RecipeCard({ receta }: { receta: Receta }) {
  const { nombre, imagen, detalle } = receta;

  // Sin ficha completa: tarjeta estática (aún no es clicable).
  if (!detalle) {
    return (
      <figure className="group overflow-hidden rounded-xl shadow-md">
        <RecetaImagen receta={receta} />
      </figure>
    );
  }

  // Con ficha: la tarjeta abre el diálogo de detalle.
  return (
    <Dialog>
      <DialogTrigger className="group block w-full cursor-pointer overflow-hidden rounded-xl text-left shadow-md transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        <RecetaImagen receta={receta} />
      </DialogTrigger>

      <DialogContent className="grid max-w-4xl grid-rows-[14rem_1fr] md:grid-cols-2 md:grid-rows-1">
        {/* Imagen del plato */}
        <div className="relative h-full w-full overflow-hidden bg-surface-2">
          <img src={imagen.src} alt={nombre} className="h-full w-full object-cover" />
        </div>

        {/* Información de la receta (scrollable) */}
        <div className="flex max-h-[88vh] flex-col gap-5 overflow-y-auto p-6 md:p-8">
          <header>
            <DialogTitle>{nombre}</DialogTitle>
            {detalle.raciones && (
              <p className="mt-1 text-xs uppercase tracking-wide text-surface-muted">
                {detalle.raciones}
              </p>
            )}
          </header>

          <DialogDescription render={<p />} className="text-sm">
            {detalle.descripcion}
          </DialogDescription>

          <section>
            <h4 className="mb-2 text-lg font-semibold text-brand">Ingredientes</h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-surface-muted">
              {detalle.ingredientes.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="mb-2 text-lg font-semibold text-brand">Receta</h4>
            <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-surface-muted">
              {detalle.pasos.map((paso, i) => (
                <li key={i}>{paso}</li>
              ))}
            </ol>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
