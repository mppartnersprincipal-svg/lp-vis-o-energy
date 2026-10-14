# Dashboard: LP Visão Solar

Painel first-party em **`/dashboard`** (senha única), no padrão M|P (template da skill `lp-tracking-dashboard`,
origem LP Nova Ferragista), portado para Next.js.

```
LP ──dataLayer──▶ GTM ──▶ GA4 (eventos) + Google Ads (conversão WhatsApp)
 └──vsCollect──▶ /js/tracker.js ──▶ /api/collect ──▶ Supabase (visaosolar_sessions / visaosolar_events)
/dashboard (login) ──▶ /api/dashboard (Supabase) + /api/google-ads (API via MCC) + /api/ga4 (Data API)
```

## Onde está cada peça (`visao-energy-lp/`)

| Peça | Arquivo |
|---|---|
| Coletor anônimo (sem IP/cookie) | `public/js/tracker.js` (carregado pelo `TrackingProvider`) |
| Ponte dataLayer → coletor + RESET dos parâmetros | `lib/tracking.ts` (`pushEvent`, `ctaIdFor`) |
| Rotas | `app/api/{collect,login,dashboard,ga4,google-ads}/route.ts` |
| Lógica (template, sem dependências) | `lib/painel/*.js` (+ `consultas.js`, `http.ts`) |
| Interface do painel | `public/dashboard/{index.html,app.js}` (rewrite `/dashboard` em `next.config.ts`) |
| Banco | `supabase/migrations/0001_visaosolar_analytics.sql` (já aplicada no projeto `khipnjfbxjgvmjvyxero`) |
| Testes | `npm test` (vitest da LP + `node --test tests/painel`) |

## O que o painel mede

**Conversão = contato:** `wa_clicks` + `phone_clicks` da sessão. O formulário termina no WhatsApp, então entra
como `whatsapp_click` com `cta_location: cta_whatsapp_formulario` (+ `cidade` e `conta`).
Conversões são enviadas **na hora** (fetch keepalive), não no `pagehide`: o formulário redireciona em 350 ms
e navegadores in-app descartam o beacon de saída.

| Evento no coletor | Origem |
|---|---|
| `page_view`, `page_leave`, `click`, `section_view` | o próprio `tracker.js` |
| `whatsapp_click` | `click_whatsapp` e `form_submit` |
| `cta_click` | `click_cta` |
| `simulator_change` | uso do simulador (`conta`) |
| `faq_open` | pergunta aberta no FAQ (`faq_question`) |

**Seções do funil** (`id` da `<section>`, na ordem): `hero`, `numeros`, `conta-de-luz`, `simulador`,
`como-funciona`, `financiamento`, `obras`, `garantias`, `atendimento`, `duvidas`, `orcamento`.

**`cta_id`** (gerado de `data-track-local` por `ctaIdFor`):

| WhatsApp | CTA (âncora na página) |
|---|---|
| `fab_whatsapp` (flutuante desktop) | `cta_hero_simulador` (rola até o simulador) |
| `cta_whatsapp_barra_mobile` (ícone) | |
| `cta_whatsapp_barra_mobile_orcamento` (botão "Orçamento Gratuito") | |
| `cta_whatsapp_navbar` · `cta_whatsapp_hero` | |
| `cta_whatsapp_simulador` (leva a conta simulada na mensagem) | |
| `cta_whatsapp_financiamento` · `cta_whatsapp_faq` · `cta_whatsapp_rodape` | |
| `cta_whatsapp_formulario` (envio do formulário) | |

Desde 14/10/2026 os botões de orçamento (navbar, hero, simulador, financiamento, barra mobile) abrem o
WhatsApp direto pelo componente `components/ui/WhatsAppCta.tsx` (mensagem com UTMs montada no clique) e
contam como `click_whatsapp`, ou seja, **disparam a conversão do Google Ads**. Os ids antigos `cta_navbar`,
`cta_hero`, `cta_simulador`, `cta_financiamento` e `cta_barra_mobile` só aparecem em dados anteriores.

Ao criar botão novo: dar `data-track-local` e incluir o rótulo em `CTA` no `public/dashboard/app.js`.
Seção nova: `id` na `<section>` + `SECTIONS`/`SECTION_LABEL` em `lib/painel/report.js` + `SECTION` no `app.js`.

## Variáveis (Vercel → Settings → Environment Variables)

Lista completa em `visao-energy-lp/.env.example`. Conta Google Ads da Visão Solar: **548-350-1029** (via MCC
603-989-2603). GA4: propriedade **558194391**. A conta de serviço do GA4 precisa ser **Leitor** na propriedade.
Toda variável nova só vale depois de **Redeploy**.

## Erros conhecidos

| Sintoma | Causa |
|---|---|
| Login: "Dashboard não configurado" | faltou redeploy, ou senha < 8 / segredo < 16 |
| "Supabase não configurado" | faltam `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` (o collect descarta em silêncio) |
| Google Ads mostra a conta da M\|P | `GOOGLE_ADS_CUSTOMER_ID` errado (tem que ser 5483501029) |
| GA4 "sem acesso à propriedade" | conta de serviço não é Leitor no GA4 da Visão Solar |
| GA4 "use o ID numérico" | colocaram `G-51019MQH3T` no `GA4_PROPERTY_ID` |

## Dados de teste

Visitas de QA usam `utm_content=qa-seed`. Para limpar (rodar no SQL Editor do Supabase):

```sql
delete from visaosolar_sessions where utm_content = 'qa-seed';
```
