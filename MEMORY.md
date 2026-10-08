# MEMORY — LP Visão Energy

Memória do projeto entre sessões. Contexto fixo do projeto fica no [CLAUDE.md](CLAUDE.md); aqui ficam o histórico, as decisões e as pendências.

**Regra:** ao final de cada sessão com alterações, adicionar 1 linha no Histórico e atualizar Pendências/Decisões.

---

## Status atual

**Fase:** LP v1 construída e verificada localmente (build, testes e E2E passando). Aguardando revisão do Pedro + materiais do cliente para v2 e deploy.

---

## Pendências

### Com o cliente
- [ ] Confirmar nome oficial: "Visão Energy" ou "Visão Solar" (o briefing usa os dois). A LP usa "Visão Energy"
- [ ] Logo em vetor (SVG/AI/PDF). Hoje a LP usa PNG recortado do JPEG do WhatsApp
- [ ] **Depoimentos** (nome, cidade, texto/print/vídeo). A LP está **sem seção de depoimentos** por falta de material; não inventar
- [ ] Mais fotos/vídeos de obras (só há 3 fotos + 1 vídeo de 14s)
- [ ] Potência total instalada (kWp), para virar mais um número de autoridade
- [ ] Confirmar WhatsApp: no código está `5562992129813` (com o 9). Briefing veio "62 9212-9813"
- [ ] Domínio de produção (`NEXT_PUBLIC_SITE_URL`; hoje o placeholder é visaoenergy.com.br)
- [ ] Validar premissas do simulador: tarifa R$ 1,00/kWh, custo mínimo R$ 50, 120 kWh/kWp/mês, painel 575 W

### Internas (MP)
- [ ] Revisão visual do Pedro (`npm run dev` em `visao-energy-lp/`)
- [ ] Criar container GTM + GA4 (e Meta Pixel / Google Ads se houver campanha) e preencher `.env`
- [ ] Configurar no GTM as conversões: `form_submit`, `click_whatsapp`, `click_cta`
- [ ] Dashboard Looker Studio
- [ ] Repositório GitHub + deploy Vercel + domínio

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

---

## Histórico

| Data | O que foi feito |
|------|-----------------|
| 2026-10-08 | Criados CLAUDE.md (contexto do projeto a partir do briefing e das logos) e MEMORY.md |
| 2026-10-08 | Design system (DESIGN-SYSTEM.md) + LP completa em `visao-energy-lp/`: 12 seções, scroll-video, simulador, tracking GTM/UTM, SEO/JSON-LD. 17 testes unitários + E2E do fluxo de conversão passando |
| 2026-10-08 | Repo criado: github.com/mppartnersprincipal-svg/lp-vis-o-energy (**público**; materiais brutos do cliente fora via .gitignore). App em `visao-energy-lp/` → na Vercel, Root Directory = `visao-energy-lp` |
| 2026-10-08 | Seção de números: contador mais perceptível (easeOutCubic 2,4s, disparo com 30% de tela, stagger, barra de progresso) + correção do "+1.000" cortado |
