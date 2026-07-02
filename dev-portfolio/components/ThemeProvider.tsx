"use client";

import { createContext, useContext, useState } from "react";

import { THEME_COOKIE } from "@/lib/auth/config";

/**
 * Tema claro/oscuro.
 *
 * El tema es estado VISUAL, por eso (según la restricción del proyecto) no usa
 * zustand sino contexto + cookie. La cookie permite que el layout (server)
 * pinte la clase `dark` en el primer render y no haya parpadeo ni desajuste de
 * hidratación. Alterna la clase `dark` del `<html>` que activa las variantes
 * `dark:` de Tailwind.
 */
type Tema = "claro" | "oscuro";

const ThemeContext = createContext<{ tema: Tema; alternar: () => void }>({
  tema: "oscuro",
  alternar: () => {},
});

export function ThemeProvider({
  inicial,
  children,
}: {
  inicial: Tema;
  children: React.ReactNode;
}) {
  const [tema, setTema] = useState<Tema>(inicial);

  function alternar() {
    setTema((actual) => {
      const siguiente: Tema = actual === "oscuro" ? "claro" : "oscuro";
      document.documentElement.classList.toggle("dark", siguiente === "oscuro");
      // Cookie de 1 año; no es sensible (preferencia de UI).
      document.cookie = `${THEME_COOKIE}=${siguiente}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      return siguiente;
    });
  }

  return (
    <ThemeContext.Provider value={{ tema, alternar }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  return useContext(ThemeContext);
}
