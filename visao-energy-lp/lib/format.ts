const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const BRL_CENTAVOS = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
const NUMERO = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function formatBRL(valor: number, comCentavos = false): string {
  return (comCentavos ? BRL_CENTAVOS : BRL).format(valor);
}

export function formatNumber(valor: number): string {
  return NUMERO.format(valor);
}

/** Converte "R$ 1.234,56" ou "1234" em número; retorna NaN se inválido */
export function parseBRL(texto: string): number {
  const limpo = texto.replace(/[^\d,]/g, "").replace(",", ".");
  return limpo === "" ? Number.NaN : Number(limpo);
}

/** Máscara (62) 9 9999-9999 para celular / (62) 9999-9999 para fixo */
export function maskPhone(texto: string): string {
  const d = texto.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
}
