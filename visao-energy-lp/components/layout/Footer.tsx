import { Logo } from "@/components/ui/Logo";
import { EMPRESA, WHATSAPP_DISPLAY } from "@/lib/constants";
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/lead";

async function anoAtual() {
  "use cache";
  return new Date().getFullYear();
}

export async function Footer() {
  const ano = await anoAtual();

  return (
    <footer className="cv-auto relative overflow-hidden border-t border-linha pb-28 pt-16 lg:pb-10">
      <div className="container-ve grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo tamanho={44} />
          <p className="mt-5 max-w-[22rem] leading-relaxed text-texto-suave">
            Projeto, instalação e monitoramento de usinas solares residenciais e comerciais em Goiás. {EMPRESA.anosDeMercado} anos
            de mercado, mais de 1.000 usinas instaladas.
          </p>
        </div>

        <div>
          <p className="eyebrow text-texto-fraco">Atendemos</p>
          <ul className="mt-4 space-y-2 text-texto-suave">
            {EMPRESA.cidades.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-texto-fraco">Contato</p>
          <a
            href={buildWhatsAppUrl(DEFAULT_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block font-display text-xl font-bold transition-colors hover:text-sol-400"
            data-track-local="rodape"
          >
            {WHATSAPP_DISPLAY}
          </a>
          <p className="mt-1 text-sm text-texto-fraco">WhatsApp comercial</p>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="titulo-display pointer-events-none mt-16 select-none whitespace-nowrap text-center text-[15.5vw] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.08)]"
      >
        VISÃO SOLAR
      </p>

      <div className="container-ve mt-8 flex flex-col justify-between gap-2 border-t border-linha pt-6 text-xs text-texto-fraco sm:flex-row">
        <p>© {ano} Visão Solar. Todos os direitos reservados.</p>
        <p>
          Desenvolvido por <span className="text-texto-suave">MP Assessoria Digital</span>
        </p>
      </div>
    </footer>
  );
}
