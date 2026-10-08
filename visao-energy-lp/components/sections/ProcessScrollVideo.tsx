"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TOTAL_FRAMES = 96;
const MAX_DPR = 2;
const frameSrc = (i: number) => `/frames/instalacao/f${String(i + 1).padStart(3, "0")}.webp`;

const ETAPAS = [
  { titulo: "Visita técnica gratuita", texto: "Um especialista vai até você, avalia o telhado, o sombreamento e o seu histórico de consumo." },
  { titulo: "Projeto sob medida", texto: "Dimensionamos o sistema para gerar o que a sua casa ou empresa realmente consome. Nem mais, nem menos." },
  { titulo: "Homologação", texto: "Cuidamos de toda a burocracia com a distribuidora. Você não perde tempo com papelada." },
  { titulo: "Instalação", texto: "Equipe técnica especializada instala tudo com segurança e com 1 ano de garantia no serviço." },
  { titulo: "Monitoramento", texto: "Acompanhamos a geração da sua usina, e o pós-venda continua com você muito depois da obra." },
] as const;

/** Frames do vídeo real da obra controlados pelo scroll, em canvas. */
export function ProcessScrollVideo() {
  const reduzido = usePrefersReducedMotion();
  const secaoRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const frameAtualRef = useRef(0);
  const etapaRef = useRef(0);
  const contadorRef = useRef<HTMLSpanElement>(null);
  const [etapa, setEtapa] = useState(0);

  const desenhar = useCallback((indice: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = frameMaisProximo(framesRef.current, indice);
    if (!img) return;
    const escala = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const w = img.naturalWidth * escala;
    const h = img.naturalHeight * escala;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }, []);

  // Pré-carrega os frames quando a seção se aproxima da tela
  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao || reduzido) return;
    const observer = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting || framesRef.current.length) return;
        observer.disconnect();
        framesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => {
            if (i === 0 || i === frameAtualRef.current) desenhar(frameAtualRef.current);
          };
          img.src = frameSrc(i);
          return img;
        });
      },
      { rootMargin: "150% 0px" },
    );
    observer.observe(secao);
    return () => observer.disconnect();
  }, [desenhar, reduzido]);

  // Canvas nítido em qualquer tamanho/DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduzido) return;
    const ajustar = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      desenhar(frameAtualRef.current);
    };
    const ro = new ResizeObserver(ajustar);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [desenhar, reduzido]);

  useScrollProgress(
    secaoRef,
    (p) => {
      secaoRef.current?.style.setProperty("--p", p.toFixed(4));
      const indice = Math.round(p * (TOTAL_FRAMES - 1));
      if (indice !== frameAtualRef.current) {
        frameAtualRef.current = indice;
        desenhar(indice);
        if (contadorRef.current) contadorRef.current.textContent = String(indice + 1).padStart(3, "0");
      }
      const novaEtapa = Math.min(ETAPAS.length - 1, Math.floor(p * ETAPAS.length));
      if (novaEtapa !== etapaRef.current) {
        etapaRef.current = novaEtapa;
        setEtapa(novaEtapa);
      }
    },
    "pin",
    !reduzido,
  );

  const ativa = ETAPAS[etapa];

  return (
    <section
      id="como-funciona"
      ref={secaoRef}
      aria-labelledby="processo-titulo"
      data-section="como-funciona"
      className={reduzido ? "secao relative" : "relative h-[440svh]"}
      style={{ ["--p" as string]: 0 }}
    >
      <div className={reduzido ? "container-ve" : "sticky top-0 h-[100svh] overflow-hidden"}>
        <div className={reduzido ? "grid gap-10 lg:grid-cols-2" : "container-ve flex h-full items-center lg:gap-16"}>
          {/* Coluna de texto (desktop) */}
          <div className={reduzido ? "" : "relative z-10 hidden flex-1 lg:block"}>
            <p className="eyebrow">Como funciona</p>
            <h2 id="processo-titulo" className="titulo-secao mt-4 max-w-[12ch]">
              Da vistoria ao primeiro <span className="texto-sol">kWh</span>.
            </h2>
            <ol className="relative mt-10 space-y-1 pl-8">
              <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-linha">
                <span className="bg-sol absolute inset-x-0 top-0 h-full origin-top" style={{ scale: "1 var(--p)" }} />
              </span>
              {ETAPAS.map((e, i) => {
                const aberta = reduzido || i === etapa;
                return (
                  <li key={e.titulo} aria-current={i === etapa ? "step" : undefined} className="relative py-3">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-8 top-[18px] size-[15px] rounded-full border-2 transition-all duration-500 ${
                        i <= etapa ? "border-sol-500 bg-sol-500 shadow-[0_0_18px_rgb(247_147_30/0.8)]" : "border-noite-700 bg-noite-950"
                      }`}
                    />
                    <p className={`flex items-baseline gap-3 transition-colors duration-500 ${aberta ? "text-texto" : "text-texto-fraco"}`}>
                      <span className="font-mono text-xs text-sol-400">0{i + 1}</span>
                      <span className="font-display text-[1.45rem] font-bold tracking-tight">{e.titulo}</span>
                    </p>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-solar)] ${aberta ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden pl-8 pt-1 leading-relaxed text-texto-suave">{e.texto}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Vídeo */}
          {reduzido ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/images/instalacao-poster.webp" alt="Equipe da Visão Solar instalando placas solares em telhado" className="mx-auto aspect-[464/832] max-h-[70svh] rounded-[32px] object-cover" />
          ) : (
            <div className="absolute inset-0 lg:relative lg:inset-auto lg:shrink-0 lg:rounded-[34px] lg:p-[1.5px] lg:[background:var(--gradiente-sol)] lg:shadow-[0_40px_120px_-30px_rgb(247_147_30/0.45)]">
              <div className="relative h-full w-full overflow-hidden bg-noite-900 lg:h-[min(80svh,740px)] lg:w-auto lg:aspect-[464/832] lg:rounded-[32px]">
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label="Vídeo de uma instalação real da Visão Solar: equipe montando placas solares em telhado residencial"
                  className="absolute inset-0 size-full"
                  style={{ backgroundImage: "url(/images/instalacao-poster.webp)", backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-noite-950/80 via-transparent to-noite-950/95 lg:from-noite-950/50 lg:to-noite-950/60" />

                {/* HUD */}
                <div aria-hidden="true" className="absolute inset-x-0 top-0 flex items-center justify-between p-5 pt-[calc(var(--nav-h)+8px)] font-mono text-[10.5px] tracking-[0.14em] text-texto/85 lg:pt-5">
                  <span className="flex items-center gap-2">
                    <span className="size-2 animate-pulse rounded-full bg-sol-700" />
                    OBRA REAL
                  </span>
                  <span>
                    FRAME <span ref={contadorRef}>001</span>/{TOTAL_FRAMES}
                  </span>
                </div>
                <div aria-hidden="true" className="absolute inset-x-5 bottom-5 hidden h-[3px] overflow-hidden rounded-full bg-white/15 lg:block">
                  <span className="bg-sol absolute inset-0 origin-left" style={{ scale: "var(--p) 1" }} />
                </div>

                {/* Texto sobreposto (mobile) */}
                <div className="absolute inset-x-0 bottom-0 p-5 pb-[calc(100px+env(safe-area-inset-bottom))] lg:hidden">
                  <p className="eyebrow">Como funciona · Etapa 0{etapa + 1}/05</p>
                  <h2 className="titulo-display mt-2 text-[2.1rem]">Da vistoria ao primeiro kWh.</h2>
                  <div className="mt-4 flex gap-1.5" aria-hidden="true">
                    {ETAPAS.map((e, i) => (
                      <span key={e.titulo} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= etapa ? "bg-sol-500" : "bg-white/20"}`} />
                    ))}
                  </div>
                  <div key={etapa} className="surgir mt-4 rounded-[20px] border border-white/10 bg-noite-950/70 p-4">
                    <p className="font-display text-xl font-bold">{ativa.titulo}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-texto-suave">{ativa.texto}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function frameMaisProximo(frames: HTMLImageElement[], indice: number): HTMLImageElement | null {
  for (let d = 0; d < frames.length; d++) {
    const antes = frames[indice - d];
    if (antes?.complete && antes.naturalWidth) return antes;
    const depois = frames[indice + d];
    if (depois?.complete && depois.naturalWidth) return depois;
  }
  return null;
}
