import type { Project } from "@/lib/projects";

/**
 * Renderiza un proyecto como salida de terminal: cabecera tipo `ls`,
 * descripción, stack y enlaces. Recibe el dato; no lo conoce de antemano (DIP).
 */
export default function ProjectEntry({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article className="border-l-2 border-term-border pl-4">
      {/* Línea tipo `ls`: nº, directorio, etiqueta */}
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-term-dim">{num}</span>
        <span className="text-base font-bold text-term-green">
          {project.slug}/
        </span>
        <span className="text-sm text-term-amber">[{project.tag}]</span>
      </header>

      <h2 className="mt-1 text-base text-term-fg">{project.name}</h2>

      <p className="mt-2 max-w-2xl text-sm text-term-dim">
        {project.description}
      </p>

      {/* Stack como tags */}
      <ul className="mt-3 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="rounded border border-term-border px-2 py-0.5 text-sm text-term-cyan"
          >
            {tech}
          </li>
        ))}
      </ul>

      {/* Enlaces */}
      {project.links.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="text-term-green underline decoration-term-border underline-offset-4 hover:decoration-term-green"
            >
              ./{link.label}
            </a>
          ))}
        </p>
      )}
    </article>
  );
}
