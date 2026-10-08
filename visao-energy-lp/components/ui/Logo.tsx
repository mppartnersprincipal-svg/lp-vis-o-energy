import Image from "next/image";

interface LogoProps {
  className?: string;
  tamanho?: number;
}

export function Logo({ className = "", tamanho = 40 }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/images/logo-vs.png" alt="" width={tamanho} height={tamanho} className="shrink-0" priority />
      <span className="font-display text-[1.15rem] font-extrabold leading-none tracking-[-0.03em]">
        Visão <span className="texto-sol">Solar</span>
      </span>
    </span>
  );
}
