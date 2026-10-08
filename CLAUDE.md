# LP — Visão Energy

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
| URL de produção | _a definir_ |

---

## Oferta e Copy (do briefing — 06/10/2026)

- **Promessa (headline):** Economize em até 95% na sua fatura de energia.
- **Gancho:** Financiamento com carência de 90 dias.
- **Autoridade:** 7 anos de mercado · +1.000 usinas instaladas · 4 cidades atendidas.
- **Garantias:** Painéis 12 anos · Inversor 5 a 10 anos · Instalação/serviço 1 ano · Monitoramento da usina + equipe de pós-venda.

### Objeções → respostas (viram FAQ)

| Objeção | Resposta do cliente |
|---|---|
| Payback | Entre 1 ano e meio e 2 anos |
| Financiamento | Linhas de crédito com carência de 90 dias + parcelamento no cartão com as melhores taxas |
| "Vale a pena / é furada?" | Grande carteira de clientes; diferencial da primeira vistoria até o pós-venda |
| Consumo mínimo | Conta a partir de R$ 250 já compensa |
| Manutenção | Limpeza das placas a cada 6 meses |
| Retorno é comprovado? | Mencionado pelo cliente, sem resposta escrita — redigir com base nos números de autoridade |

---

## Formulário de Lead

- **Campos:** Nome · Telefone/WhatsApp · Cidade · Valor médio da conta de luz
- **Após envio:** redirecionar direto para o WhatsApp do consultor, com mensagem pré-preenchida com os dados do formulário
- **Destino do lead:** WhatsApp do consultor (sem CRM/planilha)
- Disparar `form_submit` antes do redirect

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
| Vitest | 5 | Testes unitários (`lib/lib.test.ts`) |
| Playwright | 1.63 | Capturas / E2E |

> ⚠️ Next 16: ler `node_modules/next/dist/docs/` antes de usar APIs novas (ver `AGENTS.md`). Com `cacheComponents`, `new Date()` em Server Component precisa de `"use cache"`.

---

## Estrutura de Pastas

```
LP - Visão Energy/
├── Briefing's/         — Briefing do cliente (PDF é a fonte válida; o .docx está corrompido)
├── Fotos e Videos/     — Fotos reais de usinas + 1 vídeo (WhatsApp, converter p/ WebP/MP4 otimizado)
├── Logos/              — Logo "VS" em 2 versões (fundo preto e fundo branco)
├── visao-energy-lp/    — O SITE (app Next.js)
├── DESIGN-SYSTEM.md    — Cores, tipografia, componentes-assinatura, movimento
├── CLAUDE.md
└── MEMORY.md
```

App (`visao-energy-lp/`):

```
├── app/
│   ├── layout.tsx            — Fontes, metadata/OG, GTM noscript, SmoothScroll, TrackingProvider
│   ├── page.tsx              — Ordem das seções + JSON-LD (LocalBusiness + FAQPage)
│   ├── globals.css           — Tokens @theme + utilitários (@utility) + componentes (@layer components)
│   ├── opengraph-image.tsx · sitemap.ts · robots.ts · icon.png · apple-icon.png
├── components/
│   ├── sections/             — SolarHero, Marquee, Stats, BillMeltdown, EconomySimulator,
│   │                           ProcessScrollVideo, Financing, Gallery, Guarantees,
│   │                           CoverageRadar, FAQ, LeadSection, LeadForm
│   ├── layout/               — Navbar, Footer, FloatingActions (barra mobile + WhatsApp)
│   ├── motion/               — SmoothScroll (Lenis), Reveal, CountUp
│   ├── tracking/             — TrackingProvider, TrackingEvents, UTMCapture
│   ├── ui/                   — Icons, Logo, GlowCard
│   └── LeadContext.tsx       — Simulador → formulário (valor da conta)
├── hooks/                    — useScrollProgress (rAF compartilhado → CSS vars), usePrefersReducedMotion
├── lib/                      — constants, simulator, lead (validação + wa.me), utm, tracking, format, faq
└── public/
    ├── images/               — Fotos WebP, logo transparente, poster do vídeo
    ├── frames/instalacao/    — 96 frames WebP do vídeo (scroll-scrub em canvas)
    └── video/                — Loop MP4 mudo da instalação (galeria)
```

**Mídias:** geradas com ffmpeg a partir de `Fotos e Videos/` e `Logos/`. Para trocar o vídeo do scroll, regenerar os frames: `ffmpeg -i video.mp4 -vf "fps=96/<duração>,scale=464:-2" -c:v libwebp -quality 48 public/frames/instalacao/f%03d.webp`.

---

## Design

| Elemento | Valor |
|----------|-------|
Fonte da verdade: **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)**. Resumo:

| Elemento | Valor |
|----------|-------|
| Conceito | "O sol como janela" — o círculo da logo vira janela, medidor e radar |
| Gradiente | `--gradiente-sol`: `#FFE01A → #FFC107 → #F7931E → #E5332A` |
| Fundo | Noite `#07070A` (única seção clara: conta de luz, creme `#FFF8EC`) |
| Fontes | Bricolage Grotesque (display) · Manrope (corpo) · JetBrains Mono (labels) |
| Tokens | `sol-*`, `noite-*`, `texto*`, `creme`, `linha` em `@theme` |

> Cores da marca tiradas de JPEG do WhatsApp — revisar quando chegar a logo em vetor.

---

## Comandos (dentro de `visao-energy-lp/`)

```bash
npm install     # Instalar dependências
npm run dev     # Desenvolvimento (http://localhost:3000)
npm run build   # Build de produção
npx vitest run  # Testes unitários
npx tsc --noEmit && npx eslint .
```

---

## Trackeamento (Obrigatório)

Padrão MP Assessoria, implementado mesmo sem pedido no briefing.

| Ferramenta | Função |
|------------|--------|
| GTM | Container central, nenhuma tag hardcoded |
| GA4 | Analytics principal |
| Meta Pixel | Se houver campanha Meta |
| Google Ads Tag | Se houver campanha Google Ads |

**Eventos:** `click_whatsapp`, `click_cta`, `click_phone`, `form_submit`, `scroll_25/50/75/100`, `section_view`.
**UTMs:** capturar `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` e incluir na mensagem do WhatsApp.
**Env vars:** `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.
**Dashboard:** Looker Studio — sessões, conversões, origem/mídia, dispositivo.
**Referência:** projeto Sólida Transporte.

---

## SEO

- Schema.org `LocalBusiness` com as 4 cidades em `areaServed`
- Metadata completa (title, description, OG, canonical)
- Hierarquia h1 > h2 > h3, alt text em todas as imagens

---

## Deploy

- **Plataforma:** Vercel
- **Domínio:** _a definir_
- **Branch de produção:** `main`
