// Consultas do /api/dashboard (portadas de api/dashboard.js do template M|P para o Next).
// Tabelas visaosolar_* no Supabase compartilhado. Só roda no servidor.
import { selectAll } from './db.js';
import { range } from './period.js';
import { buildReport } from './report.js';
import { PAGE_TYPES } from './payload.js';

const CHANNELS = new Set(['google_ads', 'google_organic', 'instagram', 'meta_ads', 'facebook', 'search_other', 'direct', 'referral', 'other']);
const LIVE_EVENTS = 40;
const MAX_ROWS = 50000; // teto padrão do selectAll

export async function live() {
  const events = await selectAll('visaosolar_events', 'select=ts,name,page_type,props,session_id&order=ts.desc&name=not.in.(page_leave,section_view)', LIVE_EVENTS, LIVE_EVENTS);
  const ids = [...new Set(events.map((e) => e.session_id))];
  const sessions = ids.length ? await selectAll('visaosolar_sessions', `select=id,channel,device,city,utm_campaign&id=in.(${ids.join(',')})`) : [];
  const byId = Object.fromEntries(sessions.map((s) => [s.id, s]));
  return { events: events.map((e) => ({ ...e, session: byId[e.session_id] || null })) };
}

export async function report(q) {
  const r = range(q);
  // Filtros só aceitam valores conhecidos (entram na comparação, nunca na URL do PostgREST)
  const origem = CHANNELS.has(q.origem) ? q.origem : null;
  const pagina = PAGE_TYPES.has(q.pagina) ? q.pagina : null;
  const jornadas = q.jornadas === 'todas' ? 'todas' : 'conv';
  const [sessionsAll, prevAll, eventsAll] = await Promise.all([
    selectAll('visaosolar_sessions', `select=*&started_at=gte.${r.from.toISOString()}&started_at=lt.${r.to.toISOString()}&order=started_at.desc,id.asc`),
    selectAll('visaosolar_sessions', `select=id,visitor_id,wa_clicks,phone_clicks,duration_ms,max_scroll_pct,channel,landing_page_type&started_at=gte.${r.prevFrom.toISOString()}&started_at=lt.${r.prevTo.toISOString()}&order=id.asc`),
    selectAll('visaosolar_events', `select=session_id,ts,name,page_type,props&ts=gte.${r.from.toISOString()}&ts=lt.${r.to.toISOString()}&order=ts.asc,id.asc`),
  ]);

  return {
    range: { de: r.de, ate: r.ate, days: r.days },
    origem: origem || 'todas', pagina: pagina || 'todas', jornadas,
    ...buildReport({ r, sessionsAll, prevAll, eventsAll, origem, pagina, jornadas }),
    // selectAll para em MAX_ROWS: avisa o painel em vez de cortar em silêncio
    truncated: [sessionsAll, prevAll, eventsAll].some((rows) => rows.length >= MAX_ROWS),
    generated_at: new Date().toISOString(),
  };
}
