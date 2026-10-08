"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScrollProgress, smoothstep } from "@/hooks/useScrollProgress";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { IconArrow } from "@/components/ui/Icons";
import { EMPRESA } from "@/lib/constants";

/**
 * Assinatura da marca: o círculo da logo vira um "sol-janela" com a obra dentro.
 * Ao rolar, o círculo se expande até cobrir a tela (clip-path) e revela a usina.
 */
export function SolarHero() {
  const secaoRef = useRef<HTMLElement>(null);
  const reduzido = usePrefersReducedMotion();

  // Com movimento reduzido o hero fica estático (--e = 0: texto e CTAs visíveis)
  useScrollProgress(
    secaoRef,
    (p) => {
      secaoRef.current?.style.setProperty("--e", smoothstep(0.04, 0.72, p).toFixed(4));
    },
    "pin",
    !reduzido,
  );

  return (
    <section
      ref={secaoRef}
      aria-labelledby="hero-titulo"
      data-section="hero"
      className="hero-scroll relative"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden grao">
        {/* Brilho atrás do sol */}
        <div
          aria-hidden="true"
          className="hero-anel pointer-events-none absolute rounded-full respirar"
          style={{
            background: "radial-gradient(circle, rgb(247 147 30 / 0.45) 0%, rgb(229 51 42 / 0.12) 45%, transparent 70%)",
            scale: "2.3",
            opacity: "calc(1 - var(--e) * 1.6)",
          }}
        />

        {/* Raios girando */}
        <div
          aria-hidden="true"
          className="hero-anel pointer-events-none absolute"
          style={{ opacity: "calc(0.9 - var(--e) * 3)" }}
        >
          <div
            className="nascer absolute inset-0 rounded-full girar-lento"
            style={{
              scale: "1.32",
              background:
                "repeating-conic-gradient(from 0deg, rgb(255 193 7 / 0.55) 0deg 0.6deg, transparent 0.6deg 6deg)",
              mask: "radial-gradient(circle, transparent 66%, #000 67%, #000 70%, transparent 71%)",
              WebkitMask: "radial-gradient(circle, transparent 66%, #000 67%, #000 70%, transparent 71%)",
            }}
          />
          <div
            className="nascer absolute inset-0 rounded-full"
            style={{
              scale: "1.1",
              padding: "1.5px",
              background: "var(--gradiente-sol)",
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
              WebkitMask: "linear-gradient(#000 0 0) content-box xor, linear-gradient(#000 0 0)",
              opacity: 0.7,
            }}
          />
        </div>

        {/* Sol-janela com a obra */}
        <div className="hero-janela nascer absolute inset-0">
          <Image
            src="/images/obra-comercial.webp"
            alt="Usina solar comercial instalada pela Visão Energy em telhado metálico, em Goiás"
            fill
            priority
            quality={80}
            sizes="100vw"
            className="object-cover"
            style={{ scale: "calc(1.18 - var(--e) * 0.18)" }}
          />
          <div aria-hidden="true" className="bg-sol absolute inset-0 mix-blend-soft-light" style={{ opacity: "calc(0.35 - var(--e) * 0.35)" }} />
          <div aria-hidden="true" className="absolute inset-0 bg-noite-950" style={{ opacity: "calc(var(--e) * 0.62)" }} />
        </div>

        {/* Texto principal */}
        <div
          className="relative z-10 flex h-full items-start pt-[calc(var(--nav-h)+5svh)] lg:items-center lg:pt-[var(--nav-h)]"
          style={{
            opacity: "calc(1 - var(--e) * 2.4)",
            transform: "translate3d(0, calc(var(--e) * -16vh), 0)",
          }}
        >
          <div className="container-ve">
            <div className="max-w-[640px] lg:max-w-[52%]">
              <p className="eyebrow surgir flex items-center gap-2.5" style={{ ["--d" as string]: "100ms" }}>
                <span className="relative flex size-2">
                  <span className="pulso absolute inset-0 rounded-full bg-sol-400" />
                  <span className="relative size-2 rounded-full bg-sol-400" />
                </span>
                Energia solar em Goiânia e região
              </p>

              <h1
                id="hero-titulo"
                className="titulo-display surgir mt-5 text-balance text-[clamp(2.75rem,1.2rem+5.6vw,6.4rem)] [@media(max-height:700px)]:text-[2.5rem] lg:[@media(max-height:820px)]:text-[5rem]"
                style={{ ["--d" as string]: "220ms" }}
              >
                Economize até <span className="texto-sol">95%</span> na sua conta de luz.
              </h1>

              <p
                className="surgir mt-6 max-w-[34rem] text-[clamp(1.02rem,0.95rem+0.4vw,1.22rem)] leading-relaxed text-texto-suave"
                style={{ ["--d" as string]: "360ms" }}
              >
                Projeto, instalação e monitoramento da sua usina solar — com financiamento e{" "}
                <strong className="font-semibold text-texto">90 dias de carência</strong> para começar a pagar.
              </p>

              <div className="surgir mt-8 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "480ms" }}>
                <a href="#orcamento" className="btn-sol" data-track="click_cta" data-track-local="hero">
                  Quero meu orçamento gratuito
                  <IconArrow width={20} height={20} />
                </a>
                <a href="#simulador" className="btn-ghost hidden sm:inline-flex" data-track="click_cta" data-track-local="hero-simulador">
                  Simular minha economia
                </a>
                <a href="#simulador" className="text-center text-sm font-semibold text-sol-400 underline-offset-4 hover:underline sm:hidden">
                  ou simule sua economia ↓
                </a>
              </div>

              <dl
                className="surgir mt-12 hidden gap-8 border-t border-linha pt-6 sm:flex"
                style={{ ["--d" as string]: "620ms" }}
              >
                {[
                  { valor: `${EMPRESA.anosDeMercado} anos`, rotulo: "de mercado" },
                  { valor: "+1.000", rotulo: "usinas instaladas" },
                  { valor: "12 anos", rotulo: "de garantia nos painéis" },
                ].map((item) => (
                  <div key={item.rotulo}>
                    <dt className="sr-only">{item.rotulo}</dt>
                    <dd>
                      <span className="block font-display text-2xl font-bold tracking-tight">{item.valor}</span>
                      <span className="text-sm text-texto-fraco">{item.rotulo}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Declaração final, sobre a obra já revelada */}
        <div
          className="pointer-events-none absolute inset-0 z-20 flex items-end pb-[12svh] lg:items-center lg:pb-0"
          style={{
            opacity: "clamp(0, calc((var(--e) - 0.78) * 5), 1)",
            transform: "translate3d(0, calc((1 - var(--e)) * 60px), 0)",
          }}
        >
          <div className="container-ve">
            <p className="eyebrow text-sol-300">Obra real · Usina comercial · Goiás</p>
            <p className="titulo-display mt-4 max-w-[15ch] text-[clamp(2.4rem,1.2rem+5vw,6rem)]">
              Mais de <span className="texto-sol">1.000 telhados</span> em Goiás já geram a própria energia.
            </p>
            <p className="mt-5 text-lg text-texto-suave">O próximo pode ser o seu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
