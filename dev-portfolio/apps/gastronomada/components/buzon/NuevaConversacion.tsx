"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buscarUsuarios, type PublicUser } from "@/lib/api/users";

/**
 * Botón + diálogo para iniciar una conversación buscando un usuario real.
 *
 * Estado puramente visual (modal, query, resultados) → `useState`, no Zustand.
 * El buscador llama a `GET /api/users?search=` con debounce. Al elegir un
 * usuario, navega a su hilo (`/pages/buzon/<name>`), que se crea al enviar el
 * primer mensaje.
 */
export default function NuevaConversacion() {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState<PublicUser[]>([]);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const q = query.trim();
    // Todo el estado se actualiza dentro del callback con debounce (nunca de
    // forma síncrona en el cuerpo del efecto). Con <2 caracteres limpiamos ya.
    const timer = setTimeout(
      () => {
        if (q.length < 2) {
          setResultados([]);
          setBuscando(false);
          return;
        }
        setBuscando(true);
        buscarUsuarios(q)
          .then(setResultados)
          .catch(() => setResultados([]))
          .finally(() => setBuscando(false));
      },
      q.length < 2 ? 0 : 300,
    );
    return () => clearTimeout(timer);
  }, [query]);

  function cerrar(open: boolean) {
    setAbierto(open);
    if (!open) {
      setQuery("");
      setResultados([]);
    }
  }

  function abrirHilo(usuario: PublicUser) {
    cerrar(false);
    router.push(`/pages/buzon/${encodeURIComponent(usuario.name)}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-xs font-semibold text-brand-fg shadow-sm transition-colors hover:bg-brand/90"
      >
        <Plus className="size-4" />
        Nueva conversación
      </button>

      <Dialog open={abierto} onOpenChange={cerrar}>
        <DialogContent className="max-w-md">
          <div className="flex max-h-[80vh] flex-col gap-4 p-6">
            <DialogTitle className="text-xl">Nueva conversación</DialogTitle>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-surface-muted" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca un usuario por su nombre…"
                aria-label="Buscar usuario"
                className="w-full rounded-lg border border-app-border bg-surface-2 py-2.5 pl-9 pr-4 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>

            <div className="min-h-24 space-y-1 overflow-y-auto">
              {query.trim().length < 2 ? (
                <p className="px-1 py-6 text-center text-xs text-surface-muted">
                  Escribe al menos 2 caracteres para buscar.
                </p>
              ) : buscando ? (
                <p className="px-1 py-6 text-center text-xs text-surface-muted">Buscando…</p>
              ) : resultados.length === 0 ? (
                <p className="px-1 py-6 text-center text-xs text-surface-muted">
                  Sin resultados.
                </p>
              ) : (
                resultados.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => abrirHilo(u)}
                    className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-surface-2"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand font-bold text-brand-fg">
                      {u.image ? (
                        <img src={u.image} alt="" className="h-full w-full object-cover" />
                      ) : (
                        u.name.charAt(0).toUpperCase()
                      )}
                    </span>
                    <span className="truncate text-sm font-medium text-surface-fg">{u.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
