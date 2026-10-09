// POST /api/collect: lotes anônimos do coletor (public/js/tracker.js) → Supabase.
// Sem IP, sem cookies. Cidade/região vêm dos cabeçalhos de geolocalização da Vercel.
import { configured, rpc, insert } from "@/lib/painel/db.js";
import { isBotUA } from "@/lib/painel/classify.js";
import { buildBatch } from "@/lib/painel/payload.js";
import { corpoJson, vazio } from "@/lib/painel/http";

export async function POST(request: Request) {
  if (!configured()) return vazio(204); // sem banco configurado: descarta em silêncio
  if (isBotUA(request.headers.get("user-agent") ?? "")) return vazio(204);

  const batch = buildBatch(await corpoJson(request), { headers: Object.fromEntries(request.headers) });
  if (!batch.ok) return vazio(400);

  try {
    await rpc("visaosolar_upsert_session", { p: batch.session });
    if (batch.rows.length) await insert("visaosolar_events", batch.rows);
  } catch (err) {
    console.error("[collect]", err instanceof Error ? err.message : err);
  }
  return vazio(204); // nunca quebra a página por causa de analytics
}
