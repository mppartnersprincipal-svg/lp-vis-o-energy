// Agregações do /dashboard (api/_lib/report.js): funil, contatos, jornadas e KPIs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { funnels, kpis, contactReport, journeys, SECTIONS } from '../../lib/painel/report.js';

const ev = (session_id, ts, name, props = {}, page_type = 'home') => ({ session_id, ts, name, props, page_type });

test('funnel counts unique sessions per section over sessions that opened the page', () => {
  const events = [
    ev('a', 't', 'page_view'), ev('b', 't', 'page_view'),
    ev('a', 't', 'section_view', { section: 'simulador' }), ev('a', 't', 'section_view', { section: 'simulador' }),
    ev('b', 't', 'section_view', { section: 'hero' }),
  ];
  const f = funnels(events).home;
  assert.equal(f.sessions, 2);
  assert.equal(f.steps.find((s) => s.key === 'simulador').value, 1);
  assert.equal(f.steps.find((s) => s.key === 'simulador').pct, 50);
  assert.equal(f.steps.find((s) => s.key === 'hero').label, 'Hero (sol)');
});

test('funnel follows the LP section order', () => {
  assert.deepEqual(SECTIONS.home.slice(0, 3), ['hero', 'numeros', 'conta-de-luz']);
  assert.equal(SECTIONS.home.at(-1), 'orcamento');
});

test('conversion counts WhatsApp OR phone, once per session', () => {
  const k = kpis([{ id: 1, wa_clicks: 2 }, { id: 2, phone_clicks: 1 }, { id: 3 }, { id: 4, wa_clicks: 1, phone_clicks: 1 }]);
  assert.equal(k.converting_sessions, 3);
  assert.equal(k.conversion_rate, 75);
  assert.equal(k.contacts, 5);
});

test('contacts are grouped by cta_location and pivoted by channel', () => {
  const events = [
    ev('a', 't', 'whatsapp_click', { cta_location: 'cta_whatsapp_hero' }),
    ev('b', 't', 'whatsapp_click', { cta_location: 'cta_whatsapp_hero' }),
    ev('b', 't', 'phone_click', { cta_location: 'telefone · contato' }),
    ev('a', 't', 'cta_click', { cta_location: 'maps · contato' }),
  ];
  const channel = { a: 'google_ads', b: 'direct' };
  const c = contactReport(events, (id) => channel[id]);
  assert.deepEqual(c.wa_by_location, [{ key: 'cta_whatsapp_hero', value: 2 }]);
  assert.deepEqual(c.phone_by_location, [{ key: 'telefone · contato', value: 1 }]);
  assert.deepEqual(c.cta_by_location, [{ key: 'maps · contato', value: 1 }]);
  const hero = c.contact_location_x_channel.find((r) => r.row === 'wa|cta_whatsapp_hero');
  assert.deepEqual(hero.cols, { google_ads: 1, direct: 1 });
});

test('journeys default to sessions that contacted; "todas" keeps every session', () => {
  const sessions = [{ id: 'a', wa_clicks: 1 }, { id: 'b' }];
  const evs = { a: [ev('a', 't', 'page_view'), ev('a', 't', 'whatsapp_click', { cta_location: 'fab_whatsapp' })] };
  const conv = journeys(sessions, evs, 'conv');
  assert.equal(conv.length, 1);
  assert.deepEqual(conv[0].trail.map((s) => s.text), ['Abriu a página', 'WhatsApp (fab_whatsapp)']);
  assert.equal(journeys(sessions, evs, 'todas').length, 2);
});

test('click texts containing | keep text, section and page apart', async () => {
  const { clicks } = await import('../../lib/painel/report.js');
  const [row] = clicks([{ session_id: 'a', name: 'click', page_type: 'home', props: { text: 'Ferragens | Ferramentas', section: 'header' } }]);
  assert.deepEqual(row, { text: 'Ferragens | Ferramentas', section: 'header', page: 'home', value: 1 });
});
