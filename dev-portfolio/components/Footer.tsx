import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex min-h-20 flex-col items-center justify-center gap-3 bg-gold px-6 py-4 text-center text-very-dark transition-colors hover:bg-dark hover:text-cream sm:flex-row sm:justify-between sm:gap-8 sm:px-12 sm:text-left">
      {/* Vuelta al portfolio, que ahora vive en la raíz del sitio. */}
      <Link
        href="/"
        title="Portfolio de Diego Ballesteros"
        className="text-sm font-bold underline-offset-4 hover:underline"
      >
        ← Portfolio
      </Link>

      <div className="flex flex-col items-center gap-0.5 sm:items-end">
        <span className="text-sm font-bold">Información de contacto</span>
        <span className="text-sm">
          Diego Ballesteros Fernández | diego.ball.fdz@gmail.com
        </span>
      </div>
    </footer>
  );
}
