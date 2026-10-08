"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useLead } from "@/components/LeadContext";
import { IconArrow, IconLock } from "@/components/ui/Icons";
import { EMPRESA } from "@/lib/constants";
import { maskPhone, parseBRL } from "@/lib/format";
import { buildLeadMessage, buildWhatsAppUrl, validateLead, type LeadErrors, type LeadInput } from "@/lib/lead";
import { pushEvent } from "@/lib/tracking";
import { readStoredUtms } from "@/lib/utm";

const ATRASO_REDIRECT_MS = 350; // dá tempo do GTM disparar as tags antes de sair da página
const CIDADES = [...EMPRESA.cidades, "Outra cidade de Goiás"];

export function LeadForm() {
  const { contaSimulada } = useLead();
  const formRef = useRef<HTMLFormElement>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState("");
  const [conta, setConta] = useState("");
  const [erros, setErros] = useState<LeadErrors>({});
  const [enviando, setEnviando] = useState(false);

  // Valor vindo do simulador sobrescreve o campo (padrão "ajustar estado quando a prop muda")
  const [simuladaAnterior, setSimuladaAnterior] = useState(contaSimulada);
  if (contaSimulada !== simuladaAnterior) {
    setSimuladaAnterior(contaSimulada);
    if (contaSimulada) setConta(String(contaSimulada.valor));
  }

  // Voltando do WhatsApp (bfcache), o botão precisa estar ativo de novo
  useEffect(() => {
    const reativar = (e: PageTransitionEvent) => e.persisted && setEnviando(false);
    window.addEventListener("pageshow", reativar);
    return () => window.removeEventListener("pageshow", reativar);
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const lead: LeadInput = { nome, telefone, cidade, conta: parseBRL(conta) };
    const novosErros = validateLead(lead);
    setErros(novosErros);

    const primeiroInvalido = Object.keys(novosErros)[0];
    if (primeiroInvalido) {
      formRef.current?.querySelector<HTMLElement>(`[name="${primeiroInvalido}"]`)?.focus();
      return;
    }

    const utms = readStoredUtms();
    setEnviando(true);
    pushEvent("form_submit", { cidade: lead.cidade, conta: lead.conta, ...utms });
    const url = buildWhatsAppUrl(buildLeadMessage(lead, utms));
    window.setTimeout(() => {
      window.location.href = url;
    }, ATRASO_REDIRECT_MS);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4" aria-describedby="form-aviso">
      <Campo id="nome" rotulo="Seu nome" erro={erros.nome}>
        <input
          id="nome"
          name="nome"
          autoComplete="name"
          placeholder="Como podemos te chamar?"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          aria-invalid={Boolean(erros.nome)}
          aria-describedby={erros.nome ? "nome-erro" : undefined}
          className="campo"
        />
      </Campo>

      <Campo id="telefone" rotulo="WhatsApp" erro={erros.telefone}>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(62) 9 9999-9999"
          value={telefone}
          onChange={(e) => setTelefone(maskPhone(e.target.value))}
          aria-invalid={Boolean(erros.telefone)}
          aria-describedby={erros.telefone ? "telefone-erro" : undefined}
          className="campo"
        />
      </Campo>

      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="cidade" rotulo="Cidade" erro={erros.cidade}>
          <select
            id="cidade"
            name="cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            aria-invalid={Boolean(erros.cidade)}
            aria-describedby={erros.cidade ? "cidade-erro" : undefined}
            className={`campo ${cidade ? "" : "text-texto-fraco"}`}
          >
            <option value="" disabled>
              Selecione
            </option>
            {CIDADES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Campo>

        <Campo id="conta" rotulo="Conta de luz média" erro={erros.conta}>
          <div className="relative">
            <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-texto-fraco">
              R$
            </span>
            <input
              id="conta"
              name="conta"
              inputMode="decimal"
              placeholder="600"
              value={conta}
              onChange={(e) => setConta(e.target.value.replace(/[^\d,.]/g, ""))}
              aria-invalid={Boolean(erros.conta)}
              aria-describedby={erros.conta ? "conta-erro" : undefined}
              className="campo pl-11"
            />
          </div>
        </Campo>
      </div>

      <button type="submit" disabled={enviando} className="btn-sol mt-2 w-full disabled:opacity-70" data-track-local="formulario">
        {enviando ? "Abrindo o WhatsApp…" : "Quero meu orçamento gratuito"}
        {!enviando && <IconArrow width={20} height={20} />}
      </button>

      <p id="form-aviso" role="status" aria-live="polite" className="flex items-center justify-center gap-2 text-center text-xs text-texto-fraco">
        <IconLock width={14} height={14} />
        Ao enviar, você fala direto com um consultor no WhatsApp. Sem spam.
      </p>
    </form>
  );
}

interface CampoProps {
  id: string;
  rotulo: string;
  erro?: string;
  children: ReactNode;
}

function Campo({ id, rotulo, erro, children }: CampoProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-texto-suave">
        {rotulo}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-1.5 text-sm font-medium text-sol-600">
          {erro}
        </p>
      )}
    </div>
  );
}
