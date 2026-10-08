# Design System — Visão Energy

Derivado da logo: monograma **VS** vazado num **círculo com gradiente amarelo → laranja → vermelho**, ou seja, um sol. A logo existe sobre preto e sobre branco.

## Conceito: "O sol como janela"

O círculo da logo é o elemento estrutural da marca. Ele aparece como:
- **Sol / janela**: um círculo que mostra fotos de obras dentro dele e se expande com o scroll (hero).
- **Medidor**: arcos e anéis de progresso (simulador, 90 dias).
- **Radar**: círculos concêntricos (área de atendimento).

A noite é o fundo (preto quente) e o sol é a cor: o gradiente aparece só onde há energia, como CTA, números e destaques. Nunca como papel de parede.

---

## Cores

Os tokens ficam em `visao-energy-lp/app/globals.css` (`@theme`).

### Sol (marca)
| Token | Hex | Uso |
|---|---|---|
| `--color-sol-50` | `#FFF6D6` | Brilho, texto sobre gradiente escuro |
| `--color-sol-300` | `#FFE01A` | Início do gradiente, destaques pontuais |
| `--color-sol-400` | `#FFC107` | Âmbar: ícones, números |
| `--color-sol-500` | `#F7931E` | **Laranja principal**: CTA, links |
| `--color-sol-600` | `#F26A21` | Hover do CTA |
| `--color-sol-700` | `#E5332A` | Fim do gradiente, alertas ("bandeira vermelha") |

**Gradiente da marca** (`--gradiente-sol`): `linear-gradient(100deg, #FFE01A 0%, #FFC107 28%, #F7931E 62%, #E5332A 100%)`, na mesma direção da logo (esquerda → direita).

### Noite (superfícies)
| Token | Hex | Uso |
|---|---|---|
| `--color-noite-950` | `#07070A` | Fundo da página |
| `--color-noite-900` | `#0E0E13` | Seções alternadas |
| `--color-noite-800` | `#16161D` | Cards |
| `--color-noite-700` | `#22222B` | Bordas fortes, inputs |
| `--color-linha` | `rgba(255,255,255,.08)` | Divisores, bordas sutis |

### Texto
| Token | Hex | Uso |
|---|---|---|
| `--color-texto` | `#F6F3EC` | Texto principal (branco quente, nunca #FFF puro) |
| `--color-texto-suave` | `#A6A3AE` | Corpo secundário |
| `--color-texto-fraco` | `#6C6975` | Legendas, labels mono |
| `--color-creme` | `#FFF8EC` | Fundo da única seção clara (a conta de luz) |

**Contraste:** texto `#F6F3EC` sobre `#07070A` dá 18:1. O botão laranja `#F7931E` leva texto **preto** `#07070A` (8,9:1), nunca branco.

---

## Tipografia

Todas as fontes são servidas via `next/font/google` (self-hosted no build, sem requisição externa).

| Papel | Fonte | Uso |
|---|---|---|
| Display | **Bricolage Grotesque** (700–800) | H1, H2, números grandes. Tracking −0,04em, line-height 0,92 |
| Corpo | **Manrope** (400–700) | Parágrafos, botões, formulário |
| Técnica | **JetBrains Mono** (500) | Eyebrows, labels de dados (kWp, kWh, GO), HUD do vídeo. Caixa alta, tracking +0,14em |

### Escala (fluida com `clamp`)
| Nível | Mobile → Desktop |
|---|---|
| Display XL (hero) | 3,1rem → 7,5rem |
| H2 | 2,2rem → 4,5rem |
| H3 | 1,35rem → 1,75rem |
| Corpo L | 1,05rem → 1,25rem |
| Corpo | 1rem |
| Label mono | 0,72rem |

---

## Espaço e forma

- **Container:** `max-width: 1280px`, gutter de 20px no mobile e 40px no desktop.
- **Seções:** padding vertical `clamp(5rem, 12vw, 10rem)`.
- **Raios:** cards com 28px, botões em pílula (999px), inputs com 16px. O círculo é a forma-mãe e cantos vivos não são usados.
- **Bordas:** 1px `--color-linha`. Cards de destaque usam borda em gradiente com um brilho que segue o cursor.
- **Sombras:** não há drop-shadow cinza. Só **glow quente**: `0 0 80px -20px rgba(247,147,30,.55)`.

---

## Componentes-assinatura

| Componente | Descrição |
|---|---|
| `SolarHero` | Sol-janela com a foto da usina. Com o scroll, o círculo expande até cobrir a tela (clip-path) |
| `BillMeltdown` | Conta de luz em papel creme cujo valor "derrete" de R$ 850 para R$ 42,50 com o scroll |
| `EconomySimulator` | Slider da conta → medidor em arco e economia mensal/anual/25 anos, kWp e nº de placas |
| `ScrollVideo` | Frames do vídeo da obra controlados pelo scroll em canvas, com HUD mono e etapas do processo |
| `NinetyDays` | Anel com 90 marcações que acendem uma a uma |
| `CoverageRadar` | Radar com varredura sobre as 4 cidades |
| `GlowCard` | Card com borda em gradiente que segue o cursor |
| `Marquee` | Faixa infinita com cidades e garantias |

---

## Movimento

- **Bibliotecas:** `@react-spring/web` para entradas, contadores, acordeão e hover; **Lenis** para smooth scroll; scroll-scrub com hook próprio (`useScrollProgress`), sticky + rAF e CSS vars, sem re-render.
- **Entrada padrão:** fade + slide-up de 28px, com `config.gentle` e stagger de 80ms.
- **Botão:** scale 1,04 + glow no hover e 0,97 no press.
- **Easing de scroll:** progresso linear mapeado com `smoothstep` nas transições de cena.
- **`prefers-reduced-motion`:** desliga Lenis, scrub e marquee e mostra o estado final estático.
- **Mobile:** sem `backdrop-filter` pesado em elementos que se movem, canvas em DPR ≤ 2 e frames com 464px de largura.

---

## Voz

Direta, confiante e local: fala de Goiânia e da conta da Equatorial. Frases curtas e números concretos. Promessa sempre com "até" (até 95%). Não usar jargão sem explicação: "kWp" vem acompanhado de "potência do sistema".
