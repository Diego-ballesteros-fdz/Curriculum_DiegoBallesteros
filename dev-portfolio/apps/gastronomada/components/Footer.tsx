const SOCIALS = [
  {
    title: "Instagram",
    href: "https://www.instagram.com/",
    base: "/imagenes/Redes_Sociales/instagram.png",
    light: "/imagenes/Redes_Sociales/instagram_fotter_hover.png",
    accent: "/imagenes/Redes_Sociales/instagram_a_hover.png",
  },
  {
    title: "Facebook",
    href: "https://es-es.facebook.com/",
    base: "/imagenes/Redes_Sociales/facebook_black.png",
    light: "/imagenes/Redes_Sociales/facebookFotter_hover.png",
    accent: "/imagenes/Redes_Sociales/facebooka_hover.png",
  },
  {
    title: "X",
    href: "https://x.com/",
    base: "/imagenes/Redes_Sociales/gorjeo.png",
    light: "/imagenes/Redes_Sociales/X_fotter_hover.png",
    accent: "/imagenes/Redes_Sociales/X_a_hover.png",
  },
];

/**
 * URL del portfolio de Diego dentro del monorepo. En desarrollo corre en el
 * puerto 3000; en producción se inyecta por entorno.
 */
const PORTFOLIO_URL =
  process.env.NEXT_PUBLIC_PORTFOLIO_URL ?? "http://localhost:3000";

export default function Footer() {
  return (
    <footer className="group/footer flex h-20 items-center justify-center gap-8 bg-gold px-12 text-very-dark transition-colors hover:bg-dark hover:text-cream">
      <a
        href={PORTFOLIO_URL}
        title="Portfolio de Diego Ballesteros"
        className="text-sm font-bold underline-offset-4 hover:underline"
      >
        ← Portfolio
      </a>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-bold">Información de contacto</span>
        <span className="text-sm">Redes Sociales</span>
      </div>

      <div className="flex items-center gap-5">
        {SOCIALS.map((s) => (
          <a
            key={s.title}
            href={s.href}
            title={s.title}
            target="_blank"
            rel="noopener noreferrer"
            className="group/icon relative block size-5 transition-transform hover:scale-110"
          >
            {/* Icono negro: visible por defecto, oculto al hacer hover en el footer */}
            <img
              src={s.base}
              alt={s.title}
              className="absolute inset-0 size-5 transition-opacity group-hover/footer:opacity-0"
            />
            {/* Variante clara: visible con el footer en hover, oculta sobre este icono */}
            <img
              src={s.light}
              alt=""
              aria-hidden
              className="absolute inset-0 size-5 opacity-0 transition-opacity group-hover/footer:opacity-100 group-hover/icon:opacity-0"
            />
            {/* Variante de acento: solo al pasar sobre este icono */}
            <img
              src={s.accent}
              alt=""
              aria-hidden
              className="absolute inset-0 size-5 opacity-0 transition-opacity group-hover/icon:opacity-100"
            />
          </a>
        ))}
      </div>
    </footer>
  );
}
