"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatHora } from "@/lib/format";
import {
  enviarMensajeBuzon,
  getHilo,
  marcarHiloLeido,
} from "@/lib/api/buzon";
import { ApiError } from "@/lib/api/http";
import { unirseAlHilo } from "@/lib/realtime/ws-client";
import { selectConversacion, useBuzonStore } from "@/lib/stores/buzon-store";

export default function Conversacion({ usuario }: { usuario: string }) {
  const conversacion = useBuzonStore(selectConversacion(usuario));
  const agregarMensaje = useBuzonStore((s) => s.agregarMensaje);
  const hidratarHilo = useBuzonStore((s) => s.hidratarHilo);
  const marcarConversacionLeida = useBuzonStore((s) => s.marcarConversacionLeida);

  const [borrador, setBorrador] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  const mensajes = conversacion?.mensajes ?? [];
  const numMensajes = mensajes.length;

  // Carga el hilo desde el backend al abrirlo y lo marca como leído (REST + local).
  // También se une al hilo por WebSocket para recibir mensajes en vivo (que el
  // store integra de forma global; este componente los lee del store).
  useEffect(() => {
    let activo = true;
    const salirDelHilo = unirseAlHilo(usuario);
    (async () => {
      try {
        const hilo = await getHilo(usuario);
        if (!activo) return;
        hidratarHilo(usuario, hilo.mensajes);
        marcarConversacionLeida(usuario);
        if (hilo.mensajes.length > 0) await marcarHiloLeido(usuario);
      } catch {
        // Si falla la carga, dejamos lo que ya hubiera en el store.
      }
    })();
    return () => {
      activo = false;
      salirDelHilo();
    };
  }, [usuario, hidratarHilo, marcarConversacionLeida]);

  // Mantiene el scroll al final (comportamiento de chat).
  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end" });
  }, [numMensajes]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const texto = borrador.trim();
    if (!texto || enviando) return;
    setError(null);
    setEnviando(true);
    try {
      const mensaje = await enviarMensajeBuzon(usuario, texto);
      agregarMensaje(usuario, mensaje);
      setBorrador("");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudo enviar el mensaje.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-4 py-6">
      <div className="flex max-h-[80vh] flex-1 flex-col overflow-hidden rounded-2xl bg-surface shadow-lg">
        {/* Cabecera */}
        <header className="flex shrink-0 items-center gap-3 border-b border-app-border p-4">
          <Link
            href="/pages/buzon"
            aria-label="Volver al buzón"
            className="flex size-9 items-center justify-center rounded-full text-surface-fg transition-colors hover:bg-surface-2"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-fg">
            {usuario.charAt(0).toUpperCase()}
          </span>
          <span className="font-bold text-surface-fg">{usuario}</span>
        </header>

        {/* Hilo (scrollable) */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {mensajes.length === 0 ? (
            <p className="py-8 text-center text-sm text-surface-muted">
              Aún no hay mensajes. ¡Escribe el primero!
            </p>
          ) : (
            mensajes.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.propio ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    m.propio
                      ? "rounded-br-sm bg-brand text-brand-fg"
                      : "rounded-bl-sm bg-surface-2 text-surface-fg",
                  )}
                >
                  <p className="break-words">{m.texto}</p>
                  <time
                    className={cn(
                      "mt-1 block text-right text-xs",
                      m.propio ? "text-brand-fg/60" : "text-surface-muted",
                    )}
                  >
                    {formatHora(m.fecha)}
                  </time>
                </div>
              </div>
            ))
          )}
          <div ref={finRef} />
        </div>

        {/* Redactar */}
        <div className="shrink-0 border-t border-app-border">
          {error && (
            <p role="alert" className="px-4 pt-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
          <form onSubmit={onSubmit} className="flex items-center gap-2 p-3">
            <input
              type="text"
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              placeholder={`Escribe a ${usuario}…`}
              aria-label="Mensaje"
              disabled={enviando}
              className="flex-1 rounded-full border border-app-border bg-surface-2 px-4 py-2.5 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!borrador.trim() || enviando}
              aria-label="Enviar"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg transition hover:bg-brand/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
