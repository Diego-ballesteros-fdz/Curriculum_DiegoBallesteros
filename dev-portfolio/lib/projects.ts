/**
 * Catálogo de proyectos — fuente única de verdad.
 * Añadir un proyecto = añadir una entrada aquí; la UI itera sobre el array.
 *
 * TODO(diego): rellenar los `href: "#"` con las URLs reales (demo / repos).
 */

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  /** Nombre de "directorio" que se muestra en el `ls` (kebab-case). */
  slug: string;
  name: string;
  /** Etiqueta corta de estado/origen, p. ej. "TFG" o "Home Lab". */
  tag: string;
  description: string;
  stack: string[];
  links: ProjectLink[];
  info?: string;
};

/**
 * Ruta interna de la demo de Gastronómada. Ya no es un dominio aparte: vive en
 * este mismo despliegue bajo el prefijo `/gastronomada`.
 */
const GASTRONOMADA_URL = "/gastronomada";

export const PROJECTS: Project[] = [
  {
    slug: "gastronomada",
    name: "Gastronómada",
    tag: "En desarrollo",
    description:
      "Red social para cocineros profesionales donde compartir recetas. Migrada a Next.js 16 (App Router). " +
      "Backend planificado con Fastify, Prisma, WebSockets y SSO; ahora mismo blindando el acceso de usuarios no registrados.",
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Fastify",
      "Prisma",
      "WebSockets",
    ],
    links: [
      { label: "demo", href: GASTRONOMADA_URL },
      {
        label: "repo",
        href: "https://github.com/Diego-ballesteros-fdz/Curriculum_DiegoBallesteros",
      },
    ],
    info: "Datos usuario \n email: admin@gastronomada.com \n Password: Admin123. ",
  },
  {
    slug: "artquiz",
    name: "ArtQuiz",
    tag: "En desarrollo",
    description:
      "Aplicación de retos diarios y aprendizaje sobre arte e historia del arte. Backend en Spring Boot " +
      "(Java 17) con arquitectura por capas, JPA/Hibernate y PostgreSQL; ahora mismo diseñando la lógica " +
      "del reto diario y preparando la capa de seguridad con Spring Security y JWT.",
    stack: [
      "Java",
      "Spring Boot",
      "Spring Data JPA",
      "PostgreSQL",
      "Docker",
      "Swagger / OpenAPI",
    ],
    links: [
      {
        label: "repo",
        href: "https://github.com/Diego-ballesteros-fdz/ArtQuiz-API-REST.git",
      },
    ],
    info: "Proyecto en desarrollo, sin despliegue público todavía.",
  },
  {
    slug: "aws-dashboard",
    name: "AWS Dashboard",
    tag: "TFG",
    description:
      "Dashboard cloud multiplataforma (web + móvil con código compartido vía Solito). " +
      "Trabajo de fin de grado centrado en arquitectura monorepo y consumo de datos en tiempo real.",
    stack: [
      "React",
      "TypeScript",
      "Next.js",
      "React Native",
      "Solito.dev",
      "Turborepo",
      "TanStack Query",
      "Zustand",
      "Zod",
      "React Hook Form",
      "Vercel",
    ],
    links: [{ label: "repo", href: "https://github.com/AWSDashboard" }],
  },
  {
    slug: "microservicios-home-lab",
    name: "Servidor de Microservicios",
    tag: "Home Lab",
    description:
      "Laboratorio propio de microservicios autoalojado: contenedores Docker sobre Debian, " +
      "aloja un servidor FTPS configurado por mi. Banco de pruebas de infra real.",
    stack: ["Debian", "Docker", "Linux", "FTPS"],
    links: [],
  },
  {
    slug: "survival-dungeons",
    name: "Survival Dungeons",
    tag: "1.º DAM",
    description:
      "Videojuego de mazmorras con generación procedural de niveles, sistema de crafteo " +
      "gestionado por XML, detección de colisiones y persistencia de datos. Programación orientada a objetos en Java.",
    stack: ["Java", "Java Swing", "XML", "OOP"],
    links: [
      {
        label: "repo",
        href: "https://github.com/AlejandroDCastillo/Game-programacion",
      },
    ],
  },
];
