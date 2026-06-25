import type { Metadata } from "next";
import { Suspense } from "react";

import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "GastroNómada — Inicio de sesión",
};

export default function LoginPage() {
  // Suspense porque LoginForm usa useSearchParams (lee `?redirect=`).
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
