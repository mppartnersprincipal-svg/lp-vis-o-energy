// GET /api/google-ads?de=…&ate=… → relatório da conta do cliente (só leitura, via MCC).
// Separado do /api/dashboard: se o Google Ads falhar, o resto do painel não espera nem zera.
import { range } from "@/lib/painel/period.js";
import { fetchGoogleAdsReport } from "@/lib/painel/google-ads.js";
import { autenticado, consulta, json, naoAutorizado } from "@/lib/painel/http";

export async function GET(request: Request) {
  if (!autenticado(request)) return naoAutorizado();
  const r = range(consulta(request));
  return json(await fetchGoogleAdsReport({ from: r.from, to: r.to }));
}
