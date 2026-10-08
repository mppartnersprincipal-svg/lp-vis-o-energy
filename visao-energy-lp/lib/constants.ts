// Dados do negócio — fonte: briefing do cliente (06/10/2026)

export const EMPRESA = {
  nome: "Visão Energy",
  anosDeMercado: 7,
  usinasInstaladas: 1000,
  economiaMaxima: 95,
  carenciaDias: 90,
  cidades: ["Goiânia", "Aparecida de Goiânia", "Anápolis", "Caldas Novas"],
} as const;

// TODO(cliente): confirmar se o número tem o 9º dígito (briefing: 62 9212-9813)
export const WHATSAPP_NUMBER = "5562992129813";
export const WHATSAPP_DISPLAY = "(62) 9 9212-9813";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visaoenergy.com.br";

export const GARANTIAS = [
  { titulo: "Painéis solares", prazo: "12 anos", detalhe: "Garantia de fábrica contra defeitos nos módulos." },
  { titulo: "Inversor", prazo: "5 a 10 anos", detalhe: "Conforme o fabricante e o modelo do seu projeto." },
  { titulo: "Instalação", prazo: "1 ano", detalhe: "Garantia sobre o serviço executado pela nossa equipe." },
  { titulo: "Monitoramento", prazo: "Contínuo", detalhe: "Acompanhamento da geração e equipe de pós-venda." },
] as const;
