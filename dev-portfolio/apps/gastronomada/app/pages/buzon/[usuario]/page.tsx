import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Conversacion from "@/components/buzon/Conversacion";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "GastroNómada — Conversación",
};

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ usuario: string }>;
}) {
  const { usuario } = await params;

  // Solo el dueño del buzón accede a sus conversaciones. Aquí garantizamos la
  // sesión; el backend, además, deberá comprobar que la conversación pertenece
  // al usuario autenticado (responder 403 si no) y no fiarse del slug de la URL.
  const session = await getSession();
  if (!session) {
    redirect(`/pages/login?redirect=/pages/buzon/${encodeURIComponent(usuario)}`);
  }

  // Un usuario no puede abrir una conversación consigo mismo.
  if (session.user.usuario === decodeURIComponent(usuario)) {
    redirect("/pages/buzon");
  }

  return <Conversacion usuario={decodeURIComponent(usuario)} />;
}
