import type { Metadata } from "next";
import RecuperarPasswordForm from "@/components/auth/RecuperarPasswordForm";

export const metadata: Metadata = {
  title: "GastroNómada — Recuperar contraseña",
};

export default function RecuperarContrasenaPage() {
  return <RecuperarPasswordForm />;
}
