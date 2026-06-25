"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Heart,
  MessageSquare,
  UserPlus,
  Info,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { formatFecha } from "@/lib/format";
import type { TipoNotificacion } from "@/lib/schemas/buzon";
import {
  selectMensajesNoLeidos,
  selectNotificacionesNoLeidas,
  useBuzonStore,
} from "@/lib/stores/buzon-store";

type Tab = "mensajes" | "notificaciones";

const ICONO_NOTIFICACION: Record<TipoNotificacion, typeof Bell> = {
  seguidor: UserPlus,
  comentario: MessageSquare,
  like: Heart,
  sistema: Info,
};

export default function Buzon() {
  // Estado visual (pestaña): se queda en useState, no en el store.
  const [tab, setTab] = useState<Tab>("mensajes");

  const conversaciones = useBuzonStore((s) => s.conversaciones);
  const notificaciones = useBuzonStore((s) => s.notificaciones);
  const conectado = useBuzonStore((s) => s.conectado);
  const marcarNotificacionLeida = useBuzonStore((s) => s.marcarNotificacionLeida);
  const marcarTodoLeido = useBuzonStore((s) => s.marcarTodoLeido);
  const recibirMensaje = useBuzonStore((s) => s.recibirMensaje);
  const recibirNotificacion = useBuzonStore((s) => s.recibirNotificacion);

  const mensajesNoLeidos = useBuzonStore(selectMensajesNoLeidos);
  const notifsNoLeidas = useBuzonStore(selectNotificacionesNoLeidas);

  /**
   * Demo: simula un frame entrante del WebSocket disparando las mismas acciones
   * del store que usará `conectarBuzon` (ver lib/realtime/buzon-socket.ts). En
   * "mensajes" llega de "carmen": crea su conversación y, con la ruta dinámica,
   * su página.
   */
  function simularEntrante() {
    if (tab === "mensajes") {
      recibirMensaje("carmen", {
        id: crypto.randomUUID(),
        texto: "¡Hola! Soy Carmen, ¿me pasas la receta del bao de cangrejo?",
        fecha: new Date().toISOString(),
      });
    } else {
      recibirNotificacion({
        id: crypto.randomUUID(),
        tipo: "like",
        texto: "A alguien le ha gustado una de tus recetas.",
        fecha: new Date().toISOString(),
        leido: false,
      });
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-app-fg">Buzón de entrada</h1>
          <p className="mt-1 flex items-center gap-2 text-xs text-app-fg-muted">
            <span
              className={cn(
                "size-2 rounded-full",
                conectado ? "bg-green-500" : "bg-app-fg-muted",
              )}
            />
            {conectado ? "Conectado en vivo" : "Sin conexión en vivo"}
          </p>
        </div>
        <button
          type="button"
          onClick={marcarTodoLeido}
          className="inline-flex items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-surface-fg shadow-sm transition-colors hover:bg-surface-2"
        >
          <CheckCheck className="size-4" />
          Marcar todo como leído
        </button>
      </header>

      {/* Pestañas */}
      <div className="mb-4 flex gap-2">
        <TabButton
          active={tab === "mensajes"}
          onClick={() => setTab("mensajes")}
          label="Mensajes"
          count={mensajesNoLeidos}
        />
        <TabButton
          active={tab === "notificaciones"}
          onClick={() => setTab("notificaciones")}
          label="Notificaciones"
          count={notifsNoLeidas}
        />
      </div>

      {/* Lista */}
      <section className="space-y-2">
        {tab === "mensajes" &&
          (conversaciones.length === 0 ? (
            <Vacio texto="No tienes conversaciones." />
          ) : (
            conversaciones.map((c) => {
              const ultimo = c.mensajes[c.mensajes.length - 1];
              const noLeidos = c.mensajes.filter((m) => !m.leido).length;
              return (
                <Link
                  key={c.usuario}
                  href={`/pages/buzon/${encodeURIComponent(c.usuario)}`}
                  className={cn(
                    "flex w-full gap-3 rounded-xl border-l-4 p-4 text-left shadow-sm transition-colors",
                    noLeidos > 0
                      ? "border-brand bg-surface"
                      : "border-transparent bg-surface-2 hover:bg-surface",
                  )}
                >
                  <Avatar inicial={c.usuario.charAt(0)} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-surface-fg",
                          noLeidos > 0 ? "font-bold" : "font-medium",
                        )}
                      >
                        {c.usuario}
                      </span>
                      <time className="ml-auto shrink-0 text-xs text-surface-muted">
                        {formatFecha(ultimo.fecha)}
                      </time>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 truncate text-sm",
                        noLeidos > 0 ? "text-surface-fg" : "text-surface-muted",
                      )}
                    >
                      {ultimo.propio && "Tú: "}
                      {ultimo.texto}
                    </p>
                  </div>
                  {noLeidos > 0 && (
                    <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand px-1 text-xs font-bold text-brand-fg">
                      {noLeidos}
                    </span>
                  )}
                </Link>
              );
            })
          ))}

        {tab === "notificaciones" &&
          (notificaciones.length === 0 ? (
            <Vacio texto="No tienes notificaciones." />
          ) : (
            notificaciones.map((n) => {
              const Icono = ICONO_NOTIFICACION[n.tipo];
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => marcarNotificacionLeida(n.id)}
                  className={cn(
                    "flex w-full gap-3 rounded-xl border-l-4 p-4 text-left shadow-sm transition-colors",
                    n.leido
                      ? "border-transparent bg-surface-2 hover:bg-surface"
                      : "border-brand bg-surface",
                  )}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                    <Icono className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <time className="ml-auto shrink-0 text-xs text-surface-muted">
                        {formatFecha(n.fecha)}
                      </time>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 break-words text-sm",
                        n.leido ? "text-surface-muted" : "text-surface-fg",
                      )}
                    >
                      {n.texto}
                    </p>
                  </div>
                  {!n.leido && (
                    <span className="mt-1 size-2.5 shrink-0 rounded-full bg-brand" />
                  )}
                </button>
              );
            })
          ))}
      </section>

      {/* Demo de tiempo real (provisional hasta el WebSocket). */}
      <button
        type="button"
        onClick={simularEntrante}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-app-fg-muted transition-colors hover:text-brand"
      >
        <Plus className="size-4" />
        Simular {tab === "mensajes" ? "mensaje" : "notificación"} entrante
      </button>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-brand text-brand-fg"
          : "bg-surface text-surface-fg hover:bg-surface-2",
      )}
    >
      {label}
      {count > 0 && (
        <span
          className={cn(
            "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-bold",
            active ? "bg-brand-fg text-brand" : "bg-brand text-brand-fg",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function Avatar({ inicial }: { inicial: string }) {
  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-fg">
      {inicial.toUpperCase()}
    </span>
  );
}

function Vacio({ texto }: { texto: string }) {
  return (
    <p className="rounded-xl bg-surface-2 p-8 text-center text-sm text-surface-muted">
      {texto}
    </p>
  );
}
