// GET /api/dashboard?de=YYYY-MM-DD&ate=YYYY-MM-DD&origem=<canal>&jornadas=conv|todas
// GET /api/dashboard?live=1 → últimos eventos (feed ao vivo). Requer Bearer de /api/login.
import { configured } from "@/lib/painel/db.js";
import { live, report } from "@/lib/painel/consultas.js";
import { autenticado, consulta, json, naoAutorizado } from "@/lib/painel/http";

export async function GET(request: Request) {
  if (!autenticado(request)) return naoAutorizado();
  if (!configured()) return json({ error: "Supabase não configurado (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)." }, 503);

  const q = consulta(request);
  try {
    return json(q.live ? await live() : await report(q));
  } catch (err) {
    console.error("[dashboard]", err instanceof Error ? err.message : err);
    return json({ error: "Falha ao consultar o banco." }, 500);
  }
}
