# MEMORY — LP Visão Solar

Memória do projeto entre sessões. Contexto fixo do projeto fica no [CLAUDE.md](CLAUDE.md); aqui ficam o histórico, as decisões e as pendências.

**Regra:** ao final de cada sessão com alterações, adicionar 1 linha no Histórico e atualizar Pendências/Decisões.

---

## Status atual (2026-10-09)

**No ar:** https://www.visaosolar.com (Vercel, projeto `visao-energy-lp`, deploy automático pelo push na `main`).

| Frente | Status |
|---|---|
| LP (12 seções, scroll-video, simulador, formulário → WhatsApp) | ✅ no ar |
| GTM `GTM-TNQNF884` carregando no site | ✅ |
| Container GTM v1 (GA4 + conversão Ads WhatsApp + vinculador) | ✅ publicado |
| Container GTM v2 (`faq_open`, `cta_id`, `faq_question`) | ⏳ Pedro reimportar e publicar |
| GA4: "Interações com formulários" desligado | ✅ |
| GA4: dimensões personalizadas | ✅ orientado (Pedro) |
| GA4: eventos-chave `form_submit` e `click_whatsapp` | ⏳ marcar a estrela quando os eventos aparecerem em "Eventos recentes" |
| Dashboard `/dashboard` (login, Supabase, Ads, GA4) | ✅ login funcionando, coleta gravando |
| Dados de teste do painel | ⏳ Pedro rodar o `delete` (o MCP do Supabase recusa) |
| Canonical/OG/sitemap no domínio certo | ✅ `https://www.visaosolar.com` |
| Search Console (propriedade Domínio via TXT na Hostinger) | ✅ verificado · sitemap enviado, status "Não foi possível buscar" (normal nas primeiras horas) |

---

## Pendências

### Com o cliente
- [ ] Logo em vetor (SVG/AI/PDF). Hoje a LP usa PNG recortado do JPEG do WhatsApp
- [ ] **Depoimentos** (nome, cidade, texto/print/vídeo). A LP está **sem seção de depoimentos** por falta de material; não inventar
- [ ] Mais fotos/vídeos de obras (só há 3 fotos + 1 vídeo de 14 s)
- [ ] Potência total instalada (kWp), para virar mais um número de autoridade
- [ ] Confirmar WhatsApp: no código está `5562992129813` (com o 9). Briefing veio "62 9212-9813"
- [ ] Validar premissas do simulador: tarifa R$ 1,00/kWh, custo mínimo R$ 50, 120 kWh/kWp/mês, painel 575 W

### Internas (MP)
- [ ] **GTM:** reimportar `tracking/gtm-container-visao-solar.json` (Mesclar → Substituir conflitantes) e **publicar**. Conferir depois baixando `https://www.googletagmanager.com/gtm.js?id=GTM-TNQNF884` e procurando `faq_open` e `cta_id`
- [ ] **GA4:** marcar ⭐ `form_submit` e `click_whatsapp` em Administrador → Exibição de dados → Eventos → "Eventos recentes" (a tela nova não tem "Novo evento-chave"; não usar "Criar evento")
- [ ] **Supabase:** limpar as visitas de teste (SQL Editor): `delete from public.visaosolar_sessions;` (os eventos saem em cascata)
- [ ] **Dashboard:** conferir abas Google Ads (nome da conta = Visão Solar, não M|P) e GA4 (conta de serviço como Leitor na propriedade 558194391)
- [ ] **Search Console:** conferir em ~48 h se o sitemap mudou para "Sucesso"; usar "Inspecionar URL → Testar URL publicado → Solicitar indexação" na home. Se continuar erro, remover e reenviar o sitemap
- [ ] **Performance (LCP mobile 4,0 s no Lighthouse, desktop 0,8 s):** otimizações propostas e ainda não aplicadas (ver Decisões/Histórico): hero visível no 1º quadro (sem entrada a partir de opacity 0), `content-visibility: auto` nas seções abaixo da dobra, pausar animações infinitas fora da tela, carregar GTM/Lenis depois do 1º paint. Meta ≈ 1,8–2,2 s
- [ ] Vincular Search Console ao GA4
- [ ] Meta Pixel: só se houver campanha Meta (ID ainda não passado)
- [ ] Renomear repo/pasta para "visao-solar" (opcional; hoje `lp-vis-o-energy` / `visao-energy-lp`)

---

## Decisões

| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-10-08 | CTA único: "Orçamento Gratuito" | Escolhido pelo cliente no briefing |
| 2026-10-08 | Formulário (nome, telefone, cidade, conta de luz) → redirect pro WhatsApp do consultor | Definido no briefing; sem CRM |
| 2026-10-08 | Briefing válido é o PDF em `Briefing's/` | O .docx está corrompido e não abre |
| 2026-10-08 | Conceito visual "o sol como janela": tema escuro + gradiente da logo só onde há energia | Diferenciação no nicho solar (concorrentes usam azul/verde e banco de imagem) |
| 2026-10-08 | Scroll-video em **canvas com 96 frames WebP** (não `<video>` com currentTime) | `currentTime` engasga no iOS Safari; frames são fluidos em todo device |
| 2026-10-08 | Scroll-linked com hook próprio (rAF + CSS vars), sem GSAP | Mantém o stack padrão (react-spring + Lenis) e não re-renderiza React no scroll |
| 2026-10-08 | Sem seção de depoimentos na v1 | Cliente não enviou; depoimento inventado é proibido |
| 2026-10-08 | Simulador com teto de 95% e custo mínimo de R$ 50 | Honesto: contas baixas economizam < 95% por causa da taxa mínima |
| 2026-10-08 | Conta de luz da seção "derrete" de R$ 1.200 para R$ 60 (95%) e é marcada como "exemplo ilustrativo" | Coerente com a promessa e com o simulador |
| 2026-10-08 | Next 16 com `cacheComponents` (padrão do scaffold) | Ano do rodapé via `"use cache"` |
| 2026-10-08 | Marca na LP: **Visão Solar** (não "Visão Energy") | Pedido do Pedro |
| 2026-10-08 | Copy sem travessões (—) | Pedido do Pedro; frases reescritas com ponto, vírgula ou dois-pontos. O "−95%" da conta é sinal de menos e ficou |
| 2026-10-08 | Repo **público**: briefing, fotos e logos originais fora (`.gitignore` da raiz) | Não expor material interno do cliente; versões otimizadas estão em `public/` |
| 2026-10-09 | Conversão Google Ads "Clique no Botão de Wpp" dispara em `click_whatsapp` **e** `form_submit` | Os dois caminhos levam ao WhatsApp; um não dispara o outro (sem contagem dupla) |
| 2026-10-09 | GA4 só via GTM; container versionado em `tracking/` | Padrão M|P (nada de gtag no código) |
| 2026-10-09 | Dashboard = template M\|P (skill `lp-tracking-dashboard`) portado para Next (rotas em `app/api`, UI estática em `public/dashboard`) | Reaproveita lógica e 83 testes validados na Nova Ferragista |
| 2026-10-09 | Formulário conta como `whatsapp_click` no painel (`cta_location: cta_whatsapp_formulario`) e conversões saem na hora (fetch keepalive) | O form termina no WhatsApp; navegadores in-app descartam o beacon do pagehide |
| 2026-10-09 | `pushEvent` zera parâmetros (RESET) a cada push | O GTM herdava `secao`/`local` do evento anterior |
| 2026-10-09 | Seção da conta de luz com `id="conta-de-luz"` | `id="conta"` colidia com o campo do formulário e quebrava o `<label>` |
| 2026-10-09 | Search Console como propriedade **Domínio** (TXT na Hostinger) | Cobre www/sem www/http/https; DNS do domínio está na Hostinger (dns-parking.com) |

---

## Histórico

| Data | O que foi feito |
|------|-----------------|
| 2026-10-08 | Criados CLAUDE.md (contexto do projeto a partir do briefing e das logos) e MEMORY.md |
| 2026-10-08 | Design system (DESIGN-SYSTEM.md) + LP completa em `visao-energy-lp/`: 12 seções, scroll-video, simulador, tracking GTM/UTM, SEO/JSON-LD. Testes unitários + E2E do fluxo de conversão |
| 2026-10-08 | Repo criado: github.com/mppartnersprincipal-svg/lp-vis-o-energy. App em `visao-energy-lp/` (Root Directory na Vercel) |
| 2026-10-08 | Seção de números: contador mais perceptível (easeOutCubic 2,4 s, disparo com 30% de tela, stagger, barra de progresso) + correção do "+1.000" cortado |
| 2026-10-08 | Lighthouse: LCP mobile 4,0 s / desktop 0,8 s; causa = hero com entrada a partir de opacity 0 + main thread ocupada. Otimização proposta, não aplicada |
| 2026-10-08 | Travessões removidos da copy; marca trocada para Visão Solar (logo, title/OG, JSON-LD, rodapé, alts) |
| 2026-10-09 | Tracking: GTM ligado via env; container JSON (GA4, eventos, conversão Ads, vinculador) + `tracking/README.md` |
| 2026-10-09 | Dashboard `/dashboard` construído: coletor, 5 rotas, painel com a marca, migration `visaosolar_*` aplicada no Supabase compartilhado, 83 testes do painel + 20 da LP |
| 2026-10-09 | Deploy na Vercel em www.visaosolar.com; variáveis cadastradas; corrigidos `DASHBOARD_SECRET` curto e `NEXT_PUBLIC_SITE_URL` (.com.br → www.visaosolar.com) + redeploys; visita qa-seed gravou no Supabase; login do painel ok |
| 2026-10-09 | Search Console: propriedade Domínio verificada (TXT na Hostinger) e sitemap enviado; arquivo validado como Googlebot (200, XML) |
