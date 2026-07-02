import type { Metadata } from "next";
import { Suspense } from "react";

import GastronomiaMundoView from "@/components/recetas/GastronomiaMundoView";

export const metadata: Metadata = {
  title: "GastroNómada — Gastronomía del mundo",
};

export default function GastronomiaMundo() {
  // `GastronomiaMundoView` usa `useSearchParams`, que Next exige envolver en un
  // límite de Suspense para no forzar el renderizado dinámico de toda la página.
  return (
    <Suspense
      fallback={
        <p className="mx-auto max-w-6xl px-4 py-12 text-center text-sm text-app-fg-muted">
          Cargando…
        </p>
      }
    >
      <GastronomiaMundoView />
    </Suspense>
  );
}
