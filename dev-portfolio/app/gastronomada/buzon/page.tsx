import type { Metadata } from "next";
import { redirect } from "next/navigation";

import Buzon from "@/components/buzon/Buzon";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "GastroNómada — Buzón de entrada",
};

export default async function BuzonPage() {
  // El buzón es privado: además del middleware, exigimos sesión en el servidor.
  // El contrato del backend deberá servir SOLO el buzón del usuario autenticado.
  const session = await getSession();
  if (!session) redirect("/gastronomada/login?redirect=/gastronomada/buzon");

  return <Buzon />;
}
