"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatHora } from "@/lib/format";
import { selectConversacion, useBuzonStore } from "@/lib/stores/buzon-store";

export default function Conversacion({ usuario }: { usuario: string }) {
  const conversacion = useBuzonStore(selectConversacion(usuario));
  const enviarMensaje = useBuzonStore((s) => s.enviarMensaje);
  const marcarConversacionLeida = useBuzonStore((s) => s.marcarConversacionLeida);

  const [borrador, setBorrador] = useState("");
  const finRef = useRef<HTMLDivElement>(null);

  const mensajes = conversacion?.mensajes ?? [];
  const numMensajes = mensajes.length;

  // Marca el hilo como leído al abrirlo y cuando llegan mensajes nuevos.
  useEffect(() => {
    marcarConversacionLeida(usuario);
  }, [usuario, numMensajes, marcarConversacionLeida]);

  // Mantiene el scroll al final (comportamiento de chat).
  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end" });
  }, [numMensajes]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const texto = borrador.trim();
    if (!texto) return;
    // En el futuro: `await api.post("/buzon/" + usuario, { texto })`.
    enviarMensaje(usuario, texto);
    setBorrador("");
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
        <form
          onSubmit={onSubmit}
          className="flex shrink-0 items-center gap-2 border-t border-app-border p-3"
        >
          <input
            type="text"
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder={`Escribe a ${usuario}…`}
            aria-label="Mensaje"
            className="flex-1 rounded-full border border-app-border bg-surface-2 px-4 py-2.5 text-sm text-surface-fg placeholder:text-surface-muted outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
          <button
            type="submit"
            disabled={!borrador.trim()}
            aria-label="Enviar"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg transition hover:bg-brand/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="size-5" />
          </button>
        </form>
      </div>
    </main>
  );
}
