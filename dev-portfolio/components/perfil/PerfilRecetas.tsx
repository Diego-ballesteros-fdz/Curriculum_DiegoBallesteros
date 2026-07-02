"use client";

import { useEffect, useState } from "react";
import { ChefHat, Pencil, Plus, Trash2 } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import RecetaForm from "@/components/perfil/RecetaForm";
import {
  actualizarReceta,
  crearReceta,
  eliminarReceta,
  listarMisRecetas,
  type RecetaFiltros,
} from "@/lib/api/recetas";
import { ApiError } from "@/lib/api/http";
import { cn } from "@/lib/utils";
import {
  PAISES_RECETA,
  TIPO_RECETA_LABEL,
  tipoRecetaSchema,
  type NuevaRecetaInput,
  type Receta,
} from "@/lib/schemas/receta";

/**
 * Panel de gestión de las recetas del usuario (página de perfil).
 *
 * Carga las recetas del usuario de la sesión (el backend ya las filtra por
 * propietario), permite filtrarlas por tipo/país, subir una nueva y editar o
 * eliminar las existentes. El estado de datos (recetas) vive aquí en `useState`
 * porque es local a esta vista; no necesita zustand (no se comparte ni es
 * tiempo real).
 */

const selectClass =
  "rounded-lg border border-app-border bg-surface px-3 py-2 text-sm text-surface-fg outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30";

export default function PerfilRecetas({ nombre }: { nombre: string }) {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<RecetaFiltros>({});

  const [formAbierto, setFormAbierto] = useState(false);
  const [editando, setEditando] = useState<Receta | null>(null);
  const [eliminandoId, setEliminandoId] = useState<string | null>(null);

  useEffect(() => {
    let activo = true;
    // El estado de carga se difiere fuera del cuerpo síncrono del efecto; el
    // resto de actualizaciones ocurren en los callbacks de la promesa.
    queueMicrotask(() => {
      if (activo) setCargando(true);
    });
    listarMisRecetas(filtros)
      .then((data) => {
        if (!activo) return;
        setRecetas(data);
        setError(null);
      })
      .catch((err) => {
        if (activo) {
          setError(
            err instanceof ApiError ? err.message : "No se pudieron cargar tus recetas.",
          );
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [filtros]);

  function abrirCrear() {
    setEditando(null);
    setFormAbierto(true);
  }

  function abrirEditar(receta: Receta) {
    setEditando(receta);
    setFormAbierto(true);
  }

  async function guardar(input: NuevaRecetaInput) {
    if (editando) {
      const actualizada = await actualizarReceta(editando.id, input);
      setRecetas((prev) => prev.map((r) => (r.id === actualizada.id ? actualizada : r)));
    } else {
      const creada = await crearReceta(input);
      setRecetas((prev) => [creada, ...prev]);
    }
    setFormAbierto(false);
    setEditando(null);
  }

  async function eliminar(receta: Receta) {
    if (!confirm(`¿Eliminar la receta «${receta.nombre}»?`)) return;
    setEliminandoId(receta.id);
    try {
      await eliminarReceta(receta.id);
      setRecetas((prev) => prev.filter((r) => r.id !== receta.id));
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo eliminar la receta.",
      );
    } finally {
      setEliminandoId(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-app-fg">Mi perfil</h1>
          <p className="mt-1 text-sm text-app-fg-muted">
            Hola, <span className="font-semibold">{nombre}</span>. Aquí gestionas tus recetas.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirCrear}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-fg shadow-sm transition hover:bg-brand/90 active:translate-y-px"
        >
          <Plus className="size-4" />
          Subir nueva receta
        </button>
      </header>

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-app-fg-muted">Filtrar:</span>
        <select
          aria-label="Filtrar por tipo"
          className={selectClass}
          value={filtros.type ?? ""}
          onChange={(e) =>
            setFiltros((f) => ({
              ...f,
              type: e.target.value ? (e.target.value as Receta["tipo"]) : undefined,
            }))
          }
        >
          <option value="">Todos los tipos</option>
          {tipoRecetaSchema.options.map((t) => (
            <option key={t} value={t}>
              {TIPO_RECETA_LABEL[t]}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por país"
          className={selectClass}
          value={filtros.pais ?? ""}
          onChange={(e) =>
            setFiltros((f) => ({ ...f, pais: e.target.value || undefined }))
          }
        >
          <option value="">Todos los países</option>
          {PAISES_RECETA.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p role="alert" className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Lista de recetas */}
      {cargando ? (
        <p className="rounded-xl bg-surface-2 p-8 text-center text-sm text-surface-muted">
          Cargando tus recetas…
        </p>
      ) : recetas.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-2 p-12 text-center">
          <ChefHat className="size-10 text-surface-muted" />
          <p className="text-sm text-surface-muted">
            {filtros.type || filtros.pais
              ? "No tienes recetas con esos filtros."
              : "Aún no has subido ninguna receta. ¡Anímate a compartir la primera!"}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recetas.map((receta) => (
            <li
              key={receta.id}
              className="group overflow-hidden rounded-xl bg-surface shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="relative h-40 w-full overflow-hidden bg-surface-2">
                {receta.imagen.src ? (
                  <img
                    src={receta.imagen.src}
                    alt={receta.imagen.alt}
                    className="h-full w-full object-cover"
                  />
                ) : null}
                <span className="absolute left-2 top-2 rounded-full bg-very-dark/70 px-2.5 py-1 text-xs font-semibold text-cream">
                  {TIPO_RECETA_LABEL[receta.tipo]}
                </span>
              </div>
              <div className="p-4">
                <h3 className="truncate font-semibold text-surface-fg">{receta.nombre}</h3>
                <p className="mt-0.5 text-xs text-surface-muted">{receta.pais}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => abrirEditar(receta)}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-xs font-semibold text-surface-fg transition hover:bg-app-bg"
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminar(receta)}
                    disabled={eliminandoId === receta.id}
                    className={cn(
                      "inline-flex items-center justify-center gap-1.5 rounded-lg bg-surface-2 px-3 py-2 text-xs font-semibold text-destructive transition hover:bg-destructive/10",
                      eliminandoId === receta.id && "opacity-60",
                    )}
                  >
                    <Trash2 className="size-3.5" />
                    {eliminandoId === receta.id ? "Eliminando…" : "Eliminar"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Diálogo de formulario (crear/editar) */}
      <Dialog
        open={formAbierto}
        onOpenChange={(open) => {
          setFormAbierto(open);
          if (!open) setEditando(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          {/* `key` reinicia el formulario al alternar entre crear y editar. */}
          <RecetaForm
            key={editando?.id ?? "nueva"}
            receta={editando ?? undefined}
            onGuardar={guardar}
            onCancelar={() => {
              setFormAbierto(false);
              setEditando(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
