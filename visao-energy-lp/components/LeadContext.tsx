"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/** `envio` muda a cada clique, para que repetir o mesmo valor também atualize o formulário */
export interface ContaSimulada {
  valor: number;
  envio: number;
}

interface LeadContextValue {
  contaSimulada: ContaSimulada | null;
  setContaSimulada: (valor: number) => void;
}

const LeadContext = createContext<LeadContextValue | null>(null);

/** Compartilha o valor da conta simulado com o formulário de orçamento. */
export function LeadProvider({ children }: { children: ReactNode }) {
  const [contaSimulada, setEstado] = useState<ContaSimulada | null>(null);
  const setContaSimulada = (valor: number) => setEstado((atual) => ({ valor, envio: (atual?.envio ?? 0) + 1 }));
  return <LeadContext value={{ contaSimulada, setContaSimulada }}>{children}</LeadContext>;
}

export function useLead(): LeadContextValue {
  const ctx = useContext(LeadContext);
  if (!ctx) throw new Error("useLead precisa estar dentro de <LeadProvider>");
  return ctx;
}
