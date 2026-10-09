# Trackeamento: LP Visão Solar

| Item | ID |
|---|---|
| GTM | `GTM-TNQNF884` |
| GA4 | `G-51019MQH3T` |
| Google Ads: conversão "Clique no Botão de Wpp" | ID `18498532624` · rótulo `nNp7CLTZ7pYdEJDq5PRE` |

O site só carrega o GTM (`NEXT_PUBLIC_GTM_ID`). GA4 e Google Ads são tags **dentro do GTM**, nunca no código.

---

## O que o site envia para o dataLayer

| Evento | Quando | Parâmetros |
|---|---|---|
| `click_whatsapp` | Clique em qualquer link do WhatsApp (botão flutuante, barra mobile, FAQ, rodapé) | `local`, `texto`, UTMs |
| `form_submit` | Envio válido do formulário, logo antes de abrir o WhatsApp | `cidade`, `conta`, UTMs |
| `click_cta` | Clique em "Orçamento Gratuito" e demais CTAs | `local`, `texto`, UTMs |
| `simulator_change` | Usuário ajusta o simulador | `conta` |
| `section_view` | Cada seção entra no centro da tela (1x por seção) | `secao` |
| `scroll_25/50/75/100` | Profundidade de rolagem | — |

`local` identifica de onde veio o clique: `hero`, `navbar`, `simulador`, `financiamento`, `barra-mobile`, `flutuante`, `faq`, `rodape`, `formulario`.

---

## 1. GTM: importar o container

1. GTM → **Administrador** → **Importar contêiner**.
2. Arquivo: `tracking/gtm-container-visao-solar.json`.
3. Espaço de trabalho: **Existente → Default Workspace**.
4. Opção: **Mesclar** → **Substituir tags, acionadores e variáveis conflitantes**.
5. Confira o resumo: **4 tags, 3 acionadores, 5 variáveis**.

O que entra:

| Tag | Acionador |
|---|---|
| Google Tag - GA4 (G-51019MQH3T) | Inicialização - Todas as páginas |
| GA4 - Eventos da LP (nome do evento = `{{Event}}`) | `CE - Eventos da LP` (regex com todos os eventos acima) |
| Google Ads - Conversão WhatsApp | `CE - click_whatsapp` **e** `CE - form_submit` |
| Google Ads - Vinculador de conversões | Todas as páginas |

> A conversão do Ads dispara nos **dois** caminhos que levam ao WhatsApp (clique direto e formulário). Um não dispara o outro, então não há contagem dupla. Se quiser medir o formulário como conversão separada, crie outra ação no Google Ads e troque o acionador `CE - form_submit` para ela.

6. **Visualizar** (Tag Assistant) na URL do site → clique no WhatsApp e envie o formulário → confira as tags disparando.
7. **Enviar** → nome da versão: "v1 - LP Visão Solar" → **Publicar**.

## 2. GA4: ajustes obrigatórios

1. **Administrador → Fluxos de dados → (site) → Medição otimizada → engrenagem → desligar "Interações com formulários".**
   O GA4 gera sozinho um evento chamado `form_submit`. Sem desligar, o formulário conta em dobro.
2. **Administrador → Eventos-chave:** marcar `form_submit` e `click_whatsapp` (os eventos aparecem na lista após o 1º disparo; ou crie manualmente pelo nome).
3. **Administrador → Definições personalizadas → Criar dimensões personalizadas** (escopo: evento):
   `local`, `secao`, `cidade`, `texto`.
   E uma **métrica personalizada** `conta` (unidade: moeda).
4. **Vincular ao Google Ads:** Administrador → Vinculações de produtos → Google Ads.

## 3. Google Ads

- Ação de conversão "Clique no Botão de Wpp": contagem **Uma** (lead), janela padrão.
- Após o 1º disparo real, o status muda para **"Gravando conversões"** (pode levar algumas horas).

## 4. Vercel

Settings → Environment Variables (Production e Preview):

```
NEXT_PUBLIC_GTM_ID=GTM-TNQNF884
NEXT_PUBLIC_GA4_ID=G-51019MQH3T
NEXT_PUBLIC_SITE_URL=https://<dominio-final>
```

## 5. Dashboard (Looker Studio)

Fonte: GA4 `G-51019MQH3T`. Métricas: sessões, `form_submit` + `click_whatsapp` (eventos-chave), taxa de conversão, origem/mídia, campanha, dispositivo, `local` do clique e `cidade` do lead.
