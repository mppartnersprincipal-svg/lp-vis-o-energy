export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type UtmKey = (typeof UTM_KEYS)[number];
export type UtmParams = Partial<Record<UtmKey, string>>;

const STORAGE_KEY = "ve_utms";
const MAX_LENGTH = 120;

export function parseUtms(search: string): UtmParams {
  const params = new URLSearchParams(search);
  return UTM_KEYS.reduce<UtmParams>((acc, key) => {
    const valor = params.get(key)?.trim();
    return valor ? { ...acc, [key]: valor.slice(0, MAX_LENGTH) } : acc;
  }, {});
}

/** Guarda as UTMs da primeira página com UTM da sessão (first-touch). */
export function storeUtms(utms: UtmParams): void {
  if (Object.keys(utms).length === 0) return;
  try {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
  } catch {
    // storage indisponível (modo privado / bloqueado): UTMs seguem só na URL
  }
}

export function readStoredUtms(): UtmParams {
  try {
    const bruto = sessionStorage.getItem(STORAGE_KEY);
    if (!bruto) return {};
    const parsed: unknown = JSON.parse(bruto);
    if (typeof parsed !== "object" || parsed === null) return {};
    return UTM_KEYS.reduce<UtmParams>((acc, key) => {
      const valor = (parsed as Record<string, unknown>)[key];
      return typeof valor === "string" ? { ...acc, [key]: valor.slice(0, MAX_LENGTH) } : acc;
    }, {});
  } catch {
    return {};
  }
}
