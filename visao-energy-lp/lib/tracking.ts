export type TrackingEventName =
  | "click_whatsapp"
  | "click_cta"
  | "click_phone"
  | "form_submit"
  | "simulator_change"
  | "section_view"
  | `scroll_${25 | 50 | 75 | 100}`;

type DataLayerEntry = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
  }
}

export function pushEvent(event: TrackingEventName, params: DataLayerEntry = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...params });
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "";
