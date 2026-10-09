// GET /api/ga4?de=…&ate=… → relatório da propriedade GA4 (só leitura, Data API).
// Separado do /api/dashboard: se o GA4 falhar, o resto do painel não espera nem zera.
import { range } from "@/lib/painel/period.js";
import { fetchGa4Report } from "@/lib/painel/ga4.js";
import { autenticado, consulta, json, naoAutorizado } from "@/lib/painel/http";

export async function GET(request: Request) {
  if (!autenticado(request)) return naoAutorizado();
  const r = range(consulta(request));
  // Sempre 200: o estado (ready | not_configured | error) vai no corpo, com mensagem segura
  return json(await fetchGa4Report({ from: r.from, to: r.to, prevFrom: r.prevFrom, prevTo: r.prevTo }));
}
