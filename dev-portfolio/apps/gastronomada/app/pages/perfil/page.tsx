import type { Metadata } from "next";
import { redirect } from "next/navigation";

import PerfilRecetas from "@/components/perfil/PerfilRecetas";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "GastroNómada — Mi perfil",
};

export default async function PerfilPage() {
  // Defensa en profundidad: además del middleware, exigimos sesión en el servidor.
  const session = await getSession();
  if (!session) redirect("/pages/login?redirect=/pages/perfil");

  return <PerfilRecetas nombre={session.user.name} />;
}
