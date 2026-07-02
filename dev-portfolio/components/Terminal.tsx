import type { ReactNode } from "react";

/**
 * Chrome de la ventana de terminal: barra de título con semáforo + cuerpo.
 * Componente puramente presentacional y reutilizable (acepta children).
 */
export default function Terminal({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-term-border bg-term-surface shadow-2xl">
      {/* Barra de título */}
      <div className="flex items-center gap-2 border-b border-term-border bg-term-bar px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-term-red" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-term-amber" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-term-green" aria-hidden />
        <span className="ml-3 select-none text-sm text-term-dim">{title}</span>
      </div>

      {/* Cuerpo */}
      <div className="px-5 py-6 text-sm leading-relaxed sm:px-8 sm:py-8">
        {children}
      </div>
    </div>
  );
}
