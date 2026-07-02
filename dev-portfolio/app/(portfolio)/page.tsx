import Terminal from "@/components/Terminal";
import PromptLine from "@/components/PromptLine";
import ProjectEntry from "@/components/ProjectEntry";
import { PROFILE, CONTACTS } from "@/lib/profile";
import { PROJECTS } from "@/lib/projects";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-16">
      <Terminal
        title={`${PROFILE.name.toLowerCase().replace(/ .*/, "")}@portfolio: ~`}
      >
        {/* whoami */}
        <section>
          <PromptLine command="whoami" />
          <div className="mt-2 pl-4">
            <h1 className="text-xl font-bold text-term-green sm:text-2xl">
              {PROFILE.name}
            </h1>
            <p className="mt-1 text-base text-term-amber">{PROFILE.role}</p>
            <p className="mt-1 text-sm text-term-dim">
              <span className="text-term-cyan">loc</span> · {PROFILE.location}
            </p>
          </div>
        </section>

        {/* perfil */}
        <section className="mt-8">
          <PromptLine command="cat perfil.txt" />
          <p className="mt-2 max-w-2xl pl-4 text-sm text-term-fg">
            {PROFILE.summary}
          </p>
        </section>

        {/* proyectos */}
        <section className="mt-8">
          <PromptLine command="ls -la ~/proyectos" />
          <p className="mt-2 pl-4 text-sm text-term-dim">
            total {PROJECTS.length}
          </p>
          <div className="mt-4 flex flex-col gap-8">
            {PROJECTS.map((project, i) => (
              <ProjectEntry key={project.slug} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* contacto */}
        <section className="mt-8">
          <PromptLine command="contacto --help" />
          <ul className="mt-2 flex flex-col gap-1 pl-4">
            {CONTACTS.map((c) => (
              <li key={c.label} className="text-sm">
                <span className="inline-block w-20 text-term-amber">
                  {c.label}
                </span>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-term-cyan underline decoration-term-border underline-offset-4 hover:decoration-term-cyan"
                >
                  {c.value}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* prompt final con cursor estático (sin animación) */}
        {/* <p className="mt-8 select-none text-sm">
          <span className="text-term-green">visitante@portfolio</span>
          <span className="text-term-dim">:</span>
          <span className="text-term-cyan">~</span>
          <span className="text-term-dim">$ </span>
          <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-term-green align-middle" />
        </p> */}
      </Terminal>
    </main>
  );
}
