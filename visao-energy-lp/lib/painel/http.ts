// Ponte entre os route handlers do Next (Request/Response) e os módulos do painel (template M|P).
import { verifyToken } from "./auth.js";

const SEM_CACHE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };

export const vazio = (status: number) => new Response(null, { status, headers: SEM_CACHE });

export const json = (body: unknown, status = 200) => Response.json(body, { status, headers: SEM_CACHE });

/** Token "Bearer …" emitido por /api/login */
export function autenticado(request: Request): boolean {
  const h = request.headers.get("authorization") ?? "";
  return verifyToken(h.startsWith("Bearer ") ? h.slice(7) : "");
}

export const naoAutorizado = () => json({ error: "Sessão expirada. Entre novamente." }, 401);

/** ?de=YYYY-MM-DD&ate=…&origem=… como objeto simples (os módulos validam cada valor) */
export const consulta = (request: Request): Record<string, string> =>
  Object.fromEntries(new URL(request.url).searchParams);

export async function corpoJson(request: Request): Promise<unknown> {
  try {
    const texto = await request.text();
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null;
  }
}
