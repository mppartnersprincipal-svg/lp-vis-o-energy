"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import { useInView } from "@react-spring/web";
import { Reveal } from "@/components/motion/Reveal";

interface ObraProps {
  className?: string;
  tag: string;
  titulo: string;
  children: ReactNode;
  atraso?: number;
}

/** Revela a obra com clip-path de baixo para cima + leve zoom-out. */
function Obra({ className = "", tag, titulo, children, atraso = 0 }: ObraProps) {
  const [ref, visivel] = useInView({ once: true, rootMargin: "0px 0px -12% 0px" });

  return (
    <figure
      ref={ref}
      className={`relative overflow-hidden rounded-[28px] bg-noite-800 ${className}`}
      style={{
        clipPath: visivel ? "inset(0% 0% 0% 0% round 28px)" : "inset(35% 0% 0% 0% round 28px)",
        transition: `clip-path 1.3s var(--ease-solar) ${atraso}ms`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ scale: visivel ? "1" : "1.25", transition: `scale 1.6s var(--ease-solar) ${atraso}ms` }}
      >
        {children}
      </div>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-noite-950/90 via-noite-950/10 to-transparent" />
      <figcaption className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <span className="eyebrow rounded-full border border-white/15 bg-noite-950/50 px-3 py-1.5 text-sol-300">{tag}</span>
        <span className="mt-3 block font-display text-[clamp(1.3rem,1rem+1vw,1.9rem)] font-bold tracking-tight">{titulo}</span>
      </figcaption>
    </figure>
  );
}

function VideoObra() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entrada]) => {
      if (entrada?.isIntersecting) video.play().catch(() => undefined);
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      poster="/images/instalacao-poster.webp"
      aria-label="Instalação de placas solares em andamento"
      className="size-full object-cover"
    >
      <source src="/video/instalacao-loop.mp4" type="video/mp4" />
    </video>
  );
}

export function Gallery() {
  return (
    <section id="obras" aria-labelledby="obras-titulo" data-section="obras" className="cv-auto secao bg-noite-900">
      <div className="container-ve">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Obras reais</p>
            <h2 id="obras-titulo" className="titulo-secao mt-4 max-w-[16ch]">
              Mais de 1.000 usinas. <span className="text-texto-fraco">Nenhuma foto de banco de imagem.</span>
            </h2>
          </div>
          <p className="max-w-[24rem] text-lg leading-relaxed text-texto-suave">
            Cada foto aqui é uma obra nossa, em telhados como o seu: cerâmica, fibrocimento ou metálico.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6 md:grid-rows-[340px_340px_360px] lg:gap-5">
          <Obra className="aspect-[4/3] md:col-span-4 md:row-span-2 md:aspect-auto" tag="Comercial · Telhado metálico" titulo="Usina de grande porte">
            <Image src="/images/obra-comercial.webp" alt="Usina solar comercial com centenas de placas em telhado metálico" fill sizes="(min-width: 768px) 66vw, 100vw" className="object-cover" />
          </Obra>
          <Obra className="aspect-[9/14] md:col-span-2 md:row-span-2 md:aspect-auto" tag="Ao vivo · Instalação" titulo="Equipe em ação" atraso={120}>
            <VideoObra />
          </Obra>
          <Obra className="aspect-[4/3] md:col-span-3 md:aspect-auto" tag="Residencial · Telha cerâmica" titulo="Casa em Goiânia e região" atraso={80}>
            <Image src="/images/obra-residencial-ceramica.webp" alt="Sistema solar residencial com 5 placas em telhado de cerâmica" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </Obra>
          <Obra className="aspect-[4/3] md:col-span-3 md:aspect-auto" tag="Residencial · Fibrocimento" titulo="Instalação em telha ondulada" atraso={160}>
            <Image src="/images/obra-residencial-fibrocimento.webp" alt="Sistema solar residencial com 6 placas em telhado de fibrocimento" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </Obra>
        </div>
      </div>
    </section>
  );
}
