/**
 * Secreto para firmar el token de sesión (HMAC).
 *
 * Vive aquí (no en config.ts) para que NO entre en el bundle de cliente: este
 * módulo solo lo importan el middleware (Edge) y el servidor. En producción DEBE
 * venir de `AUTH_SECRET`; el valor de desarrollo es deliberadamente inseguro.
 */
const AUTH_SECRET =
  process.env.AUTH_SECRET ?? "dev-only-inseguro-cambiar-en-produccion";

/**
 * Token de sesión firmado con HMAC-SHA256 (Web Crypto).
 *
 * Usa Web Crypto (disponible tanto en el runtime Edge del middleware como en
 * Node) para poder verificar la sesión en ambos sitios. El payload va firmado
 * pero NO cifrado: no debe contener datos sensibles, solo el id de usuario y la
 * expiración.
 */
export interface TokenPayload {
  /** id del usuario. */
  sub: string;
  /** expiración en segundos epoch. */
  exp: number;
}

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): Uint8Array<ArrayBuffer> {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const pad = normalized.length % 4 ? 4 - (normalized.length % 4) : 0;
  const str = atob(normalized + "=".repeat(pad));
  const bytes = new Uint8Array(new ArrayBuffer(str.length));
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const data = base64url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(),
    encoder.encode(data),
  );
  return `${data}.${base64url(new Uint8Array(signature))}`;
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;

  const valido = await crypto.subtle.verify(
    "HMAC",
    await getKey(),
    fromBase64url(signature),
    encoder.encode(data),
  );
  if (!valido) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64url(data)),
    ) as TokenPayload;
    if (typeof payload.exp !== "number" || payload.exp * 1000 < Date.now()) {
      return null; // expirado
    }
    return payload;
  } catch {
    return null;
  }
}
