/**
 * Datos de perfil — fuente única de verdad para la cabecera del portfolio.
 * Mantener aquí evita esparcir literales por los componentes (SRP).
 */

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export const PROFILE = {
  name: "Diego Ballesteros Fernández",
  role: "Junior Backend Developer",
  location: "Madrid, España",
  summary:
    "Developer junior especializado en backend, microservicios e infraestructura cloud. " +
    "Mi recorrido previo dirigiendo restaurantes me dio gestión de equipos, trato directo con " +
    "cliente y obsesión por la eficiencia de procesos. Hoy lo aplico a construir APIs REST " +
    "y arquitecturas en la nube.",
} as const;

export const CONTACTS: ContactLink[] = [
  {
    label: "email",
    value: "diego.ball.fdz@gmail.com",
    href: "mailto:diego.ball.fdz@gmail.com",
  },
  {
    label: "github",
    value: "github.com/Diego-ballesteros-fdz",
    href: "https://github.com/Diego-ballesteros-fdz",
  },
  {
    label: "linkedin",
    value: "in/diego-ballesteros-fernández",
    href: "https://www.linkedin.com/in/diego-ballesteros-fernández-627991383",
  },
];
