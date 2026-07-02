/**
 * Cliente HTTP del dominio (recetas, foro, buzón).
 *
 * Todas las peticiones van al MISMO origen del front (`/api/...`), que Next
 * reescribe al backend (ver `next.config.ts`). Así la cookie httpOnly de sesión
 * viaja con `credentials: "include"` sin choques de CORS. El backend NO usa el
 * sobre `{ ok, data|error }`: los listados son `{ data, meta }` y el resto el
 * objeto directo; los errores, `{ statusCode, error, message }` (ver FRONT.md).
 *
 * Para auth se sigue usando `better-auth/react` (`lib/auth-client.ts`); este
 * helper es solo para los endpoints REST de dominio.
 */

const API_PREFIX = "/api";

/** Error de API con el código HTTP, para que la UI distinga 401/403/404/etc. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_PREFIX}${path}`, {
      credentials: "include",
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor.");
  }

  if (!res.ok) {
    const message = await mensajeDeError(res);
    throw new ApiError(res.status, message);
  }

  // 204 No Content (p. ej. DELETE): no hay cuerpo que parsear.
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/** Extrae el mensaje de error del backend (`{ message }`) con un fallback legible. */
async function mensajeDeError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { message?: string };
    if (body?.message) return body.message;
  } catch {
    // cuerpo no-JSON o vacío
  }
  if (res.status === 401) return "Tu sesión ha caducado. Vuelve a iniciar sesión.";
  if (res.status === 429) return "Demasiadas peticiones. Inténtalo en un momento.";
  return `Se ha producido un error (${res.status}).`;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  del: (path: string) => request<void>(path, { method: "DELETE" }),
};
