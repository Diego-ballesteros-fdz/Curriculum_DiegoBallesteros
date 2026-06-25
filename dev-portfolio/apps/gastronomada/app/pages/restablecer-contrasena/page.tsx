import type { Metadata } from "next";
import { Suspense } from "react";
import RestablecerPasswordForm from "@/components/auth/RestablecerPasswordForm";

export const metadata: Metadata = {
  title: "GastroNómada — Nueva contraseña",
};

export default function RestablecerContrasenaPage() {
  return (
    <Suspense>
      <RestablecerPasswordForm />
    </Suspense>
  );
}
