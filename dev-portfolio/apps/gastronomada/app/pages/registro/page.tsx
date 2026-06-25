import type { Metadata } from "next";
import RegistroForm from "@/components/auth/RegistroForm";

export const metadata: Metadata = {
  title: "GastroNómada — Registro",
};

export default function RegistroPage() {
  return <RegistroForm />;
}
