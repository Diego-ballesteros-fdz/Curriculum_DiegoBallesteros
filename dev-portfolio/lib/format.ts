/**
 * Formato de fechas estable entre servidor y cliente.
 *
 * Se fija `timeZone: "UTC"` para que el render del servidor (que corre en UTC)
 * y el del cliente (zona horaria local) coincidan y no haya errores de
 * hidratación. El backend siempre envía las fechas en ISO 8601.
 */
const formateador = new Intl.DateTimeFormat("es-ES", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatFecha(iso: string): string {
  return formateador.format(new Date(iso));
}

const horaFormateador = new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatHora(iso: string): string {
  return horaFormateador.format(new Date(iso));
}
