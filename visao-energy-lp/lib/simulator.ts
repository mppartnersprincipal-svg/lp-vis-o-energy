// Estimativa de economia com energia solar — premissas conservadoras para Goiás.
// O valor exato é definido na visita técnica; a UI deixa isso explícito.

export const CONTA_MIN = 250;
export const CONTA_MAX = 5000;

/** R$/kWh com impostos (Equatorial Goiás, aproximado) */
export const TARIFA_KWH = 1.0;
/** Custo de disponibilidade (mínimo pago à distribuidora, bifásico ~50 kWh) */
export const CUSTO_MINIMO = 50;
/** Teto de economia prometido ao cliente */
export const ECONOMIA_MAXIMA = 0.95;
/** kWh gerados por kWp instalado por mês (irradiação média de Goiás) */
export const GERACAO_KWH_POR_KWP_MES = 120;
export const POTENCIA_PAINEL_KWP = 0.575;
export const AREA_PAINEL_M2 = 2.6;
export const VIDA_UTIL_ANOS = 25;

export interface SimulationResult {
  contaMensal: number;
  economiaMensal: number;
  economiaAnual: number;
  economiaVidaUtil: number;
  percentualEconomia: number;
  consumoKwh: number;
  potenciaKwp: number;
  numeroPaineis: number;
  areaM2: number;
}

export function clampConta(valor: number): number {
  if (!Number.isFinite(valor)) return CONTA_MIN;
  return Math.min(CONTA_MAX, Math.max(CONTA_MIN, valor));
}

export function simulateEconomy(contaInformada: number): SimulationResult {
  const contaMensal = clampConta(contaInformada);
  const contaResidual = Math.max(CUSTO_MINIMO, contaMensal * (1 - ECONOMIA_MAXIMA));
  const economiaMensal = contaMensal - contaResidual;
  const consumoKwh = contaMensal / TARIFA_KWH;
  const numeroPaineis = Math.ceil(consumoKwh / GERACAO_KWH_POR_KWP_MES / POTENCIA_PAINEL_KWP);

  return {
    contaMensal,
    economiaMensal,
    economiaAnual: economiaMensal * 12,
    economiaVidaUtil: economiaMensal * 12 * VIDA_UTIL_ANOS,
    percentualEconomia: economiaMensal / contaMensal,
    consumoKwh,
    potenciaKwp: Math.round(numeroPaineis * POTENCIA_PAINEL_KWP * 100) / 100,
    numeroPaineis,
    areaM2: Math.round(numeroPaineis * AREA_PAINEL_M2),
  };
}
