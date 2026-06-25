import type { Metadata } from "next";
import { redirect } from "next/navigation";

import CambiarPasswordForm from "@/components/auth/CambiarPasswordForm";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "GastroNómada — Cambiar contraseña",
};

export default async function CambiarPasswordPage() {
  // Defensa en profundidad: además del middleware, exigimos sesión en el servidor.
  const session = await getSession();
  if (!session) redirect("/pages/login?redirect=/pages/cambiar-contrasena");

  return <CambiarPasswordForm />;
}
