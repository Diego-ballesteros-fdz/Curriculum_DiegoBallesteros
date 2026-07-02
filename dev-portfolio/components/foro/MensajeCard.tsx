import { formatFecha } from "@/lib/format";
import type { MensajeForo } from "@/lib/schemas/foro";

export default function MensajeCard({
  mensaje,
  onResponder,
}: {
  mensaje: MensajeForo;
  onResponder: (autor: string) => void;
}) {
  const inicial = mensaje.autor.charAt(0).toUpperCase();

  return (
    <article className="flex gap-4 rounded-xl bg-surface p-4 shadow-sm">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-brand-fg">
        {inicial}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-semibold text-surface-fg">{mensaje.autor}</span>
          <time className="shrink-0 text-xs text-surface-muted">
            {formatFecha(mensaje.fecha)}
          </time>
        </div>
        <p className="mt-1 break-words text-sm text-surface-fg">{mensaje.texto}</p>
        <button
          type="button"
          onClick={() => onResponder(mensaje.autor)}
          className="mt-2 text-xs font-semibold text-brand transition-colors hover:text-surface-fg"
        >
          Responder
        </button>
      </div>
    </article>
  );
}
