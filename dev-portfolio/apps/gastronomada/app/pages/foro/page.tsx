import type { Metadata } from "next";

import ForoMensajes from "@/components/foro/ForoMensajes";
import { getMensajesForo } from "@/lib/data/foro";

export const metadata: Metadata = {
  title: "GastroNómada — Foro gastronómico",
};

export default async function Foro() {
  const mensajes = await getMensajesForo();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-app-fg">Foro gastronómico</h1>
        <p className="mt-3 text-sm leading-relaxed text-app-fg-muted">
          ¡Nos alegra tenerte aquí! Este es el punto de encuentro para compartir, debatir y aprender
          sobre todo lo relacionado con la gastronomía, desde principiantes hasta chefs
          experimentados. ¿Tienes una pregunta o quieres compartir una experiencia? Únete a la
          conversación.
        </p>
      </header>

      <ForoMensajes initial={mensajes} />
    </main>
  );
}
