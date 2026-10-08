import { describe, expect, test, beforeEach, vi } from "vitest";
import { simulateEconomy, clampConta, CONTA_MIN, CONTA_MAX, CUSTO_MINIMO } from "./simulator";
import { formatBRL, parseBRL, maskPhone } from "./format";
import { parseUtms, storeUtms, readStoredUtms } from "./utm";
import { validateLead, buildLeadMessage, buildWhatsAppUrl } from "./lead";
import { pushEvent } from "./tracking";

describe("simulateEconomy", () => {
  test("economiza 95% quando a conta é alta o bastante para superar o custo mínimo", () => {
    const r = simulateEconomy(1000);
    expect(r.economiaMensal).toBe(950);
    expect(r.percentualEconomia).toBeCloseTo(0.95);
    expect(r.economiaAnual).toBe(11400);
    expect(r.economiaVidaUtil).toBe(285000);
  });

  test("respeita o custo mínimo da distribuidora em contas baixas", () => {
    const r = simulateEconomy(250);
    expect(r.economiaMensal).toBe(250 - CUSTO_MINIMO);
    expect(r.percentualEconomia).toBeLessThan(0.95);
  });

  test("dimensiona painéis suficientes para o consumo", () => {
    const r = simulateEconomy(600);
    expect(r.numeroPaineis).toBe(9);
    expect(r.potenciaKwp).toBeCloseTo(5.18, 2);
    expect(r.areaM2).toBe(23);
  });

  test("limita valores fora da faixa e trata entradas inválidas", () => {
    expect(clampConta(10)).toBe(CONTA_MIN);
    expect(clampConta(99999)).toBe(CONTA_MAX);
    expect(clampConta(Number.NaN)).toBe(CONTA_MIN);
    expect(simulateEconomy(-5).contaMensal).toBe(CONTA_MIN);
  });
});

describe("format", () => {
  test("formata moeda brasileira", () => {
    expect(formatBRL(1500).replace(/\s/g, " ")).toBe("R$ 1.500");
    expect(formatBRL(42.5, true).replace(/\s/g, " ")).toBe("R$ 42,50");
  });

  test("converte texto em reais para número", () => {
    expect(parseBRL("R$ 1.234,56")).toBeCloseTo(1234.56);
    expect(parseBRL("800")).toBe(800);
    expect(parseBRL("abc")).toBeNaN();
  });

  test("aplica máscara de telefone progressiva", () => {
    expect(maskPhone("")).toBe("");
    expect(maskPhone("62")).toBe("(62");
    expect(maskPhone("62999")).toBe("(62) 999");
    expect(maskPhone("6232221111")).toBe("(62) 3222-1111");
    expect(maskPhone("62992129813")).toBe("(62) 9 9212-9813");
    expect(maskPhone("629921298139999")).toBe("(62) 9 9212-9813");
  });
});

describe("utm", () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal("sessionStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
    });
  });

  test("extrai apenas parâmetros UTM preenchidos", () => {
    expect(parseUtms("?utm_source=google&utm_medium=cpc&utm_term=&gclid=x")).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
    });
  });

  test("mantém o primeiro toque da sessão", () => {
    storeUtms({ utm_source: "meta" });
    storeUtms({ utm_source: "google" });
    expect(readStoredUtms()).toEqual({ utm_source: "meta" });
  });

  test("ignora conteúdo corrompido no storage", () => {
    sessionStorage.setItem("ve_utms", "{quebrado");
    expect(readStoredUtms()).toEqual({});
  });

  test("não quebra quando o storage é bloqueado", () => {
    vi.stubGlobal("sessionStorage", {
      getItem: () => {
        throw new Error("bloqueado");
      },
      setItem: () => {
        throw new Error("bloqueado");
      },
    });
    expect(() => storeUtms({ utm_source: "x" })).not.toThrow();
    expect(readStoredUtms()).toEqual({});
  });
});

describe("lead", () => {
  const leadValido = { nome: "Maria", telefone: "(62) 9 9999-0000", cidade: "Goiânia", conta: 800 };

  test("aceita lead válido", () => {
    expect(validateLead(leadValido)).toEqual({});
  });

  test("aponta todos os campos inválidos", () => {
    const erros = validateLead({ nome: " ", telefone: "123", cidade: "", conta: Number.NaN });
    expect(Object.keys(erros).sort()).toEqual(["cidade", "conta", "nome", "telefone"]);
  });

  test("monta mensagem com dados do lead e origem da campanha", () => {
    const msg = buildLeadMessage(leadValido, { utm_source: "google", utm_campaign: "solar-go" });
    expect(msg).toContain("*Nome:* Maria");
    expect(msg).toContain("*Cidade:* Goiânia");
    expect(msg).toMatch(/Conta de luz média:\* R\$\s800/);
    expect(msg).toContain("_Origem: google / solar-go_");
  });

  test("omite origem quando não há UTMs", () => {
    expect(buildLeadMessage(leadValido)).not.toContain("Origem");
  });

  test("gera link wa.me com a mensagem codificada", () => {
    expect(buildWhatsAppUrl("Olá & tchau", "5562000000000")).toBe(
      "https://wa.me/5562000000000?text=Ol%C3%A1%20%26%20tchau",
    );
  });
});

describe("tracking", () => {
  test("envia eventos para o dataLayer", () => {
    vi.stubGlobal("window", {});
    pushEvent("click_cta", { local: "hero" });
    expect(window.dataLayer).toEqual([{ event: "click_cta", local: "hero" }]);
  });
});
