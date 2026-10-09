export type TrackingEventName =
  | "click_whatsapp"
  | "click_cta"
  | "click_phone"
  | "form_submit"
  | "simulator_change"
  | "faq_open"
  | "section_view"
  | `scroll_${25 | 50 | 75 | 100}`;

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    /** Coletor first-party do /dashboard (public/js/tracker.js) */
    vsCollect?: (name: string, props: Record<string, unknown>) => void;
  }
}

/**
 * O GTM guarda o último valor de cada chave do dataLayer: sem zerar, um evento
 * herdaria parâmetros do anterior (ex.: click_cta levando o `secao` de um section_view).
 */
const PARAMETROS = ["local", "texto", "secao", "cidade", "conta", "cta_id", "faq_question"] as const;
const RESET: DataLayerEntry = Object.fromEntries(PARAMETROS.map((k) => [k, undefined]));

/** Eventos do dataLayer que também alimentam o painel (nome no coletor). */
const COLETOR: Partial<Record<TrackingEventName, string>> = {
  click_whatsapp: "whatsapp_click",
  form_submit: "whatsapp_click", // o formulário termina no WhatsApp: conta como contato
  click_phone: "phone_click",
  click_cta: "cta_click",
  faq_open: "faq_open",
  simulator_change: "simulator_change",
};

function propsDoColetor(event: TrackingEventName, params: DataLayerEntry): Record<string, unknown> {
  if (event === "form_submit") return { cta_location: "cta_whatsapp_formulario", cidade: params.cidade, conta: params.conta };
  if (event === "faq_open") return { faq_question: params.faq_question };
  if (event === "simulator_change") return { conta: params.conta };
  return { cta_location: params.cta_id ?? params.local };
}

export function pushEvent(event: TrackingEventName, params: DataLayerEntry = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...RESET, ...params });

  const nomeColetor = COLETOR[event];
  if (nomeColetor && typeof window.vsCollect === "function") {
    window.vsCollect(nomeColetor, propsDoColetor(event, params));
  }
}

/** cta_id estável a partir do data-track-local do botão */
export function ctaIdFor(event: "click_whatsapp" | "click_cta", local: string): string {
  const slug = local.replace(/[^a-z0-9]+/gi, "_").toLowerCase();
  if (event === "click_whatsapp") return slug === "flutuante" ? "fab_whatsapp" : `cta_whatsapp_${slug}`;
  return `cta_${slug}`;
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
