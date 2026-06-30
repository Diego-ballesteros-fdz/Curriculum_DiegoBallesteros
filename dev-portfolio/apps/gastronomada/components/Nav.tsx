"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, KeyRound, LogOut, Moon, Search, Sun, User, UserCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { PAISES } from "@/components/nav/paises";
import { selectTotalNoLeidos, useBuzonStore } from "@/lib/stores/buzon-store";
import { useUsuario } from "@/components/auth/SessionProvider";
import { useTema } from "@/components/ThemeProvider";
import { signOut } from "@/lib/auth-client";

type ActiveMenu = "paises" | "recetas" | "perfil" | null;

export default function Nav() {
  const router = useRouter();
  const usuario = useUsuario();
  const [active, setActive] = useState<ActiveMenu>(null);
  const noLeidos = useBuzonStore(selectTotalNoLeidos);
  const { tema, alternar } = useTema();

  async function cerrarSesion() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  const toggle = (menu: ActiveMenu) =>
    setActive((prev) => (prev === menu ? null : menu));
  const close = () => setActive(null);

  // Sin sesión: nav mínimo (logo + iniciar sesión). El resto de la app está
  // protegido, así que no se muestran enlaces a páginas inaccesibles.
  if (!usuario) {
    return (
      <div className="sticky top-0 z-20">
        <nav className="flex h-20 items-center justify-between bg-gold px-8">
          <Link href="/" className="flex shrink-0 items-center">
            <img src="/imagenes/logo.png" width={90} height={90} alt="GastroNómada" />
          </Link>
          <Link
            href="/pages/login"
            className="rounded-lg bg-very-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-dark"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    );
  }

  const navLink =
    "flex items-center font-bold text-very-dark transition-colors hover:text-cream group-hover:text-cream";

  return (
    <div className="sticky top-0 z-20">
      <nav className="group flex h-20 gap-8 bg-gold transition-colors hover:bg-dark">
        <Link href="/" onClick={close} className="flex shrink-0 items-center pl-8">
          <img src="/imagenes/logo.png" width={90} height={90} alt="GastroNómada" />
        </Link>

        <div className="flex flex-1 items-stretch gap-6">
          {/* ── Gastronomía del mundo ── */}
          <div className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => toggle("paises")}
              aria-expanded={active === "paises"}
              className={navLink}
            >
              Gastronomía del mundo
            </button>
            {active === "paises" && (
              <DropdownPanel className="left-0 w-full max-w-2xl">
                <h3 className="mb-4 text-center text-lg font-bold text-cream">
                  Gastronomías del mundo
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {PAISES.map((p) => (
                    <Link key={p.title} href={p.href} onClick={close} title={p.title}>
                      <img
                        src={p.src}
                        width={50}
                        height={30}
                        alt={p.title}
                        className="rounded border border-very-dark/20 transition-transform hover:scale-110"
                      />
                    </Link>
                  ))}
                </div>
              </DropdownPanel>
            )}
          </div>

          {/* ── Recetas ── */}
          <div className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => toggle("recetas")}
              aria-expanded={active === "recetas"}
              className={navLink}
            >
              Recetas
            </button>
            {active === "recetas" && (
              <DropdownPanel className="left-0 w-max">
                <h3 className="mb-4 text-center text-lg font-bold text-cream">
                  Recetas
                </h3>
                <div className="flex gap-6 text-sm font-semibold text-cream">
                  <Link
                    href="/pages/gastronomia-tradicional"
                    onClick={close}
                    className="hover:underline"
                  >
                    Gastronomía tradicional
                  </Link>
                  <Link
                    href="/pages/recetas-modernas"
                    onClick={close}
                    className="hover:underline"
                  >
                    Gastronomía moderna
                  </Link>
                </div>
              </DropdownPanel>
            )}
          </div>

          <Link href="/pages/foro" onClick={close} className={navLink}>
            Foro gastronómico
          </Link>
          <Link href="/pages/en-construccion" onClick={close} className={navLink}>
            Utensilios y más
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-5 pr-12">
          <button type="button" aria-label="Buscar" className={navLink}>
            <Search className="size-6" />
          </button>

          <Link
            href="/pages/buzon"
            aria-label={`Buzón de entrada${noLeidos > 0 ? ` (${noLeidos} sin leer)` : ""}`}
            onClick={close}
            className={cn(navLink, "relative")}
          >
            <Inbox className="size-6" />
            {noLeidos > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold leading-none text-white">
                {noLeidos > 9 ? "9+" : noLeidos}
              </span>
            )}
          </Link>

          {/* ── Perfil ── */}
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={() => toggle("perfil")}
              aria-expanded={active === "perfil"}
              aria-label="Cuenta"
              className={navLink}
            >
              <User className="size-6" />
            </button>
            {active === "perfil" && (
              <DropdownPanel className="right-0 w-56">
                <p className="mb-2 truncate border-b border-cream/15 pb-2 text-sm font-bold text-cream">
                  {usuario.name}
                </p>
                <Link
                  href="/pages/perfil"
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  <UserCircle className="size-4" />
                  Mi perfil
                </Link>
                <Link
                  href="/pages/cambiar-contrasena"
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  <KeyRound className="size-4" />
                  Cambiar contraseña
                </Link>
                <button
                  type="button"
                  onClick={alternar}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  {tema === "oscuro" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  Tema: {tema === "oscuro" ? "Claro" : "Oscuro"}
                </button>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-very-dark"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </DropdownPanel>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

/** Panel desplegable anclado justo debajo de su botón, con el fondo del nav (sin hover). */
function DropdownPanel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute top-full z-10 rounded-b-xl bg-dark p-5 shadow-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
