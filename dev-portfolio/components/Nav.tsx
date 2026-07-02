"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Inbox,
  KeyRound,
  LogOut,
  Menu,
  Moon,
  Sun,
  User,
  UserCircle,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { PAISES, hrefPais } from "@/components/nav/paises";
import { selectTotalNoLeidos, useBuzonStore } from "@/lib/stores/buzon-store";
import { useUsuario } from "@/components/auth/SessionProvider";
import { useTema } from "@/components/ThemeProvider";
import { signOut } from "@/lib/auth-client";

type ActiveMenu = "paises" | "recetas" | "perfil" | null;

export default function Nav() {
  const router = useRouter();
  const usuario = useUsuario();
  const [active, setActive] = useState<ActiveMenu>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const noLeidos = useBuzonStore(selectTotalNoLeidos);
  const { tema, alternar } = useTema();
  const navRef = useRef<HTMLDivElement>(null);

  const cerrarTodo = useCallback(() => {
    setActive(null);
    setMenuAbierto(false);
  }, []);

  // Cierra cualquier desplegable (y el panel móvil) al hacer clic fuera del nav.
  // Solo escucha mientras hay algo abierto, y limpia el listener al desmontar.
  useEffect(() => {
    if (active === null && !menuAbierto) return;
    function onMouseDown(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        cerrarTodo();
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [active, menuAbierto, cerrarTodo]);

  async function cerrarSesion() {
    cerrarTodo();
    await signOut();
    router.push("/gastronomada");
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
          <Link href="/gastronomada" className="flex shrink-0 items-center">
            <img src="/imagenes/logo.png" width={90} height={90} alt="GastroNómada" />
          </Link>
          <Link
            href="/gastronomada/login"
            className="cursor-pointer rounded-lg bg-very-dark px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-dark"
          >
            Iniciar sesión
          </Link>
        </nav>
      </div>
    );
  }

  // La barra está "oscura" (texto crema) cuando hay un menú abierto: así el ítem
  // activo se mantiene resaltado aunque el ratón salga de la barra (no depende
  // solo del `:hover`).
  const barOscura = active !== null;
  const navLink = cn(
    "flex items-center font-bold transition-colors cursor-pointer hover:text-cream group-hover:text-cream",
    barOscura ? "text-cream" : "text-very-dark",
  );
  // Marca explícita del ítem cuyo menú está abierto.
  const itemActivo = (menu: ActiveMenu) =>
    cn(navLink, active === menu && "underline underline-offset-8");

  const mobileItem =
    "flex items-center justify-between rounded-md px-3 py-3 font-bold text-very-dark transition-colors cursor-pointer hover:bg-dark hover:text-cream";
  const mobileSub =
    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-very-dark transition-colors cursor-pointer hover:bg-dark hover:text-cream";

  return (
    <div ref={navRef} className="sticky top-0 z-20">
      {/* ══════════ Nav de escritorio (≥ md) ══════════ */}
      <nav
        className={cn(
          "group hidden h-20 gap-8 bg-gold transition-colors hover:bg-dark md:flex",
          barOscura && "bg-dark",
        )}
      >
        <Link href="/gastronomada" onClick={close} className="flex shrink-0 items-center pl-8">
          <img src="/imagenes/logo.png" width={90} height={90} alt="GastroNómada" />
        </Link>

        <div className="flex flex-1 items-stretch gap-6">
          {/* ── Gastronomía del mundo ── */}
          <div className="relative flex items-stretch">
            <button
              type="button"
              onClick={() => toggle("paises")}
              aria-expanded={active === "paises"}
              aria-current={active === "paises" ? "true" : undefined}
              className={itemActivo("paises")}
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
                    <Link
                      key={p.slug}
                      href={hrefPais(p.slug)}
                      onClick={close}
                      title={p.nombre}
                    >
                      <img
                        src={p.src}
                        width={50}
                        height={30}
                        alt={p.nombre}
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
              aria-current={active === "recetas" ? "true" : undefined}
              className={itemActivo("recetas")}
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
                    href="/gastronomada/gastronomia-tradicional"
                    onClick={close}
                    className="hover:underline"
                  >
                    Gastronomía tradicional
                  </Link>
                  <Link
                    href="/gastronomada/recetas-modernas"
                    onClick={close}
                    className="hover:underline"
                  >
                    Gastronomía moderna
                  </Link>
                </div>
              </DropdownPanel>
            )}
          </div>

          <Link href="/gastronomada/foro" onClick={close} className={navLink}>
            Foro gastronómico
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-5 pr-12">
          <Link
            href="/gastronomada/buzon"
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
              aria-current={active === "perfil" ? "true" : undefined}
              aria-label="Cuenta"
              className={itemActivo("perfil")}
            >
              <User className="size-6" />
            </button>
            {active === "perfil" && (
              <DropdownPanel className="right-0 w-56">
                <p className="mb-2 truncate border-b border-cream/15 pb-2 text-sm font-bold text-cream">
                  {usuario.name}
                </p>
                <Link
                  href="/gastronomada/perfil"
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  <UserCircle className="size-4" />
                  Mi perfil
                </Link>
                <Link
                  href="/gastronomada/cambiar-contrasena"
                  onClick={close}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  <KeyRound className="size-4" />
                  Cambiar contraseña
                </Link>
                <button
                  type="button"
                  onClick={alternar}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm text-cream transition-colors hover:bg-very-dark"
                >
                  {tema === "oscuro" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                  Tema: {tema === "oscuro" ? "Claro" : "Oscuro"}
                </button>
                <button
                  type="button"
                  onClick={cerrarSesion}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-very-dark"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </button>
              </DropdownPanel>
            )}
          </div>
        </div>
      </nav>

      {/* ══════════ Nav móvil (< md) ══════════ */}
      <div className="flex h-20 items-center justify-between bg-gold px-6 md:hidden">
        <Link href="/gastronomada" onClick={cerrarTodo} className="flex shrink-0 items-center">
          <img src="/imagenes/logo.png" width={70} height={70} alt="GastroNómada" />
        </Link>
        <button
          type="button"
          onClick={() => setMenuAbierto((v) => !v)}
          aria-expanded={menuAbierto}
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="relative flex cursor-pointer items-center text-very-dark"
        >
          {menuAbierto ? <X className="size-7" /> : <Menu className="size-7" />}
          {!menuAbierto && noLeidos > 0 && (
            <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-destructive" />
          )}
        </button>
      </div>

      {/* Panel desplegable móvil */}
      {menuAbierto && (
        <div className="flex flex-col gap-1 border-t border-very-dark/10 bg-gold px-4 py-3 md:hidden">
          {/* Gastronomía del mundo */}
          <button
            type="button"
            onClick={() => toggle("paises")}
            aria-expanded={active === "paises"}
            className={mobileItem}
          >
            Gastronomía del mundo
            <ChevronDown
              className={cn("size-4 transition-transform", active === "paises" && "rotate-180")}
            />
          </button>
          {active === "paises" && (
            <div className="flex flex-wrap gap-2 px-3 pb-2">
              {PAISES.map((p) => (
                <Link
                  key={p.slug}
                  href={hrefPais(p.slug)}
                  onClick={cerrarTodo}
                  title={p.nombre}
                >
                  <img
                    src={p.src}
                    width={44}
                    height={28}
                    alt={p.nombre}
                    className="rounded border border-very-dark/20 transition-transform hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Recetas */}
          <button
            type="button"
            onClick={() => toggle("recetas")}
            aria-expanded={active === "recetas"}
            className={mobileItem}
          >
            Recetas
            <ChevronDown
              className={cn("size-4 transition-transform", active === "recetas" && "rotate-180")}
            />
          </button>
          {active === "recetas" && (
            <div className="flex flex-col gap-1 px-3 pb-2">
              <Link
                href="/gastronomada/gastronomia-tradicional"
                onClick={cerrarTodo}
                className={mobileSub}
              >
                Gastronomía tradicional
              </Link>
              <Link href="/gastronomada/recetas-modernas" onClick={cerrarTodo} className={mobileSub}>
                Gastronomía moderna
              </Link>
            </div>
          )}

          {/* Foro */}
          <Link href="/gastronomada/foro" onClick={cerrarTodo} className={mobileItem}>
            Foro gastronómico
          </Link>

          {/* Buzón */}
          <Link href="/gastronomada/buzon" onClick={cerrarTodo} className={mobileItem}>
            <span className="flex items-center gap-2">
              <Inbox className="size-5" />
              Buzón
            </span>
            {noLeidos > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold leading-none text-white">
                {noLeidos > 9 ? "9+" : noLeidos}
              </span>
            )}
          </Link>

          {/* Perfil */}
          <button
            type="button"
            onClick={() => toggle("perfil")}
            aria-expanded={active === "perfil"}
            className={mobileItem}
          >
            <span className="flex items-center gap-2">
              <User className="size-5" />
              <span className="max-w-40 truncate">{usuario.name}</span>
            </span>
            <ChevronDown
              className={cn("size-4 transition-transform", active === "perfil" && "rotate-180")}
            />
          </button>
          {active === "perfil" && (
            <div className="flex flex-col gap-1 px-3 pb-2">
              <Link href="/gastronomada/perfil" onClick={cerrarTodo} className={mobileSub}>
                <UserCircle className="size-4" />
                Mi perfil
              </Link>
              <Link
                href="/gastronomada/cambiar-contrasena"
                onClick={cerrarTodo}
                className={mobileSub}
              >
                <KeyRound className="size-4" />
                Cambiar contraseña
              </Link>
              <button type="button" onClick={alternar} className={cn(mobileSub, "w-full")}>
                {tema === "oscuro" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                Tema: {tema === "oscuro" ? "Claro" : "Oscuro"}
              </button>
              <button
                type="button"
                onClick={cerrarSesion}
                className={cn(mobileSub, "w-full font-semibold text-destructive")}
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
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
