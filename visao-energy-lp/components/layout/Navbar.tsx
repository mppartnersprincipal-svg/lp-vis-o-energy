"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "#simulador", rotulo: "Simulador" },
  { href: "#como-funciona", rotulo: "Como funciona" },
  { href: "#obras", rotulo: "Obras" },
  { href: "#garantias", rotulo: "Garantias" },
  { href: "#duvidas", rotulo: "Dúvidas" },
];

export function Navbar() {
  const [rolou, setRolou] = useState(false);

  useEffect(() => {
    const atualizar = () => setRolou(window.scrollY > 24);
    atualizar();
    window.addEventListener("scroll", atualizar, { passive: true });
    return () => window.removeEventListener("scroll", atualizar);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        rolou ? "border-b border-linha bg-noite-950/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Principal" className="container-ve flex h-[var(--nav-h)] items-center justify-between gap-6">
        <a href="#" aria-label="Visão Solar, voltar ao início" className="shrink-0">
          <Logo tamanho={36} />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded-full px-4 py-2 text-sm font-semibold text-texto-suave transition-colors hover:bg-white/5 hover:text-texto">
                {l.rotulo}
              </a>
            </li>
          ))}
        </ul>

        <a href="#orcamento" className="btn-sol min-h-11 whitespace-nowrap px-5 text-sm" data-track="click_cta" data-track-local="navbar">
          <span className="sm:hidden">Orçamento grátis</span>
          <span className="hidden sm:inline">Orçamento Gratuito</span>
        </a>
      </nav>
    </header>
  );
}
