import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ForoMensajes from "@/components/foro/ForoMensajes";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "GastroNómada — Foro gastronómico",
};

export default async function Foro() {
  // Publicar requiere sesión; el autor del comentario es el usuario autenticado.
  const session = await getSession();
  if (!session) redirect("/gastronomada/login?redirect=/gastronomada/foro");

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

      <ForoMensajes autor={session.user.name} />
    </main>
  );
}
