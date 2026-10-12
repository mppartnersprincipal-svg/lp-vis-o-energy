# LP — Visão Solar

Landing page de captação de leads para empresa de energia solar em Goiânia e região. Objetivo: gerar pedidos de orçamento gratuito, com o lead indo direto para o WhatsApp do consultor.

> Histórico, decisões e pendências ficam em [MEMORY.md](MEMORY.md). Atualizar ao final de cada entrega.

---

## Cliente

| Campo | Valor |
|-------|-------|
| Cliente | **Visão Solar** (nome definido pelo Pedro em 2026-10-08; pastas e repo ainda se chamam "visao-energy") |
| Segmento | Energia solar fotovoltaica (residencial/comercial) |
| Objetivo da LP | Captação de leads → pedido de orçamento |
| CTA principal | "Orçamento Gratuito" |
| WhatsApp | (62) 9212-9813 → `5562992129813` (confirmar o 9º dígito) |
| Ticket médio | ~R$ 15 mil |
| Regiões atendidas | Goiânia, Aparecida de Goiânia, Anápolis, Caldas Novas |
| URL de produção | **https://www.visaosolar.com** (sem www redireciona para o www) |

---

## Oferta e Copy (do briefing — 06/10/2026)

- **Promessa (headline):** Economize até 95% na sua conta de luz.
- **Gancho:** Financiamento com carência de 90 dias.
- **Autoridade:** 7 anos de mercado · +1.000 usinas instaladas · 4 cidades atendidas.
- **Garantias:** Painéis 12 anos · Inversor 5 a 10 anos · Instalação/serviço 1 ano · Monitoramento da usina + equipe de pós-venda.
- **Regras de copy:** sem travessões (—); nada que o cliente não confirmou; sem depoimentos inventados.

### Objeções → respostas (viram FAQ)

| Objeção | Resposta do cliente |
|---|---|
| Payback | Entre 1 ano e meio e 2 anos |
| Financiamento | Linhas de crédito com carência de 90 dias + parcelamento no cartão com as melhores taxas |
| "Vale a pena / é furada?" | Grande carteira de clientes; diferencial da primeira vistoria até o pós-venda |
| Consumo mínimo | Conta a partir de R$ 250 já compensa |
| Manutenção | Limpeza das placas a cada 6 meses |
| Retorno é comprovado? | Sem resposta escrita do cliente; FAQ redigido com base no monitoramento e nos números de autoridade |

---

## Formulário de Lead

- **Campos:** Nome · Telefone/WhatsApp · Cidade · Valor médio da conta de luz
- **Após envio:** `form_submit` no dataLayer → redireciona (350 ms) para o WhatsApp do consultor com mensagem pré-preenchida (dados + UTMs)
- **Destino do lead:** WhatsApp do consultor (sem CRM/planilha)
- O valor escolhido no simulador pré-preenche o campo de conta (`LeadContext`)

---

## Stack

| Tecnologia | Versão | Função |
|---|---|---|
| Next.js | 16.4.0 | Framework (App Router, Turbopack, `cacheComponents: true`) |
| React | 19.3.0 | UI |
| TypeScript | 5 | Tipagem |
| Tailwind CSS | 4 | Estilização (via loader `@tailwindcss/turbopack` no `next.config.ts`) |
| @react-spring/web | 10.1.2 | Entradas, contadores, simulador, ícones |
| Lenis | 1.3.26 | Smooth scroll |
| Vitest | 5 | Testes da LP (`lib/lib.test.ts`) |
| node:test | — | Testes do painel (`tests/painel/`) |
| Playwright | 1.63 | Capturas / E2E |
| Supabase | — | Banco do painel (projeto compartilhado `khipnjfbxjgvmjvyxero`, tabelas `visaosolar_*`) |

> ⚠️ Next 16: ler `node_modules/next/dist/docs/` antes de usar APIs novas (ver `AGENTS.md`). Com `cacheComponents`, `new Date()` em Server Component precisa de `"use cache"`. Não sobrescrever o `next.config.ts` sem ler: ele tem o loader do Tailwind.

---

## Estrutura de Pastas

```
LP - Visão Energy/                 ← raiz do repo (github.com/mppartnersprincipal-svg/lp-vis-o-energy, PÚBLICO)
├── Briefing's/ · Fotos e Videos/ · Logos/   ← materiais brutos do cliente (fora do git)
├── visao-energy-lp/               ← O SITE (app Next.js; Root Directory na Vercel)
├── tracking/                      ← container GTM (JSON para importar) + README do tracking
├── DESIGN-SYSTEM.md               ← cores, tipografia, componentes-assinatura, movimento
├── DASHBOARD.md                   ← painel /dashboard: arquitetura, eventos, cta_id, variáveis, erros
├── CLAUDE.md
└── MEMORY.md
```

App (`visao-energy-lp/`):

```
├── app/
│   ├── layout.tsx            — Fontes, metadata/OG, GTM noscript, SmoothScroll, TrackingProvider
│   ├── page.tsx              — Ordem das seções + JSON-LD (LocalBusiness + FAQPage)
│   ├── globals.css           — Tokens @theme + utilitários (@utility) + componentes (@layer components)
│   ├── api/                  — collect, login, dashboard, ga4, google-ads (rotas do painel)
│   └── opengraph-image.tsx · sitemap.ts · robots.ts · icon.png · apple-icon.png
├── components/
│   ├── sections/             — SolarHero, Marquee, Stats, BillMeltdown, EconomySimulator,
│   │                           ProcessScrollVideo, Financing, Gallery, Guarantees,
│   │                           CoverageRadar, FAQ, LeadSection, LeadForm
│   ├── layout/               — Navbar, Footer, FloatingActions (barra mobile + WhatsApp, data-fab)
│   ├── motion/               — SmoothScroll (Lenis), Reveal, CountUp
│   ├── tracking/             — TrackingProvider (GTM + tracker.js), TrackingEvents, UTMCapture
│   ├── ui/                   — Icons, Logo, GlowCard
│   └── LeadContext.tsx       — Simulador → formulário (valor da conta)
├── hooks/                    — useScrollProgress (rAF compartilhado → CSS vars), usePrefersReducedMotion
├── lib/                      — constants, simulator, lead (validação + wa.me), utm, tracking (pushEvent/RESET/ctaIdFor), format, faq
│   └── painel/               — lógica do dashboard (template M|P): db, auth, payload, report, ga4, google-ads, consultas, http
├── public/
│   ├── images/ · frames/instalacao/ (96 WebP do scroll-video) · video/
│   ├── js/tracker.js         — coletor anônimo do painel (window.vsCollect)
│   └── dashboard/            — UI do painel (index.html + app.js), servida em /dashboard por rewrite
├── supabase/migrations/      — 0001_visaosolar_analytics.sql (já aplicada)
└── tests/painel/             — 83 testes node:test do painel
```

**Seções (`id`, na ordem):** `hero`, `numeros`, `conta-de-luz`, `simulador`, `como-funciona`, `financiamento`, `obras`, `garantias`, `atendimento`, `duvidas`, `orcamento`. Toda `<section>` nova precisa de `id` (funil do painel) e de `data-section` (GA4).

**Mídias:** geradas com ffmpeg a partir de `Fotos e Videos/` e `Logos/`. Para trocar o vídeo do scroll: `ffmpeg -i video.mp4 -vf "fps=96/<duração>,scale=464:-2" -c:v libwebp -quality 48 public/frames/instalacao/f%03d.webp`.

---

## Design

Fonte da verdade: **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)**. Resumo:

| Elemento | Valor |
|----------|-------|
| Conceito | "O sol como janela": o círculo da logo vira janela (hero), medidor (simulador) e radar (cidades) |
| Gradiente | `--gradiente-sol`: `#FFE01A → #FFC107 → #F7931E → #E5332A` |
| Fundo | Noite `#07070A` (única seção clara: conta de luz, creme `#FFF8EC`) |
| Fontes | Bricolage Grotesque (display) · Manrope (corpo) · JetBrains Mono (labels) |
| Tokens | `sol-*`, `noite-*`, `texto*`, `creme`, `linha` em `@theme` |
| Painel | Mesmas cores/fontes da marca em `public/dashboard/index.html` |

> Cores da marca tiradas de JPEG do WhatsApp; revisar quando chegar a logo em vetor.

---

## Comandos (dentro de `visao-energy-lp/`)

```bash
npm install           # Instalar dependências
npm run dev           # Desenvolvimento (http://localhost:3000)
npm run build         # Build de produção
npm test              # Vitest (LP) + node:test (painel)
npm run test:painel   # Só o painel
npx tsc --noEmit && npx eslint .
```

---

## Trackeamento (Obrigatório)

Padrão MP Assessoria. GA4/Ads/Pixel **só pelo GTM**, nunca no código.

| Item | ID |
|------|----|
| GTM | `GTM-TNQNF884` |
| GA4 | `G-51019MQH3T` (propriedade numérica `558194391`) |
| Google Ads | conta `548-350-1029` (via MCC `603-989-2603`) · conversão WhatsApp `18498532624` / `nNp7CLTZ7pYdEJDq5PRE` |
| Meta Pixel | não configurado |

**Eventos (dataLayer):** `click_whatsapp`, `click_cta`, `click_phone`, `form_submit`, `simulator_change`, `faq_open`, `section_view`, `scroll_25/50/75/100`.
**Parâmetros:** `local`, `texto`, `cta_id`, `secao`, `cidade`, `conta`, `faq_question` + UTMs. `pushEvent` zera todos a cada push (RESET).
**Conversão Ads:** dispara em `click_whatsapp` e `form_submit`. No GA4, "Interações com formulários" está desligado (evita `form_submit` duplicado).
**UTMs:** first-touch em `sessionStorage` (`ve_utms`), incluídas nos eventos e na mensagem do WhatsApp.
**Container versionado:** [tracking/gtm-container-visao-solar.json](tracking/gtm-container-visao-solar.json). Passo a passo em [tracking/README.md](tracking/README.md).
**Dashboard:** painel próprio em `/dashboard` (Supabase + Google Ads + GA4). Detalhes em [DASHBOARD.md](DASHBOARD.md).

---

## SEO

- Schema.org `LocalBusiness` (4 cidades em `areaServed`) + `FAQPage`
- Metadata completa (title, description, OG, canonical) com `NEXT_PUBLIC_SITE_URL=https://www.visaosolar.com`
- `robots.txt` bloqueia `/dashboard` e `/api/`; sitemap em `/sitemap.xml`
- **Search Console:** propriedade **Domínio** `visaosolar.com` (TXT na Hostinger), sitemap enviado
- Hierarquia h1 > h2 > h3, alt text em todas as imagens

---

## Deploy

- **Plataforma:** Vercel, projeto `visao-energy-lp`, **Root Directory `visao-energy-lp`**
- **Domínio:** https://www.visaosolar.com (DNS na **Hostinger**)
- **Branch de produção:** `main` (push = deploy automático)
- **Variáveis:** lista em `visao-energy-lp/.env.example`. `NEXT_PUBLIC_*` como Config (públicas); as do painel como Secret. **Toda variável nova só vale após redeploy** (`vercel redeploy <url> --target production`)
- **Performance:** seções abaixo da dobra têm `.cv-auto` (content-visibility); seção nova abaixo da dobra deve receber a classe. Elementos do hero que podem ser LCP não podem começar com `opacity: 0` (usar `surgir-lcp`/`nascer-lcp`). Não tirar o preload da Bricolage/Manrope (CLS). Saltos por âncora dependem do `AnchorGuard` + `getLenis().resize()`
- **Pegadinhas já vistas:** `DASHBOARD_SECRET` < 16 caracteres faz o login responder "Dashboard não configurado"; `vercel link` reescreve o `.env.local` e acrescenta `.env*` no `.gitignore` (remover a duplicata para o `.env.example` não ser ignorado)
- O Claude **não** lê credenciais de outros projetos, **não** grava variáveis na Vercel e o `delete` pelo MCP do Supabase é recusado: passar ao Pedro
