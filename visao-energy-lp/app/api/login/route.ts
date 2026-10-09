// POST /api/login { password } → { token } (30 dias). Senha única em DASHBOARD_PASSWORD.
import { authConfigured, checkPassword, issueToken } from "@/lib/painel/auth.js";
import { corpoJson, json } from "@/lib/painel/http";

const ATRASO_MS = 400; // atraso fixo contra força bruta trivial

export async function POST(request: Request) {
  if (!authConfigured()) {
    return json({ error: "Dashboard não configurado: defina DASHBOARD_PASSWORD (≥ 8) e DASHBOARD_SECRET (≥ 16) na Vercel." }, 503);
  }
  const body = (await corpoJson(request)) as { password?: unknown } | null;
  await new Promise((r) => setTimeout(r, ATRASO_MS));
  if (!body || !checkPassword(body.password)) return json({ error: "Senha incorreta." }, 401);
  return json({ token: issueToken() });
}
