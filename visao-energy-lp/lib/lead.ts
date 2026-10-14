import { formatBRL } from "./format";
import type { UtmParams } from "./utm";
import { WHATSAPP_NUMBER } from "./constants";

export interface LeadInput {
  nome: string;
  telefone: string;
  cidade: string;
  conta: number;
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export function validateLead(lead: LeadInput): LeadErrors {
  const erros: LeadErrors = {};
  if (lead.nome.trim().length < 2) erros.nome = "Digite seu nome.";
  const digitos = lead.telefone.replace(/\D/g, "");
  if (digitos.length < 10 || digitos.length > 11) erros.telefone = "Digite um WhatsApp válido com DDD.";
  if (!lead.cidade.trim()) erros.cidade = "Selecione sua cidade.";
  if (!Number.isFinite(lead.conta) || lead.conta <= 0) erros.conta = "Informe o valor médio da sua conta.";
  return erros;
}

export function buildLeadMessage(lead: LeadInput, utms: UtmParams = {}): string {
  const linhas = [
    "Olá! Quero um *orçamento gratuito* de energia solar.",
    "",
    `*Nome:* ${lead.nome.trim()}`,
    `*WhatsApp:* ${lead.telefone.trim()}`,
    `*Cidade:* ${lead.cidade.trim()}`,
    `*Conta de luz média:* ${formatBRL(lead.conta)}`,
  ];
  return [...linhas, ...linhasDeOrigem(utms)].join("\n");
}

/** Mensagem dos botões de CTA que abrem o WhatsApp direto (sem passar pelo formulário). */
export function buildCtaMessage(utms: UtmParams = {}, conta?: number): string {
  const linhas = [DEFAULT_WHATSAPP_MESSAGE];
  if (conta && Number.isFinite(conta) && conta > 0) linhas.push("", `*Conta de luz média:* ${formatBRL(conta)}`);
  return [...linhas, ...linhasDeOrigem(utms)].join("\n");
}

function linhasDeOrigem(utms: UtmParams): string[] {
  const origem = [utms.utm_source, utms.utm_medium, utms.utm_campaign].filter(Boolean).join(" / ");
  return origem ? ["", `_Origem: ${origem}_`] : [];
}

export function buildWhatsAppUrl(mensagem: string, numero: string = WHATSAPP_NUMBER): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const DEFAULT_WHATSAPP_MESSAGE = "Olá! Vim pelo site e quero um orçamento gratuito de energia solar.";
